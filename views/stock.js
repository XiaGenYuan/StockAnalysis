var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');
var redux = require('redux');
var react_redux = require('react-redux');

var StockSelect = require('./StockSelect');
var StockInfo = require('./StockInfo');
var StockCompareList = require('./StockCompareList');

/*
var reducer = function(state, action){
    switch (action.type) {
        case 'modify_data':
            return action.content;
        default:
            return state;
    }
};

var store = redux.createStore(reducer, []);
*/


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
                    var id = data[0].split(' ')[0];
                    this.handleStockIDToServer({stockid: id});
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
                var stockname = stockid.stockid;
                this.reflashTable(stockname, "", data);
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
        var checked = this.refs.showornot.checked;
        if(checked === true) {
            //store.dispatch({type: 'modify_data', data: []});
            var comparelist = document.getElementById("stockcompare").options;
            var compare_stocks = "";
            for(var i = 0; i < comparelist.length; ++ i) {
                var stockid = comparelist[i].text;
                var stockname = stockid.split(' ')[0];
                if(i < comparelist.length - 1) {
                    compare_stocks += stockname + ",";
                } else {
                    compare_stocks += stockname;
                }
            }
            this.handleStockIDToServer({stockid: compare_stocks});
        } else {
            var stockselect = document.getElementById("stockselect").value;
            this.handleStockIDToServer({stockid: stockselect.split(" ")[0]});
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
        <input type="checkbox" id="checkbox" ref="showornot" onClick={this.compareShoworNot}>对比显示</input>
        <p></p>
        <StockInfo ref="stockinfo"/>
      </div>
    );
  }
});

module.exports = Stock; 
