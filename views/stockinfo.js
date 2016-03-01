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
        //用一个变量存储标题和副标题的高度，如果没有标题什么的，就为0
        var head_height  = padding;
        var title = data[0].name + "股票收盘统计图";
        var subTitle = data[1].date + " 至 " + data[data.length - 1].date;
        //用一个变量计算底部的高度，如果不是多系列，就为0
        var foot_height = padding;
        
        //定义画布
        var svg = d3.select("#stockinfo")
            .attr("width", w)
            .attr("height", h);
        //添加背景
        svg.append("g")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", w)
            .attr("height", h)
            .style("fill", "#FFF")
            .style("stroke-width", 2)
            .style("stroke", "#E7E7E7");
                                  
        //添加标题
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
                       
   
        //添加副标题
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
                     
        //横坐标轴比例尺
        var xScale = d3.scale.linear()
            .domain([0, dataset.length - 1])
            .range([padding, w - padding]);
        //纵坐标轴比例尺
        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([h - foot_height, head_height]);
        //定义横轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom").
            ticks(5);
        //添加横坐标轴并通过编号获取对应的横轴标签
        var xBar = svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis)
            .selectAll("text")
            .text(function(d){
                return xMarks[d];
            });
        //定义纵轴
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left").
            ticks(10);
        //添加纵轴
        var yBar=svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
                                  
        //添加折线
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
        //添加系列的小圆点
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
        //重新作图
        yBar.transition().duration(1000).call(yAxis);
        //纵轴数据更新
        yScale = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([h - padding, head_height]);
        //重绘路径
        path.transition().duration(1000).attr("d", line(dataset));
        //重绘4圆点
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
