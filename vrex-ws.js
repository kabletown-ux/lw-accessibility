/**********************************************
 ***                                         ***
 ***     packages and global variables       ***
 ***                                         ***
 **********************************************/

// packages needed
var ws = require("nodejs-websocket");
var Q = require('q');
var request = require('request');

// websocket handlers
var wsServer = ws.createServer(function (connection) {
    console.log("ws connection opened" + " at " + (new Date(new Date() - 254000)));
    connection.on("text", function (str) {
        // handle client webpage registering its device id
        console.log("websocket call [" + str + "] at" + (new Date(new Date() - 254000)));
        callVrexProxy(str).then(function (data) {
            /* var msg = 'giveData('+data+')'; */
            console.log(data);
            connection.sendText(data);
        });
    });
    connection.on("close", function () {
        // handle a closed webpage
        /*                           for (var devId in conn_map) {
         if(conn_map[devId]==connection) {
         console.log("websocket closed for client [" + devId + "] at "+(new Date(new Date()-254000)));
         delete conn_map[devId];
         }
         } */
    });
    connection.on('error', function (err) {
        console.error(err.stack);
        console.log("Node NOT Exiting... " + (new Date(new Date() - 254000)));
    });
});

// start the websocket
wsServer.listen(5051);

function callVrexProxy(str) {
    var deferred = Q.defer();
    request({
        //uri: "http://a-96-119-1-210.sys.comcast.net:5050/getDevices",
        uri: str,
        method: "GET"
    }, function (error, result, data) {
        /* console.log(data); */
        if (error) {
            return deferred.reject(error);
        } else {
            return deferred.resolve(JSON.stringify(data));
        }
    });
    return deferred.promise;
}