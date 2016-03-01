var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');
var d3 = require('d3');

var StockInfo = React.createClass({
    drawLineChart: function(data) {
        var dataset = [];
        var xMarks = [];
        var len = data.length;
        var max = 0;
        var min = 10000;
        for(var i = 1; i < len; i++) {
            dataset.push(parseFloat(data[i].end));
            xMarks.push(data[i].date);
        }
        
        var w = 1000;
        var h = 400;
        var padding = 40;
        // title height
        var head_height  = padding;
        var title = data[0].name + "股票收盘统计图";
        var subTitle = data[1].date + " 至 " + data[data.length - 1].date;
        
        var foot_height = padding;
        
        // define svg
        var svg = d3.select("#stockinfo")
            .attr("width", w)
            .attr("height", h);
        // add background
        svg.append("g")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", w)
            .attr("height", h)
            .style("fill", "#FFF")
            .style("stroke-width", 2)
            .style("stroke", "#E7E7E7");
                                  
        // add title
        if(title != "")
        {
            svg.append("g")
                .append("text")
                .text(title)
                .attr("class", "title")
                .attr("x", w/2)
                .attr("y", head_height);
            head_height += 30;
        }
                       
   
        // add sub title
        if(subTitle != "")
        {
            svg.append("g")
                .append("text")
                .text(subTitle)
                .attr("class", "subTitle")
                .attr("x", w / 2)
                .attr("y", head_height);
            head_height += 20;
        }
                     
        
        var xScale = d3.scale.linear()
            .domain([0, dataset.length - 1])
            .range([padding, w - padding]);
        
        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([h - foot_height, head_height]);
        // define s axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom").
            ticks(5);
        
        var xBar = svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            .selectAll("text")
            .text(function(d){
                return xMarks[d];
            });
        // define y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left").
            ticks(10);
    
        var yBar=svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
                                  
        // add line chart
        var line = d3.svg.line()
            .x(function(d, i){return xScale(i);})
            .y(function(d){return yScale(d);});
        var path=svg.append("path")
            .attr("d", line(dataset))
            .style("fill", "#F00")
            .style("fill", "none")
            .style("stroke-width", 1)
            .style("stroke", "#09F")
            .style("stroke-opacity", 0.9);
        
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) {
                return xScale(i);
            })
            .attr("cy", function(d) {
                return yScale(d);
            })
            .attr("r",3)
            .attr("fill","#09F");
        
        yBar.transition().duration(1000).call(yAxis);
        
        yScale = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([h - padding, head_height]);
        
        path.transition().duration(1000).attr("d", line(dataset));
        
        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1000)
            .attr("cx", function(d, i) {
                return xScale(i);
            })
            .attr("cy", function(d) {
                return yScale(d);
            })      
    },
    
  render: function() {
    return (
        <svg id="stockinfo">
        </svg>
    );
  }
});

module.exports = StockInfo; 
