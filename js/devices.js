var debug = true;
var devices;
var selectedDevice; 

function getDevices() {
    
    if ( debug ) console.log ( "getSomeJson(...) called..." );
    
    // TODO: replace w/ real URL to metadata service, not a ref to local cache
    $.getJSON( "json/device-lookup.json", function( fetchedJson ) {
      
        // calls are asynchronous.  Do nothing here!
    })
    .done( function( fetchedJson ) { 

        devices = fetchedJson;
        var keys = Object.keys( devices );
        
        // iterate and add extra bits, and
        for ( var i = 0; i < keys.length; i++ ) {

            devices[ keys[ i ] ].selected = false;
            devices[ keys[ i ] ].id = keys[ i ];
            
            //devices.push( devices[ keys[ i ] ] );
            console.log( "keys [" + i + "] [" + keys[ i ] + "] devices[i].alias [" + devices[ keys[ i ] ].alias + "] selected [" + devices[ keys[ i ] ].selected + "] id [" + devices[ keys[ i ] ].id + "]" );
            
            $( "#device-list" ).append( "<li id='device-" + i + "' data-device-id='" + keys[ i ] + "'>" + devices[ keys[ i ] ].alias + "</li>" );
        }
        /*
        // iterate new plain vanilla array
        for ( var i = 0; i < devices.length; i++ ) {
            console.log( "i [" + i + "] id [" + devices[ i ].id + "] devices[i].alias [" + devices[ i ].alias + "]" );
        }
        */
       
        // attach device selection 
        $( "#device-list li" ).click( function() {
            var id = $( this ).data( "device-id" );
            $( "#selected-device" ).text( devices[ id ].alias + " (" + id + ")" );
            selectedDevice = devices[ id ];
            //alert( "Selected device [" + selectedDevice.alias + "]" ); 
            knockKnock();
        });
    })
    .fail( function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        if ( debug ) console.log( "Request Failed: " + err );
    })
    .always( function() { 
        if ( debug ) console.log( "complete" ); 
    });   
}
var knockKnockCalled = false;
var knockKnockUrlPartial = "http://a-96-119-1-210.sys.comcast.net:5050/knockknock";
var transcriptUrlPartial = "http://a-96-119-1-210.sys.comcast.net:5050/command";//&transcript=";

function sendCommand() {
    
    if ( debug ) console.log ( "sendCommand() called..." );
    
    var transcript = encodeURI( $( "#transcript" ).val() );
    var transcriptUrlFull = transcriptUrlPartial + "?id=" + selectedDevice.id + "&transcript=" + transcript;
    
    if ( debug ) {
        console.log ( "sendCommand device [" + selectedDevice.id + "]" );
        console.log ( "sendCommand calling [" + transcriptUrlFull + "]" );
    }
    $.getJSON( transcriptUrlFull, function( fetchedJson ) {
      
        // calls are asynchronous.  Do nothing here!
    })
    .done( function( fetchedJson ) { 

        if ( debug ) console.log( "sendCommand() done [" + JSON.stringify( fetchedJson ) + "]" );
    })
    .fail( function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        if ( debug ) console.log( "sendCommand Request Failed: " + err );
    })
    .always( function() { 
        if ( debug ) console.log( "sendCommand complete" ); 
    });   
}
function knockKnock() {
    
    var knockKnockUrlFull = knockKnockUrlPartial + "?id=" + selectedDevice.id;
    if ( debug ) {
        console.log ( "knockKnock device [" + selectedDevice.id + "]" );
        console.log ( "Calling [" + knockKnockUrlFull + "]" );
    }
    
    $.get( knockKnockUrlFull, function( returnedF00 ) {
      
        // calls are asynchronous.  Do nothing here!
    })
    .done( function( returnedF00 ) { 

        if ( debug ) console.log( "knockKnock done [" + returnedF00 + "]" ); 
    })
    .fail( function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        if ( debug ) console.log( "knockKnock Request Failed: " + err );
    })
    .always( function() { 
        if ( debug ) console.log( "knockKnock complete" ); 
    });   
}


$( document ).ready( function() {

    // load device information
    getDevices();
    
    // bind events
    $( "#submit-command" ).click( function() {
        sendCommand();
    })
});