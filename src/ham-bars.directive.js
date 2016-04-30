(function(){

'use strict';

angular.module('ham-app')
  .directive('hamBars', function(){
    return {
        //link: link,
        template: "<div class='hey'></div>",
        restrict: 'E',
        scope: { 
            data: '=',
            vizWidth: '=',
            vizHeight: '='
        }
    }
    
    function link(scope,element,attr){
        console.log('here');
        var data = scope.data;
        console.log(data);
        
        var margin = {top: 10, bottom: 20, left: 30, right: 20}
            , width = scope.vizWidth
            , height = scope.vizHeight;

        var yScale = d3.scale.ordinal()
            .domain(
                data.map(function(d) { return d.id; })
            )
            .rangeRoundBands([margin.top,height - margin.bottom],.2);
            
        var xScale = d3.scale.linear()
            .domain([
                d3.min(function(d){ return d.runTimeS; }),
                d3.max(function(d){ return d.runTimeS; })
            ])
            .range([margin.left,width - margin.right]);
            
        var timeScale = d3.scale.linear()
            .domain([
                d3.min(function(d){ return d.runTimeS; }),
                d3.max(function(d){ return d.runTimeS; })
            ])
            .range([0,10000]);
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(15)
            .tickFormat(format);
            
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var svg = d3.select("ham-bars")
            .append('svg')
            .attr("width",width)
            .attr("height",height);

        var color = d3.scale.category10();

        var bars = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("class","bar normal")
            .attr("transform", function(d){
                return "translate (0,"+yScale(d.id)+")";
            });
        
        var rects = bars.append("rect")
            .attr("height", yScale.rangeBand())
            .transition()
            .delay(function(d){
                return 0;
            })
            .duration(function(d){
                return timeScale(d.runTimeS);
            })
            .attr("width", function(d){ return xScale(d.runTimeS); });

        bars.append("text")
            .text(function(d) { return d.trackName + ": " + d.runTimeS + " seconds"; })
            .attr("class","label")
            .attr("y", .7*height/data.length)
            .attr("x", -3);
            
        svg.append("g")
            .data(data)
            .attr("class","x axis")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(xAxis);

        svg.append("g")
            .data(data)
            .attr("class","y axis")
            .call(yAxis);

    }
  });
    
})();