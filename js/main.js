var debug = true;
var devices;
var selectedDevice;

var baseUrl = "http://a-96-119-1-210.sys.comcast.net:5050";
var devicesUrl = baseUrl + "/getDevices";
var knockKnockUrlPartial = baseUrl + "/knockknock"; //?id=9999999
var transcriptUrlPartial = baseUrl + "/command";//?id=9999999&transcript=w00t+w00t+w00t";

/*
 * ALL NETWORK CALLS MOVED INTO vrex-websocket.js, which proxies them for us.
 *  
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
    })
    .fail( function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        if ( debug ) console.log( "Request Failed: " + err );
    })
    .always( function() {
        if ( debug ) console.log( "complete" );
    });
}
*/
/*
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
*/
/*
function sendCommand( id, transcript ) {

    if ( debug ) console.log ( "sendCommand() called..." );

    var transcriptUrlFull = transcriptUrlPartial + "?id=" + id + "&transcript=" + transcript;

    if ( debug ) console.log ( "sendCommand calling [" + transcriptUrlFull + "]" );

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
*/
function promoteRecentQuery( queryId ) {

    if ( debug ) console.log ( "promoteRecentQuery queryId [" + queryId + "]" );

    // copy element
    var queryElement = $( "#query-id-" + queryId );
    if ( debug ) console.log ( "promoteRecentQuery queryElement [" + queryElement.val() + "] found" );

    // detach, not remove, it
    $( "#query-id-" + queryId ).detach();

    // insert into pole position
    $( ".recent-query" ).eq( 0 ).before( queryElement );
}
function insertRecentQuery( transcript ) {

    if ( debug ) console.log ( "insertRecentQuery transcript [" + transcript + "]" );

    // verify that this query doesn't already exist...
    var matched = false;
    var matchedId;
    $( ".recent-query-btn" ).each(function( index ) {

        if ( !matched && transcript.trim().toLowerCase() === $( this ).text().trim().toLowerCase() ) {

            if ( debug ) console.log( "Match! index [" + index + "] [" + $( this ).text().trim() + "] transcript [" + transcript + "]" );
            matched = true;
            matchedId = $( this ).data( "query-id" );
            // can't exit this loop?
            //return;

        } else {
            //if ( debug ) console.log ( "NO match?!?" );
        }
    });

    // ...if it does, then just promote it
    if ( matched ) {

        promoteRecentQuery( matchedId );
        return;

    } else {

        sendCommand( selectedDevice.id, transcript );
    }

    // If we got this far then the query is new
    // get count of recent queries
    var count = $( ".recent-query" ).length;

    // update it to
    var newElement = "<li class='recent-query' id='query-id-" + count + "'><button class='recent-query-btn' data-query-id='" + count + "'>" + transcript + "</button></li>";
    if ( debug ) console.log ( "newElement [" + newElement + "]" );

    $( ".recent-query" ).eq( 0 ).before( newElement );

    // bind event handler to new list item
    $( "#query-id-" + count ).click( function( event ) {

        event.preventDefault();

        var transcript = $( this ).text().trim();
        if ( debug ) console.log ( "newElement transcript [" + transcript + "]" );
        sendCommand( selectedDevice.id, transcript );

        //var queryId = $( this ).data( "query-id" );
        promoteRecentQuery( count );
    });
}
$( document ).ready( function() {

    // bind events

    // submit button from Adina's markup
    $( "#submit-command-2" ).click( function( event ) {

        var transcript = encodeURI( $( "#phrase" ).val().trim() );
        //sendCommand( selectedDevice.id, transcript );

        // add to recent query list
        insertRecentQuery( $( "#phrase" ).val().trim() );

        event.preventDefault();
    })
    // bind d pad buttons
    $( ".d-pad-btn, #launchXfinity, #exitXfinity" ).click( function( event ) {

        var transcript = $( this ).data( "command" );
        sendCommand( selectedDevice.id, transcript );

        event.preventDefault();
    });

    // bind recent queries
    $( ".recent-query-btn" ).click( function( event ) {

        event.preventDefault();

        var transcript = $( this ).text().trim();
        sendCommand( selectedDevice.id, transcript );

        var queryId = $( this ).data( "query-id" );
        promoteRecentQuery( queryId );
    });
});