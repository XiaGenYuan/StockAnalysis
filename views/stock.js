var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var StockSelect = require('./StockSelect');
var StockInfo = require('./StockInfo');
var StockCompareList = require('./StockCompareList');


var Stock = React.createClass({
  getInitialState: function() {
    return {data: [], compareData: [], compareDataTotal: []};
  },
    
    reflashTable: function(stockname, companyname, data) {
        this.refs.stockinfo.drawLineChart(stockname, companyname, data);
    },
    
    loadStockIDsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
                if(data.length > 0){
                    //var id = data[0].split(' ')[0];
                    this.handleStockIDToServer({stockid: data[0]});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    handleStockIDToServer: function(stockid) {
        // submit to stock id to server
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: stockid,
            success: function(data) {
                var stockname = stockid.stockid.split(' ')[0];
                var companyname = stockid.stockid.split(' ')[1];
                var checked = this.refs.showornot.checked;
                if(checked === false) {
                    this.reflashTable(stockname, companyname, [data]);
                } else {
                    var compareDataTotal = this.state.compareDataTotal;
                    compareDataTotal.push(data);
                    this.setState({compareDataTotal: compareDataTotal});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                alert(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    
    addStockToCompare: function() {
        this.state.compareData.push(document.getElementById("stockselect").value);
        this.setState({compareData: this.state.compareData});
    },
    
    deleteStockFromCompare: function() {
    },
    
    deleteAllStocksFromCompare: function() {
    },
    
    compareShoworNot: function() {
        //alert("checkbox:" + this.refs.showornot.checked);
        var checked = this.refs.showornot.checked;
        if(checked === true) {
            this.setState({compareDataTotal: []});
            alert("0:" + this.state.compareDataTotal.length);
            var comparelist = document.getElementById("stockcompare").options;
            var compareStockData = [];
            var compare_stocks = "";
            alert("1:" + this.state.compareDataTotal.length);
            for(var i = 0; i < comparelist.length; ++ i) {
                var stockid = comparelist[i].text;
                this.handleStockIDToServer({stockid: stockid});
                var stockname = stockid.split(' ')[0];
                if(i < comparelist.length - 1) {
                    compare_stocks += stockname + "、";
                } else {
                    compare_stocks += stockname;
                }
            }
            alert("2:" + this.state.compareDataTotal.length);
            compare_stocks += " " + comparelist.length + "支股票";
            var companyname = "多公司";
            var compareDataTotal = this.state.compareDataTotal;
            this.reflashTable(compare_stocks, companyname, compareDataTotal);
        } else {
            var stockselect = document.getElementById("stockselect").value;
            this.handleStockIDToServer({stockid: stockselect});
        }
    },
    
    componentDidMount: function() {
        this.loadStockIDsFromServer();
    },
    
  render: function() {
    return (
      <div className="stock">
        选择股票
        <StockSelect  ref="select" data={this.state.data} onSelectStock={this.handleStockIDToServer}/>
        <button type="button" onClick={this.addStockToCompare}>增加对比</button>
        &nbsp;&nbsp;
        对比股票列表
        <StockCompareList ref="stockcompare" compareData={this.state.compareData}/>
        <button type="button" onClick={this.deleteStockFromCompare}>删除</button>
        <button type="button" onClick={this.deleteAllStocksFromCompare}>全部删除</button>
        <input type="checkbox" ref="showornot" onClick={this.compareShoworNot}>对比显示</input>
        <p></p>
        <StockInfo ref="stockinfo"/>
      </div>
    );
  }
});

module.exports = Stock; 
