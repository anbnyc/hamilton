(function(){

'use strict';

angular.module('ham-app')
  .directive('hamGantt', function(){
    return {
        link: link,
        restrict: 'E',
        scope: { 
            data: '=',
            drilldown: '=',
            vizWidth: '=',
            vizHeight: '='
        }
    }
    
    function link(scope,element,attr){
        var data = scope.data;
        
        for(var i = 0; i<data.length; i++){
            data[i].startYear = new Date(data[i].startYearRaw,1,1);
            data[i].endYear = new Date(data[i].endYearRaw,1,1);
        }
        
        var margin = {top: 10, bottom: 40, left: 30, right: 20}
            , width = scope.vizWidth
            , height = scope.vizHeight;

        var yScale = d3.scale.ordinal()
            .domain(
                data.map(function(d) { return d.id; })
            )
            .rangeRoundBands([margin.top,height - margin.bottom],.2);
            
        var xScale = d3.time.scale()
            .domain([
                d3.time.year.offset(d3.min(data, function(d) { return d.startYear; }),-7), 
                d3.time.year.offset(d3.max(data, function(d) { return d.endYear; }),5)
            ])
            .range([margin.left,width - margin.right]);
        
        var format = d3.time.format("%Y");

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(d3.time.years,4)
            .tickFormat(format);
            
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var svg = d3.select("ham-gantt")
            .append('svg')
            .attr("width",width)
            .attr("height",height);

        var color = d3.scale.category10();

        var bars = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("class","bar normal")
            .attr("transform", function(d){
                return "translate ("+xScale(d.startYear)+","+yScale(d.id)+")";
            })
            .on('mouseover', function(d) { 
                d3.select(this)
                .attr("class","bar highlight")
                .append("text")
                .text(function(d) {
                    if(format(d.startYear) === format(d.endYear)){
                        return format(d.startYear);
                    } else {
                        return format(d.startYear) + " - "+ format(d.endYear);
                    }
                })
                    .attr("class","tooltip")
                    .attr("y", .7*height/data.length)
                    .attr("x", function(d) { return xScale(d3.time.year.offset(d.endYear,1)) - xScale(d.startYear) + 3});
            })
            .on('mouseleave', function(d){
                d3.select(this)
                .attr("class","bar normal")
                .select(".tooltip")
                .remove();
            })
            .on('click',function(d){
                scope.drilldown.data = d.dateNotes.split(";");
                scope.$apply();
            });
        
        var rects = bars.append("rect")
            .attr("width", function(d){ return xScale(d3.time.year.offset(d.endYear,1)) - xScale(d.startYear); })
            .attr("height", yScale.rangeBand())
            .attr("rx", 4)
            .attr("ry", 4);

        bars.append("text")
            .text(function(d) { return d.trackName; })
            .attr("class","label")
            .attr("y", .7*height/data.length)
            .attr("x", -3);
            
        svg.append("g")
            .attr("class","x axis")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class","y axis")
            .call(yAxis);

        svg.append("text")
            .attr("class","axislabel")
            .attr("transform","translate("+(width/2)+","+(height-10)+")")
            .text("Historical Year")

    }
  });
    
})();