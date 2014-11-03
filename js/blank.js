// simple-minded parameter initialization
var debug = location.href.indexOf( "debug=true" ) > 0;
var verbose = location.href.indexOf( "verbose=true" ) > 0;

// ad-hoc collection of parameters
var uriParams = {};
var queryString = location.search.substring( 1 ); // skip the "?" char, which is the first char in the query string
var nameValuePairs = queryString.split( "&" ); 
var tempNameValuePair;

// iterate name=value pairs, and stash them in an array for use later
for ( var i = 0; i < nameValuePairs.length; i++ ) {

    tempNameValuePair = nameValuePairs[ i ].split( "=" );
    uriParams[ tempNameValuePair[ 0 ] ] = tempNameValuePair[ 1 ];
    if ( debug && verbose ) console.log( "uriParam [" + tempNameValuePair[ 0 ] + "] = [" + uriParams[ tempNameValuePair[ 0 ] ]  + "]" );
}

$( document ).ready( function() {
    
    if ( debug ) console.log( "Adding Mousetrap bindings..." );
    Mousetrap.bindGlobal( 'right', function() {
        
    });
    Mousetrap.bindGlobal( 'left', function() {
       
    });
    Mousetrap.bindGlobal( 'enter', function() {
        
    });
    Mousetrap.bindGlobal( 'up', function() {
     
    });
    Mousetrap.bindGlobal( 'down', function() {
        
    });
    Mousetrap.bindGlobal( 'esc', function() {
        
    });
    if ( debug ) console.log( "Adding Mousetrap bindings... Done!" );
    
    // bind DOM elements and events here
    
    //getSomeJson();
});

function getSomeJson() {
    
    if ( debug ) console.log ( "getSomeJson(...) called..." );
    
    // TODO: replace w/ real URL to metadata service, not a ref to local cache
    $.getJSON( "json/" + id + ".json", function( someJsonReturned ) {
      
        // calls are asynchronous.  Do nothing here!
    })
    .done( function( someJsonReturned ) { 

        for ( i = 0; i < someJsonReturned.length; i++ ) {
            
            
        }
        
    })
    .fail( function( jqxhr, textStatus, error ) {
        var err = textStatus + ', ' + error;
        if ( debug ) console.log( "Request Failed: " + err );
    })
    .always( function() { 
        if ( debug ) console.log( "complete" ); 
    });   
}