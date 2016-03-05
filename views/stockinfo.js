var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');
var d3 = require('d3');

var StockInfo = React.createClass({
    drawLineChart: function(stockname, companyname, data) {         
        var dateinfo = [[data]];
        var dataset = [];
        var xMarks = [];
        var len = data.length;
        var max = 0;
        var min = 10000;
        for(var i = 1; i < len; i++) {
            dataset.push(parseFloat(data[i].end));
            console.log(data[i].date);
            xMarks.push(data[i].date);
        }
        
        var w = 1000;
        var h = 400;
        var padding = 40;
        // title height
        var head_height  = padding;
        var title = stockname + "股票收盘统计图";
        var subTitle = data[1].date + " 至 " + data[data.length - 1].date;
        
        var foot_height = padding;
        
        // define svg
        var svg = d3.select("#stockinfo")
            .data(dateinfo)
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
        
        var xScaleOpp = d3.scale.linear()
            .domain([padding, w - padding])
            .range([0, dataset.length - 1]);
        
        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([h - foot_height, head_height]);
        
        var yScaleOpp = d3.scale.linear()
            .domain([h - foot_height, head_height])
            .range([0, d3.max(dataset)]);
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
        var path = svg.append("path")
            .attr("d", line(dataset))
            .style("fill", "#F00")
            .style("fill", "none")
            .style("stroke-width", 1)
            .style("stroke", "#09F")
            .style("stroke-opacity", 0.9);
        
        /*
        var circle = svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) {
                return xScale(i);
            })
            .attr("cy", function(d) {
                return yScale(d);
            })
            .attr("r", 3)
            .attr("fill", "#09F");
        */
            
        yBar.transition().duration(1000).call(yAxis);
        
        
        yScale = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([h - padding, head_height]);
        
        path.transition().duration(1000).attr("d", line(dataset));
        
        /*
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
        */
            
        // 在 svg 中插入 polyline
        polyline = svg.append('polyline')
                        .attr({
                            points: '0, 0 0, 0'
                        })
                        .attr('id', 'line')
                        .style({
                            fill: 'black',
                            stroke: 'green',
                            'stroke-width': 1
                        });
        
        /*
        var info = svg.append("g")
                        .append("text")
                        .text("")
                        .attr('id', 'info')
                        .attr("x", padding)
                        .attr("y", head_height);
                        */
                        
        d3.select('#tooltip').remove();
        
		var tooltip = d3.select("body")
            .append("div")
            .attr('id', 'tooltip')
            .attr("class", "tooltip")
            .style("opacity", 0.0);
            
                
        svg.on('mousemove', function(d) {
            var pos = d3.mouse(this);
            var index = parseInt(xScaleOpp(pos[0]));
            /*info.text("股票名：" + d[0][index + 1].name +  " \r\n" +
                      "日期：" + d[0][index + 1].date + " \r\n" + 
                      "开盘价：" + d[0][index + 1].open + " \r\n" + 
                      "收盘价：" + d[0][index + 1].end + " \r\n" + 
                      "交易总额：" + d[0][index + 1].summoney)
                .attr("x", padding)
                .attr("y", h - padding - 10);
                */
            polyline.attr({points: '' + pos[0] + ', ' + yScale(parseFloat(d[0][index + 1].end)) + ' ' + pos[0] + ', ' + (h - foot_height)});  
            
            tooltip.html("股票：" + stockname +  "<br />" +
                "公司: " + companyname + "<br />" + 
                "日期：" + d[0][index + 1].date + "<br />" + 
                "开盘：" + d[0][index + 1].open + "<br />" + 
                "最高: " + d[0][index + 1].max + "<br />" + 
                "最低: " + d[0][index + 1].min + "<br />" +
                "收盘：" + d[0][index + 1].end + "<br />" + 
                "涨幅: " + (d[0][index + 1].uprate * 100).toFixed(2) + "%" + "<br />" + 
                "振幅：" + (d[0][index + 1].vibrationrate * 100).toFixed(2) + "%" + "<br />" +
                "总手: " + d[0][index + 1].sumtimes + "<br />" +  
                "总额：" + d[0][index + 1].summoney)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
				.style("opacity",1.0);
        })
        .on('mouseenter', function(d) {
        })
        .on('mouseout', function(d) {
            //d3.select('#line').remove();
            //d3.select('#info').remove();
            //info.text('');
            polyline.attr({points: '0, 0 0, 0'});
            tooltip.style("opacity", 0.0);
        });
    },
    
        
  render: function() {
    return (
        <svg id="stockinfo">
        </svg>
    );
  }
});

module.exports = StockInfo; 
