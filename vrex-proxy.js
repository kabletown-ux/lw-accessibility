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
var VREX_TIMEOUT = 30000;

var id2CID = {};

var idmap = require('./device-lookup.json');

/**********************************************
***                                         ***
***     rest api handlers     ***
***                                         ***
**********************************************/

// GET call for client to get the device lookup list
vrexProxy.get('/getDevices',function (req, res, next) {
	console.log( "/getDevices request at "+(new Date(new Date()-254000)));
	var response = JSON.stringify(idmap);
	res.writeHead(200, {
	  'Content-Length': Buffer.byteLength(response),
	  'Content-Type': 'text/plain'
	});
	res.write(response);
	res.end();	
});

// GET call to add a device to the lookup list
vrexProxy.get('/setDevice',function (req, res, next) {
	console.log( "/setDevice request ["+req.params.id+","+req.params.guid+","+
		req.params.deviceId+","+req.params.alias+"] at "+(new Date(new Date()-254000)));
	var response;
	if(req.params.id&&req.params.guid&&req.params.deviceId) {
		if(idmap.hasOwnProperty(req.params.id)) {
			response = "/setDevice "+req.params.id+" modified ["+req.params.guid+","+req.params.deviceId+","+req.params.alias+"]";
		} else {
			
			response = "/setDevice "+req.params.id+" added ["+req.params.guid+","+req.params.deviceId+","+req.params.alias+"]";
		}
		idmap[req.params.id] = {};
		idmap[req.params.id].guid = req.params.guid;
		idmap[req.params.id].deviceId = req.params.deviceId;
		idmap[req.params.id].alias = req.params.alias;
		res.writeHead(200, {
		  'Content-Length': Buffer.byteLength(response),
		  'Content-Type': 'text/plain'
		});
	} else {
		response = "/setDevice missing required parameters";
		res.writeHead(418, {
		  'Content-Length': Buffer.byteLength(response),
		  'Content-Type': 'text/plain'
		});
	}
	res.write(response);
	res.end();	
});

// GET call for client to send a knockknock to vrex
vrexProxy.get('/knockknock',function (req, res, next) {
	var guid = req.params.guid;
	var deviceId = req.params.deviceId;
	if(req.params.id) {
		guid = idmap[req.params.id].guid;
		deviceId = idmap[req.params.id].deviceId;
	}
	console.log( "/knockknock request for guid "+guid+" and deviceId "+deviceId+
					" at "+(new Date(new Date()-254000)));
	var proxyRes;
	if(guid&&deviceId) {
		var kkParams={
			'guid': guid,
			'deviceId': deviceId,
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
		   timeout: VREX_TIMEOUT
		}, function(error, result, data){ 
			if(error){
				console.log("vrex error: "+error);
				proxyRes = "vrex error: "+error;
			}else{
				var vrexRES = JSON.parse(data);
				if(vrexRES.cid) {
					/* console.log(data); */
					console.log("cid = "+vrexRES.cid);
					id2CID[deviceId] = vrexRES.cid;
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
		if(!guid) {
			proxyRes = proxyRes + "guid ";
		}
		if(!deviceId) {
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
	var deviceId = req.params.deviceId;
	if(req.params.id) {
		deviceId = idmap[req.params.id].deviceId;
	}
	console.log( "/command request ["+req.params.transcript+"] for deviceId "+deviceId+
					" at "+(new Date(new Date()-254000)));
	var proxyRes;
	if(req.params.transcript&&deviceId) {
		var cid = id2CID[deviceId];
		if(cid) {
			console.log("vrex nlp call with cid: "+cid);
						
			var queryParams = "?timezone=US/Eastern&filters=NLP,X1&cid="+cid;		
			var success = 500;
			request({
			   uri: vrexURL+shPath+queryParams, 
			   method: "POST",
			   body: '{"transcription":"'+req.params.transcript+'","reza":"true"}',
			   timeout: VREX_TIMEOUT
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
			proxyRes = "vrex-proxy requires knockknock before command [deviceId="+deviceId+"]";
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
		if(!deviceId) {
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
