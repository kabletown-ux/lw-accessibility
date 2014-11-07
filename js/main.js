var debug = true;
var devices;
var selectedDevice; 

var baseUrl = "http://a-96-119-1-210.sys.comcast.net:5050";
var devicesUrl = baseUrl + "/getDevices";
var knockKnockUrlPartial = baseUrl + "/knockknock"; //?id=9999999
var transcriptUrlPartial = baseUrl + "/command";//?id=9999999&transcript=w00t+w00t+w00t";

function getDevices() {
    
    if ( debug ) console.log ( "getDevices(...) calling [" + devicesUrl + "]..." );
    
    //$.getJSON( "json/device-lookup.json", function( fetchedJson ) {
    $.getJSON( devicesUrl, function( fetchedJson ) {
      
        // calls are asynchronous.  Do nothing here!
    })
    .done( function( fetchedJson ) { 

        devices = fetchedJson;
        var keys = Object.keys( devices );
        
        // iterate and add extra bits, and
        for ( var i = 0; i < keys.length; i++ ) {

            devices[ keys[ i ] ].id = keys[ i ];
            
            if ( debug ) console.log( "keys [" + i + "] [" + keys[ i ] + "] devices[i].alias [" + devices[ keys[ i ] ].alias + "] id [" + devices[ keys[ i ] ].id + "]" );
            
            // add current device to list
            $( "#device-list" ).append( "<li id='device-" + i + "' data-device-id='" + keys[ i ] + "'>" + devices[ keys[ i ] ].alias + "</li>" );
        }
        
        // attach device selection 
        $( "#device-list li" ).click( function() {
            
            // clear selection
            $( "#device-list li" ).removeClass( "selected" );
            
            // set current selected
            $( this ).addClass( "selected" );
            
            // update display of current device
            var id = $( this ).data( "device-id" );
            $( "#selected-device" ).text( devices[ id ].alias + " (" + id + ")" );
            selectedDevice = devices[ id ];
            
            // init conversation
            knockKnock();
            
            // hide the device chooser
            $( "#device-list-wrapper" ).fadeOut( 250 );
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
/*
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
}*/

function sendCommand2( id, transcript ) {
    
    if ( debug ) console.log ( "sendCommand2() called..." );
    
    var transcriptUrlFull = transcriptUrlPartial + "?id=" + id + "&transcript=" + transcript;
    
    if ( debug ) console.log ( "sendCommand2 calling [" + transcriptUrlFull + "]" );
    
    $.getJSON( transcriptUrlFull, function( fetchedJson ) {
      
        // calls are asynchronous.  Do nothing here!
    })
    .done( function( fetchedJson ) { 

        if ( debug ) console.log( "sendCommand2() done [" + JSON.stringify( fetchedJson ) + "]" );
    })
    .fail( function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        if ( debug ) console.log( "sendCommand2 Request Failed: " + err );
    })
    .always( function() { 
        if ( debug ) console.log( "sendCommand2 complete" ); 
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
    // original poc
    /*$( "#submit-command" ).click( function() {
        sendCommand();
    });*/
    // submit from Adina's markup
    $( "#submit-command-2" ).click( function( event ) {
        
        var transcript = encodeURI( $( "#phrase" ).val() );
        sendCommand2( selectedDevice.id, transcript );
        
        event.preventDefault();
    })
});