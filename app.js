/** SARSAT Saves Data Generator
 * 
 *    Single-page application to curate a CSV file of SARSAT Saves
 * 
 *    Jason Paul R. Wilson
 */
 
  var app = angular.module('sarsatSaves', []);
 
  app.controller('newSaveController', [ function() {
    var 
      sco = this;
   
    //Controller Properties
    sco.saveData = {
      source: 'Paste save data into this box.'
    };
    
    //Update Save Information
    sco.updateSave = function() {
      var src = sco.saveData.source;
      sco.saveData.lat = sco.pullLatitude( src );
      sco.saveData.lon = sco.pullLongitude( src );
      sco.saveData.date = sco.pullSaveDate( src );
      sco.saveData.beacon = sco.pullBeaconData( src );
      sco.saveData.incidentType = sco.pullIncidentType( src, sco.saveData.beacon.type );
      sco.saveData.savesCount = sco.pullSavesCount( src );
      sco.saveData.incidentDescription = sco.pullDescription( src );
      sco.saveData.homeport = sco.pullHomeport( src );
    }
    
    //Pull Latitude from Source Text
    sco.pullLatitude = function( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init variables
      var 
        matches = [],
        decDegrees = 0,
        decMinutes = 0,
        sign = 1;
      
      //Set regex
      const regexStr = /([0-9]{1,2})\s([0-9]{1,2}\.?[0-9]{0,5})([NnSs])/gi;
      
      matches = sco.regexGet( source, regexStr );
      
      if ( matches ) {
        decDegrees = parseFloat(matches[1]);
        decMinutes = parseFloat(matches[2]) / 60;
        sign = matches[3].toUpperCase() === 'S' ? -1 : 1; 
        
        return (decDegrees + decMinutes) * sign;
      } else {
        return "Latitude Not Found";
      }
    }
    
    //Pull Longitude from Source Text
    sco.pullLongitude = function( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init Variables
      var
        matches = [],
        decDegrees = 0,
        decMinutes = 0,
        sign = 1;
      
      //Set Regex
      var regexStr = new RegExp('([0-9]{1,3})\\s([0-9]{1,2}\\.?[0-9]{0,5})([EeWw])', 'gi');
      
      matches = sco.regexGet( source, regexStr );
      
      if ( matches ) {
        decDegrees = parseFloat(matches[1]);
        decMinutes = parseFloat(matches[2]) / 60;
        sign = matches[3].toUpperCase() === 'W' ? -1 : 1; 
        
        return (decDegrees + decMinutes) * sign;
      } else {
        return "Longitude Not Found";
      }
    }
   
    //Pull Save Date from Source Text
    sco.pullSaveDate = function( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init variables
      var 
        matches = [],
        date = 0;
      
      //Set regex
      const regexStr = /On\s([0-9A-z\s]*,?\s?[0-9]{4}),?\sat/gi;
      
      matches = sco.regexGet( source, regexStr );
      
      if ( matches ) {
        date = Date.parse(matches[1]);
        return date;
      } else {
        return "Save Date Not Found";
      }
    }
    
     //Pull Beacon Data from Source Text
    sco.pullBeaconData = function( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init variables
      var 
        matches = [];
      
      //Set regex
      const regexStr = /\(?(PLB|EPIRB|ELT)\)?/gi;
      const beaconObjects = {
        'PLB' : {type: 'PLB', description:'Personal Locator Beacon (PLB)'},
        'ELT' : {type: 'ELT', description:'Emergency Location Transmitter (ELT)'},
        'EPIRB' : {type: 'EPIRB', description:'Emergency Position-Indicating Radio Beacon (EPIRB)'}
      }
      
      matches = sco.regexGet( source, regexStr );
      
      if ( matches ) {
        return beaconObjects[matches[1]];
      } else {
        return "Save Date Not Found";
      }
    }
    
    // Pull Incident Type from Source Text
    sco.pullIncidentType = function ( source, beaconType ) {
      //Verify input
      source = source || sco.saveData.source;
      beaconType = beaconType || sco.saveData.beacon.type || 'PLB';
      
      //Init variables
      var 
        marMatches = [],
        avMatches = [],
        type;
      
      //Set regex
      const marRegexStr = /umib|vhf|mayday|panpan|boat|fishing|paddling|sailing|vessel|canoe|kayak|kayaker|swimmer|swimming|adrift|aground|seas|sank|sinking|flooding|water/gi;
      const avRegexStr = /plane|pilot|airport|landing|takeoff|mid-air|ejected|helicopter crash|inflight|in flight|in-flight/gi;
      
      //Check for EPIRBS and ELTS
      if( beaconType === 'EPIRB' ) return 'Maritime';
      if( beaconType === 'ELT' ) return 'Aviation';
      
      //Attempt to determine event type for PLBS
      if( beaconType === 'PLB' ) {
        marMatches = sco.regexGreedyGet( source, marRegexStr );
        avMatches = sco.regexGreedyGet( source, avRegexStr );
        
        marMatches = marMatches ? marMatches.length : 0;
        avMatches = avMatches ? avMatches.length : 0;
        
        if( marMatches < avMatches ) return 'Aviation'; //If we have fewer maritime matches than aviation matches
        if( avMatches < marMatches ) return 'Maritime'; //If we have fewer aviation matches than maritime matches
        
        //If all else fails assume Terrestrial
        return 'Land';
      }
      
      //If it's not one of the three there's an issue
      return 'Incorrect or unavailable beacon type: ' + beaconType;
    }
    
    // Pull Saves Count from Source Text
    sco.pullSavesCount = function ( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init variables
      var 
        matches = [];
      
      //Set regex
      const regexStr = /([0-9]{1,4}) SARSAT RESCUE/gi;
      
      //Get Matches
      matches = sco.regexGet( source, regexStr );
        
      if( matches ) {
        return matches[1];
      } else {
        return 'No saves number found.'
      }
    }
    
    // Pull Description from Source Text
    sco.pullDescription = function ( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init variables
      var 
        matches = [];
      
      //Set regex
      const regexStr = /(On [\s\S]*)(?:[0-9]{1,4} SARSAT RESCUE)/i;
      
      //Get Matches
      matches = sco.regexGet( source, regexStr );
        
      if( matches ) {
        return matches[1];
      } else {
        return 'No description found.'
      }
    }
    
    // Pull Description from Source Text
    sco.pullHomeport = function ( source ) {
      //Verify input
      source = source || sco.saveData.source;
      
      //Init variables
      var 
        matches = [];
      
      //Set regex
      const regexStr = /Home Port - ([A-z\s,]*)\n/gi;
      
      //Get Matches
      matches = sco.regexGet( source, regexStr );
        
      if( matches ) {
        return matches[1];
      } else {
        return 'No homeport found.'
      }
    }
   
    //Helper methods
    sco.regexGet = function( source, regex ) {
      var 
        src = source,
        re = regex,
        matches;
      //console.log("REGEX");
      //console.log(src);
      //console.log(re);
      
      matches = re.exec( src );
      
      //console.log(matches);
      return matches;
    }
    
    sco.regexGreedyGet = function( source, regex ) {
      var
        src = source,
        re = regex,
        matches = [],
        tmp;
        
      while( ( tmp = re.exec(src) ) !== null ) {
        matches.push(tmp[0]);
      }
      //console.log(matches);
      
      return matches;
    };
    
    sco.interceptPaste = function( e ) {
      
      // Stop data actually being pasted into div
      e.stopPropagation();
      e.preventDefault();
      
      // Get pasted data via clipboard API
      clipboardData = e.clipboardData || window.clipboardData;
      pastedData = clipboardData.getData('Text');
      
      sco.saveData.source = pastedData;
      sco.updateSave();
    }
  }]); 
  
  
  // Contenteditable Directive to allow use of div as input.
  app.directive("contenteditable", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {
  
        function read() {
          var text = '';
          //Get element contents
          text = element.html();
          
          //Strip HTML tags
          text = text.replace(/(<([^>]+)>)/ig,"")
          
          ngModel.$setViewValue(text);
        }
  
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || "");
        };
  
        element.bind("blur keyup change", function() {
          scope.$apply(read);
        });
      }
    };
  });
