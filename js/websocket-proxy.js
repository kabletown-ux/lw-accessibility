// bootstrap websocket once the DOM's ready
$( document ).ready( function() {
    setupWebsocket();
});

// should include 'window.location.hostname', just like the websocket setup
var dataServerAndPort = "a-96-119-1-210.sys.comcast.net:5050";
var connection = null;
var loadCount = 0;
debug = true;
function setupWebsocket() {
 
    // sanity check: does connection already exist?
    if ( connection === null ) {
    
        connection = new WebSocket( "ws://" + window.location.hostname + ":5051" );

        connection.onopen = function () {
            if ( debug ) console.log( "Connection opened" );
            connection.send( "startApp:"+websocketAppName );
            
            getDevices();
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
            //$( "#log" ).text( event.data ); 
            console.log( event.data );
            
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

var devices = {};
    
function getDevices() {
    
    if ( debug ) console.log( "getDevices() [http:// " + dataServerAndPort + "/getDevices]" );
    connection.send( "http://" + dataServerAndPort + "/getDevices" );
    connection.onmessage = function ( event ) {
        
        if ( debug ) console.log( "getDevices() onmessage event.data [" + event.data + "]" );
        
        // parse twice!?!
        devices = jQuery.parseJSON( event.data );
        //if ( debug ) console.log( typeof( JSON.parse( event.data ) ) )
        devices = jQuery.parseJSON( devices );
        //if ( debug ) console.log( typeof( JSON.parse( event.data ) ) )
        
        var keys = Object.keys( devices );

        // iterate and add extra bits, and
        for ( var i = 0; i < keys.length; i++ ) {

            devices[ keys[ i ] ].id = keys[ i ];

            if ( debug ) console.log( "keys [" + i + "] [" + keys[ i ] + "] devices[i].alias [" + devices[ keys[ i ] ].alias + "] id [" + devices[ keys[ i ] ].id + "]" );

            // add current device to list
            $( "#device-list" ).append( "<li class='device-list-item'><button type='button' id='device-" + i + "' class='device-selector' data-device-id='" + keys[ i ] + "'>" + devices[ keys[ i ] ].alias + "</button></li>" );
        }
        
         // attach device selection
        $( ".device-selector" ).click( function() {
            var $this = $(this),
                $overlay = $('#overlay');

            // clear selection
            $( ".device-selector" ).removeClass( "selected" );

            // set current selected
            $this.addClass( "selected" );

            // update display of current device
            var id = $this.data( "device-id" );
            $( "#selected-device" ).text( devices[ id ].alias + " (" + id + ")" );
            selectedDevice = devices[ id ];

            // init conversation
            knockKnock();

            // hide the overlay containing the device chooser
            NAMESP.overlay.hideOverlay($overlay, "reverseBottomToTop");
            $overlay.find('.overlay-content').removeClass('reveal');
        });
    }
}


function knockKnock() {

    var knockKnockUrlFull = knockKnockUrlPartial + "?id=" + selectedDevice.id;
    if ( debug ) {
        console.log ( "knockKnock device [" + selectedDevice.id + "]" );
        console.log ( "Calling [" + knockKnockUrlFull + "] via proxy..." );
    }
    
    connection.send( knockKnockUrlFull );
    connection.onmessage = function ( event ) {
        
        if ( debug ) console.log( "knockKnock() onmessage event.data [" + event.data + "]" );
    }
}


function sendCommand( id, transcript ) {

    if ( debug ) console.log ( "sendCommand() called..." );

    var transcriptUrlFull = transcriptUrlPartial + "?id=" + id + "&transcript=" + transcript;

    if ( debug ) console.log ( "sendCommand calling [" + transcriptUrlFull + "]" );
    
    connection.send( transcriptUrlFull );
    connection.onmessage = function ( event ) {
        
        if ( debug ) console.log( "sendCommand() onmessage event.data [" + event.data + "]" );
    }
}