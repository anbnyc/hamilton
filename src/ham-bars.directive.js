(function(){

'use strict';

angular.module('ham-app')
  .directive('hamBars', function(){
    return {
        link: link,
        restrict: 'E',
        scope: { 
            data: '=',
            vizWidth: '=',
            vizHeight: '=',
            sort: '=',
            seq: '='
        }
    }
    
    function link(scope,element,attr){
        var data = scope.data;
        
        var runTimeT = 0;
        for(var i = 0;i<data.length;i++){
            data[i].runTimeT = runTimeT;
            runTimeT += data[i].runTimeS;            
        }
        
        var flag = {
            sort: true,
            seq: true
        };

        scope.$watch("sort",function(){
            if(flag.sort){
                flag.sort = false;
            } else {
                updateSortOrder(scope.sort);                
            }
        }, true);
        
        scope.$watch("seq",function(){
            if(flag.seq){
                flag.seq = false;
            } else {
                updateDisplayOrder(scope.seq);
            }
        });
        
        function updateDisplayOrder(order){      
            d3.selectAll("g.bar rect")
                .attr("width",0)
                .transition()
                .delay(function(d,i){
                    if(order == "Simultaneously"){
                        return 0;
                    } else {
                        return timeScale(+d.runTimeT) - 500;
                    }
                })
                .duration(function(d){
                    return timeScale(+d.runTimeS);
                })
                .attr("width", function(d){
                    return xScale(+d.runTimeS);
                });
            d3.selectAll("g.bar text")
                .attr("x",0)
                .transition()
                .delay(function(d,i){
                    if(order == "Simultaneously"){
                        return 0;
                    } else {
                        return timeScale(+d.runTimeT) - 500;
                    }
                })
                .duration(function(d){
                    return timeScale(+d.runTimeS);
                })
                .attr("x", function(d){
                    return xScale(+d.runTimeS);
                });
        }
        
        function updateSortOrder(order){
            var sorter = function(a,b){
                if(order=="Length order"){
                    return b.runTimeS - a.runTimeS;
                } else {
                    return a.id - b.id;
                }
            }
            data = data.sort(sorter);
            svg.selectAll('g.bar').sort(sorter);
            yScale.domain(
                data.map(function(d,i) { return i; })
            );
            var transitionSort = svg.transition().duration(250);
            transitionSort
                .selectAll('g.bar')
                .attr("transform", function(d,i){
                    return "translate ("+margin.left+","+yScale(i)+")";
                });
            transitionSort
                .select('.y.axis')
                .call(yAxis);
        };
        
        var margin = {top: 10, bottom: 40, left: 250, right: 20}
            , width = scope.vizWidth
            , height = scope.vizHeight
            , timefactor = 10;

        var yScale = d3.scale.ordinal()
            .domain(
                data.map(function(d,i) { return i; })
            )
            .rangeRoundBands([margin.top,height - margin.bottom],.2);
            
        var xScale = d3.scale.linear()
            .domain([
                0,
                d3.max(data,function(d){ return +d.runTimeS; })
            ])
            .range([0,(width - margin.right - margin.left)]);
            
        var timeScale = d3.scale.linear()
            .domain([
                d3.min(data,function(d){ return +d.runTimeS; }),
                d3.max(data,function(d){ return +d.runTimeS; })
            ])
            .range([
                0,
                timefactor * d3.max(data,function(d){ return +d.runTimeS; })
            ]);
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(15);
            
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickFormat(function(d,i){ return data[i].trackName; });
            
        var svg = d3.select("ham-bars")
            .append('svg')
            .attr("width",width)
            .attr("height",height);

        var color = d3.scale.category10();

        var bars = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("class","bar normal")
            .attr("transform", function(d,i){
                return "translate ("+margin.left+","+yScale(i)+")";
            });
        
        var rects = bars.append("rect")
            .attr("width",0)
            .attr("height", yScale.rangeBand())
            .transition()
            .delay(function(d){
                return 0;
            })
            .duration(function(d){
                return timeScale(+d.runTimeS);
            })
            .attr("width", function(d){ 
                return xScale(+d.runTimeS); 
            });

        bars.append("text")
            .text(function(d) { return d.runTimeS + " seconds"; })
            .attr("class","floatinglabel")
            .attr("x", 5)
            .attr("y", .7*height/data.length)
            .transition()
            .delay(function(d){
                return 0;
            })
            .duration(function(d){
                return timeScale(+d.runTimeS);
            })
            .attr("x", function(d){
                return xScale(+d.runTimeS) - 5;
            });
            
        svg.append("g")
            .attr("class","x axis")
            .attr("transform", "translate("+margin.left+","+(height - margin.bottom) +")")
            .call(xAxis);

        svg.append("g")
            .attr("class","y axis")
            .attr("transform","translate("+margin.left+",0)")
            .call(yAxis);
            
        svg.append("text")
            .attr("class","axislabel")
            .attr("transform","translate("+(margin.left+ .5*width)+","+(height-10)+")")
            .text("Song Run Time (drawn at "+1000/timefactor+"x actual speed)")

    }
  });
    
})();