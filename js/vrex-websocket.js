// bootstrap websocket once the DOM's ready
$( document ).ready( function() {
    if ( debug ) console.log( "setupWebsocket() PRE" );
    setupWebsocket();
    if ( debug ) console.log( "setupWebsocket() POST" );
});

var connection = null;
var loadCount = 0;
debug = true;
function setupWebsocket() {
 
    if ( debug ) console.log( "setupWebsocket() called inside 'vrex-websocket.js' for the [" + ( ++loadCount ) + "]th time..." );
    // EACH APP DEFINES THIS OUTSIDE THIS MODULE's INCLUDE
    //var websocketAppName = "ws proxy test";
    //
    // url:port/"app name"/webpage?id=nnn&parent=this.location&vrex=urlToVrex
    // port: 5000 = get/post
    // port: 5001 = websocket
    
    // sanity check: does connection already exist?
    if ( connection === null ) {
    
        connection = new WebSocket( "ws://" + window.location.hostname + ":5051" );
        //connection = new WebSocket( "ws://" + window.location.hostname + ":{{port}}" );
        //connection = new WebSocket( "ws://ec2-54-226-208-74.compute-1.amazonaws.com:5001" );

        connection.onopen = function () {
            if ( debug ) console.log( "Connection opened" );
            connection.send( "startApp:"+websocketAppName );
        };
        connection.onclose = function () {
            if ( debug ) console.log( "Connection closed" );
        };
        connection.onerror = function () {
            if ( debug ) {
                console.error( "Connection error" );
                console.trace();
            }
        };
        connection.onmessage = function ( event ) {
            if ( debug ) console.log( "onmessage [" + event.data + "]" );
            // log if possible...
            $( "#log" ).text( event.data ); 
            // ...then run it
            try {
                if ( debug ) console.log( "PRE  Eval..." );
                eval( event.data );
                if ( debug ) console.log( "POST Eval..." );
            } catch ( e ) {
                console.log( "Unable to eval( webSocketMsg ) [" + e.toString( ) );
            }
        };
    } else {
        
        if ( debug ) console.log( "connection already exists!" );
    }
}
// close the socket before unloading!
$(window).on( 'beforeunload', function() {
    
    if ( debug ) console.log( "on beforeunload called..." );
    if ( connection !== null ) {
        if ( debug ) console.log( "closing websocket connection..." );
        connection.close();
    }
});

// everybody gets this return to caller method
function doBack() {
   
    //if ( debug ) console.log( "back() called, returning to callerUrl [" + encodeURI( uriParams[ "callerUrl" ] ) + "]" );
    var callerUrlToken = "callerUrl=";

    if ( debug && verbose ) {
        console.log( "back() called, window.location [" + window.location + "]" );
        console.log( "back() called, window.location.search [" + window.location.search + "]" );
        console.log( "back() called, callerUrlToken.length() [" + callerUrlToken.length + "]" );
        console.log( "back() called, window.location.indexOf( callerUrlToken ) [" + window.location.search.indexOf( callerUrlToken )+ "]" );
        console.log( "back() called, callerUrl [" + window.location.search.substring( window.location.search.indexOf( callerUrlToken ) + callerUrlToken.length ) + "]" );
    } 
    
    // special handling of callerUrl, to retrieve its entire path + name=value pairs
    location = window.location.search.substring( window.location.search.indexOf( callerUrlToken ) + callerUrlToken.length );
}

// everybody gets this generic call for their app
function doCommand( command ) {
    try {
        eval( command );
    } catch ( e ) {
        console.log( "Unable to eval( command ) [" + e.toString( ) );
    }
}

function giveData(data) {
    
    if ( debug ) console.log( "1st giveData" );
	if ( debug ) console.log( "received data:" );
	console.log(data);
    if ( debug ) console.log( "2nd giveData" );
}
function checkConnection() {
    if ( debug ) console.log( "checkConnection() [" + connection + "]" );
    connection.send( "checkConnection" );
}
function doFoo( msg ) {
    alert( "doFoo() called [" + msg + "]" );
}