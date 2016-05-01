(function(){

'use strict';

angular.module('ham-app')
  .directive('hamMatrix', function(){
    return {
        link: link,
        restrict: 'E',
        scope: { 
            data: '=',
            drilldown: '=',
            vizHeight: '=',
            vizWidth: '='
        }
    }
    
    function link(scope,element,attr){
        var data = scope.data;
        
        data.sort(function(a,b){ return b.ntracks - a.ntracks });
        
        var parts = [];
        var colors = [];
        for(var i = 0;i<data.length;i++){
            if(parts.indexOf(data[i].part1) == -1){
                parts.push(data[i].part1);
            };
            if(colors.indexOf(data[i].ntracks) == -1 & data[i].part1 != data[i].part2){
                colors.push(data[i].ntracks);  
            };
        };
        colors = colors.sort(function(a,b){ return a - b})

        var margin = 50
            , side = scope.vizHeight - 2*margin
            , nparts = parts.length;
                        
        var scale = d3.scale.ordinal()
            .domain(parts)
            .rangeRoundBands([2*margin, scope.vizHeight],.1);
            
        var xAxis = d3.svg.axis()
            .scale(scale)
            .orient("bottom");
        
        var yAxis = d3.svg.axis()
            .scale(scale)
            .orient("left");
                                
        var svg = d3.select("ham-matrix")
            .append('svg')
            .attr("width",scope.vizWidth)
            .attr("height",scope.vizHeight);

        var palette = ['#fffeff','#d3cbe5','#b4a6d3','#8b76bb','#7a62b1','#6a51a3','#5d478f','#4f3d7a','#423366','#352851'];

        var color = d3.scale.category10()
            .domain(colors)
            .range(palette);
        
        var cells = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("class","cell")
            .attr("transform", function(d){
                return "translate ("+scale(d.part2)+","+scale(d.part1)+")";
            });

        var size = (side / nparts) - 1;

        var rects = cells.append("rect")
            .attr("class","rect normal")
            .attr("height", size)
            .attr("width", size)
            .style("fill", function(d){
                if (d.part1 == d.part2){
                    return "#000000";
                } else if (+d.ntracks > 0) {
                    return color(d.ntracks);
                } else {
                    return "#9C7329";
                }
            })
            .append("title")
            .text(function(d){ return d.ntracks; });

        svg.append("g")
            .data(data)
            .attr("class","y axis hidden matrixaxis")
            .call(yAxis)
            .attr("transform","translate("+(side+2*margin+15)+",0)")
          .selectAll("text")
            .style("text-anchor","start")
            .attr("transform","translate(-5,0)");
        
        svg.append("g")
            .data(data)
            .attr("class","x axis hidden matrixaxis")
            .call(xAxis)
            .attr("transform","translate(0,"+2*margin+")")
          .selectAll("text")
            .style("text-anchor","start")
            .attr("transform","translate(-"+size/2+",-8) rotate(-45)");

        cells.on('mouseover', function(d) { return matrixMouseover(this,d) })
            .on('mouseleave',function(){
                d3.select(this)
                    .select(".rect")
                    .attr("x",0)
                    .attr("y",0)      
                    .attr("height",size)
                    .attr("width",size)
                    .attr("class","rect normal");
            })
            .on('click',function(d){
                scope.drilldown.data = d.tracks.split(";");
                scope.$apply();
            });
        
        var matrixMouseover = function(elem,d){
            var partY = d.part1;
            var partX = d.part2;

            d3.select(elem)
                .select("rect")
                .attr("x",3)
                .attr("y",3)
                .attr("height",size-6)
                .attr("width",size-6)
                .attr("class","rect highlight");
                 
            d3.select(".x.matrixaxis")
                .selectAll("text")
                .attr("font-weight",function(d){
                    if(partX==d){
                        return "bold";
                    }
                });
                
            d3.select(".y.matrixaxis")
                .selectAll("text")
                .attr("font-weight",function(d){
                    if(partY==d){
                        return "bold";
                    }
                });
        }

    }
  });
    
})();