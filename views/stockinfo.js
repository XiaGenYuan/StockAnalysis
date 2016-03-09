var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');
var d3 = require('d3');

var StockInfo = React.createClass({
    addSvg: function(w, h, datainfo) {
        // define svg
        var svg = d3.select("#stockinfo")
            .data(datainfo)
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
        return svg;
    },
    
    addTitle: function(svg, w, h, head_height, title, subTitle) {
        // add title
        if(title != "") {
            svg.append("g")
                .append("text")
                .text(title)
                .attr("class", "title")
                .attr("x", w / 2)
                .attr("y", head_height);
            head_height += 30;
        }
   
        // add sub title
        if(subTitle != "") {
            svg.append("g")
                .append("text")
                .text(subTitle)
                .attr("class", "subTitle")
                .attr("x", w / 2)
                .attr("y", head_height);
            head_height += 20;
        }
    },    
    
    drawAxis: function(svg, w, h, padding, xScale, yScale, xMarks) {
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
    },
    
    addSvgMouseFunction: function(svg, xScaleOpp, yScale, h, foot_height, stockname, companyname, polyline, tooltip) {
        svg.on('mousemove', function(d) {
            var pos = d3.mouse(this);
            var index = parseInt(xScaleOpp(pos[0]));
            polyline.attr({points: '' + pos[0] + ', ' + yScale(parseFloat(d[0][index].end)) + 
                ' ' + pos[0] + ', ' + (h - foot_height)});  
            
            tooltip.html("股票：" + stockname +  "<br />" +
                "公司: " + companyname + "<br />" + 
                "日期：" + d[0][index].date + "<br />" + 
                "开盘：" + d[0][index].open + "<br />" + 
                "最高: " + d[0][index].max + "<br />" + 
                "最低: " + d[0][index].min + "<br />" +
                "收盘：" + d[0][index].end + "<br />" + 
                "涨幅: " + (d[0][index].uprate * 100).toFixed(2) + "%" + "<br />" + 
                "振幅：" + (d[0][index].vibrationrate * 100).toFixed(2) + "%" + "<br />" +
                "总手: " + d[0][index].sumtimes + "<br />" +  
                "总额：" + d[0][index].summoney)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
				.style("opacity",1.0);
        })
        .on('mouseenter', function(d) {
        })
        .on('mouseout', function(d) {
            polyline.attr({points: '0, 0 0, 0'});
            tooltip.style("opacity", 0.0);
        });
    },       
    
    addPolyline: function(svg){
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
            return polyline;
    },        
    
    addTooltip: function() {
        d3.select('#tooltip').remove();
		var tooltip = d3.select("body")
            .append("div")
            .attr('id', 'tooltip')
            .attr("class", "tooltip")
            .style("opacity", 0.0);
        return tooltip;
    },        
    
    getMaxdata: function (dataset) {
		maxdata = 0;	
		for(var i = 0; i < dataset.length; i ++) {
			maxdata = d3.max([maxdata, d3.max(dataset[i])]);	
		}		
		return maxdata;
	},
    
    CrystalLineObject: function(svg, dataset, xScale, yScale, lineColor) {		
            this.group = null;
            this.path = null;
		
            this.init = function(id) {
                var arr = dataset[id];
                this.group = svg.append("g")
									
                var line = d3.svg.line()
                    .x(function(d,i){return xScale(i);})
                    .y(function(d){return yScale(d);});
                
                this.path = this.group.append("path")
                    .attr("d", line(arr))				
                    .style("fill", "none")
                    .style("stroke-width", 1)
                    .style("stroke", lineColor[id])
                    .style("stroke-opacity", 0.9);
				/*				
                this.group.selectAll("circle")
                    .data(arr)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d,i) {
                        return xScale(i);
                    }) 
                    .attr("cy", function(d) {
                        return yScale(d);  
                    })  
                    .attr("r", 5)
                    .attr("fill", lineColor[id]);
                */
            };
        },
    
    
    drawLineChart: function(stockname, companyname, mutildata) {
        var stockIdArr = stockname.split(",");
        var comparestockssize = stockIdArr.length;
        var dataset = [];
        for(var i = 0; i < comparestockssize; ++ i) {
            var arr = [];
            dataset.push(arr);
        }
        
        var data0 = [];

        for(var j = 0; j < mutildata.length; ++ j) {
            if(stockIdArr[0] === mutildata[j].name) {
                data0.push(mutildata[j]);
            };
            for(var i = 0; i < comparestockssize; ++ i) {
                if(stockIdArr[i] === mutildata[j].name) {
                    dataset[i].push(parseFloat(mutildata[j].end));
                }
            }
        }
        
        var datainfo = [[data0]];
       
        var maxdata = this.getMaxdata(dataset);
            
        var xMarks = [];
        var lineColor = ["#F00","#09F","#0F0", "F09", "F90", "0F9", "9F9"];        
        var len = data0.length;
        for(var i = 0; i < len; i ++) {
            xMarks.push(data0[i].date);
        }
        
        var w = 1000;
        var h = 400;
        var padding = 40;
        var head_height  = padding;
        var foot_height = padding;
        var title = stockname + "股票收盘统计图";
        var subTitle = data0[1].date + " 至 " + data0[data0.length - 1].date;
        
        var svg = this.addSvg(w, h, datainfo);
        
        this.addTitle(svg, w, h, head_height, title, subTitle);
        
        var xScale = d3.scale.linear()
            .domain([0, dataset[0].length - 1])
            .range([padding, w - padding]);
        
        var xScaleOpp = d3.scale.linear()
            .domain([padding, w - padding])
            .range([0, dataset[0].length - 1]);
        
        var yScale = d3.scale.linear()
            .domain([0, maxdata])
            .range([h - foot_height, head_height]);
        
        var yScaleOpp = d3.scale.linear()
            .domain([h - foot_height, head_height])
            .range([0, maxdata]);
        
        this.drawAxis(svg, w, h, padding, xScale, yScale, xMarks);
        
        for(var i = 0; i < comparestockssize; ++ i) {        
            var newLine = new this.CrystalLineObject(svg, dataset, xScale, yScale, lineColor);
            newLine.init(i);
        }
        
        var polyline = this.addPolyline(svg);
        var tooltip = this.addTooltip();
        this.addSvgMouseFunction(svg, xScaleOpp, yScale, h, foot_height, stockname, companyname, polyline, tooltip);
    },
    
    
        
  render: function() {
    return (
        <svg id="stockinfo">
        </svg>
    );
  }
});

module.exports = StockInfo; 
