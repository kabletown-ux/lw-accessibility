/**********************************************
***                                         ***
***     packages and global variables       ***
***                                         ***
**********************************************/

// packages needed
/* var ws = require("nodejs-websocket");
var wit = require('./wit');
var oauth = require('oauth'); */
var Q = require('q');
var restify = require("restify");
var request = require('request'); 

// the app server, setup to accept both query and post parameters
var vrexProxy = restify.createServer();
vrexProxy.use(restify.queryParser());
vrexProxy.use(restify.bodyParser());
// cross domain permissions
/* var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');
 
  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
};
vrexProxy.use(allowCrossDomain); */

var vrexURL = "http://vsp-po-02p.sys.comcast.net:8080";
var nlpPath = "/vsp/v1/nlp";
var shPath = "/vsp/v1/speech";
var kkPath = "/vsp/v1/knockknock";
var alivePath = "/vsp/alive.jsp";

var id2CID = {};

/**********************************************
***                                         ***
***     rest api handlers     ***
***                                         ***
**********************************************/

// GET call for client to send a knockknock to vrex
vrexProxy.get('/knockknock',function (req, res, next) {
	console.log( "/knockknock request for guid "+req.params.guid+" and deviceId "+req.params.deviceId+
					" at "+(new Date(new Date()-254000)));
	var proxyRes;
	if(req.params.guid&&req.params.deviceId) {
		var kkParams={
			'guid': req.params.guid,
			'deviceId': req.params.deviceId,
			'appId': "test-bdd8ab6e-0b97-4fe7-b37e-3850afce04bc",
			'prodId': "U0HycKR2HuPlHNSpKwk2ZEN0xNW/QU83",
		};
		var headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		var success = 500;
		request({
		   uri: vrexURL+kkPath, 
		   method: "POST",
		   headers: headers,
		   form: kkParams,
		   timeout: 5000
		}, function(error, result, data){ 
			if(error){
				console.log("vrex error: "+error);
				proxyRes = "vrex error: "+error;
			}else{
				var vrexRES = JSON.parse(data);
				if(vrexRES.cid) {
					/* console.log(data); */
					console.log("cid = "+vrexRES.cid);
					id2CID[req.params.deviceId] = vrexRES.cid;
					proxyRes = vrexRES.cid;
					success = 200;
				} else {
					console.log("no cid returned by vrex");
					console.log(JSON.parse(data));
					proxyRes = "no cid returned by vrex";
				}
			}
			res.writeHead(success, {
			  'Content-Length': Buffer.byteLength(proxyRes),
			  'Content-Type': 'text/plain'
			});
			res.write(proxyRes);
			res.end();			
		});
	} else {
		// missing guid or deviceId
		proxyRes = "vrex-proxy call is missing: ";
		if(!req.params.guid) {
			proxyRes = proxyRes + "guid ";
		}
		if(!req.params.deviceId) {
			proxyRes = proxyRes + "deviceId ";
		}
		res.writeHead(418, {
		  'Content-Length': Buffer.byteLength(proxyRes),
		  'Content-Type': 'text/plain'
		});
		res.write(proxyRes);
		res.end();
	}
});

// GET call for client to send a command transcript to vrex
vrexProxy.get('/command',function (req, res, next) {
	console.log( "/command request ["+req.params.transcript+"] for deviceId "+req.params.deviceId+
					" at "+(new Date(new Date()-254000)));
	var proxyRes;
	if(req.params.transcript&&req.params.deviceId) {
		var cid = id2CID[req.params.deviceId];
		if(cid) {
			console.log("vrex nlp call with cid: "+cid);
						
			var queryParams = "?timezone=US/Eastern&filters=NLP,X1&cid="+cid;		
			var success = 500;
			request({
			   uri: vrexURL+shPath+queryParams, 
			   method: "POST",
			   body: '{"transcription":"'+req.params.transcript+'","reza":"true"}',
			   timeout: 5000
			}, function(error, result, data){ 
				if(error){
					console.log("vrex error: "+error);
					proxyRes = "vrex error: "+error;
				}else{
					/* console.log(JSON.parse(data)); */
					proxyRes = data;
					success = 200;
				}
				res.writeHead(success, {
				  'Content-Length': Buffer.byteLength(proxyRes),
				  'Content-Type': 'text/plain'
				});
				res.write(proxyRes);
				res.end();			
			});
		} else {
			// no cid in lookup
			proxyRes = "vrex-proxy requires knockknock before command [deviceId="+req.params.deviceId+"]";
			console.log(proxyRes);
			res.writeHead(418, {
			  'Content-Length': Buffer.byteLength(proxyRes),
			  'Content-Type': 'text/plain'
			});
			res.write(proxyRes);
			res.end();
		}
	} else {
		// missing transcript or deviceId
		proxyRes = "vrex-proxy call is missing: ";
		if(!req.params.deviceId) {
			proxyRes = proxyRes + "deviceId ";
		}
		if(!req.params.transcript) {
			proxyRes = proxyRes + "transcript ";
		}
		res.writeHead(418, {
		  'Content-Length': Buffer.byteLength(proxyRes),
		  'Content-Type': 'text/plain'
		});
		res.write(proxyRes);
		res.end();
	}
});

// GET call to test if client is alive
vrexProxy.get('/alive',function (req, res, next) {
	console.log( "/alive request hits vrex on "+vrexURL+alivePath+" at "+(new Date(new Date()-254000)));
	var message = 'vrex-proxy is alive';
	request(vrexURL+alivePath,function(error,response,body) {
		if(error) {
			message = message + ' but vrex is not: ' + error;
			console.log(error);
		}
		else {
			message = message + ' and vrex says: '+ body;
		}
		res.writeHead(200, {
			'Content-Length': Buffer.byteLength(message),
			'Content-Type': 'text/plain'
		});
		res.write(message);
		res.end();
	});  
});


// start the app server
vrexProxy.listen(5050, function() {
  console.log('%s listening at %s', vrexProxy.name, vrexProxy.url);
});
