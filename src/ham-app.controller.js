(function(){
    
'use strict';

var app = angular.module('ham-app', ['ngMaterial']);

app.controller('HamiltonController', function($scope, $http, Viz){
    
    $scope.currentViz = "gantt";
    
    $scope.vizzes = {
        gantt: new Viz("Soundtrack Chronology", "data/albumTracks.json","In what years did the real life events that this song describes occur?","Historical Events"),
        matrix: new Viz("Character Co-occurrence","data/cooccurence.json","How many songs does each character share with each other character?","Shared Songs"),
        bars: new Viz("Album Run Time","data/albumTracks.json","What is the (relative) duration of each album song?","")
        //lyrics: new Viz("Musical Lyrics","data/longLyrics.json","What are the lyrics in each song?")
    };
    
    $scope.vizzes.bars.seq = "Simultaneously";
    $scope.vizzes.bars.sort = "Show order";
    
    $scope.drilldown = {
        data: []
    };
    
    $scope.vizWidth = angular.element(document.querySelector(".vizContainer"))[0].offsetWidth;
    $scope.vizHeight = angular.element(document.querySelector(".vizContainer"))[0].offsetHeight;
    
});

app.factory('Viz', function($http){
   
   function Viz(label, file, headline,details){
       var self = this;
       self.label = label;
       self.file = file; 
       self.headline = headline;
       self.details = details;
       $http.get(self.file)
            .then(function(response){
                self.data = response.data;
            }, function(err){
                throw(err);
            });
   };
       
   return Viz;
    
});
  
})();