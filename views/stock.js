var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');
var redux = require('redux');
var ReactRedux = require('react-redux');

var StockSelect = require('./StockSelect');
var StockInfo = require('./StockInfo');
var StockCompareList = require('./StockCompareList');
var Provider = require('react-redux');
var actions = require("./actions");


var Stock = React.createClass({ 
    reflashTable: function(stockname, companyname, data) {
        this.refs.stockinfo.drawLineChart(stockname, companyname, data);
    },
    
    loadStockIDsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.props.updateIDs(data);
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
                this.props.updateStockInformation(data);
                this.reflashTable(stockname, "");
            }.bind(this),
            error: function(xhr, status, err) {
                alert(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    
    addStockToCompare: function() {
        var stockCompare = this.props.stockCompare;
        stockCompare.push(document.getElementById("stockselect").value);
        this.props.updateStockCompare(stockCompare);
        this.compareShoworNot();
    },
    
    deleteStockFromCompare: function() {
        var deleteIndex = document.getElementById("stockcompare").selectedIndex;
        var stockCompare = this.props.stockCompare;
        stockCompare.splice(deleteIndex, 1);
        this.props.updateStockCompare(stockCompare);
        this.compareShoworNot();
    },
    
    deleteAllStocksFromCompare: function() {
        this.props.updateStockCompare([]);
        this.compareShoworNot();
    },
    
    compareShoworNot: function() {
        var checked = this.refs.showornot.checked;
        if(checked === true) {
            //var comparelist = document.getElementById("stockcompare").options;
            var comparelist = this.props.stockCompare;
            var compare_stocks = "";
            for(var i = 0; i < comparelist.length; ++ i) {
                var stockid = comparelist[i];
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
        <StockSelect  ref="select" data={this.props.stockIDs} onSelectStock={this.handleStockIDToServer}/>
        <button type="button" onClick={this.addStockToCompare}>增加对比</button>
        &nbsp;&nbsp;
        对比股票列表
        <StockCompareList ref="stockcompare" stockCompare={this.props.stockCompare}/>
        <button type="button" onClick={this.deleteStockFromCompare}>删除</button>
        <button type="button" onClick={this.deleteAllStocksFromCompare}>全部删除</button>
        <input type="checkbox" id="checkbox" ref="showornot" onClick={this.compareShoworNot}>对比显示</input>
        <p></p>
        <StockInfo ref="stockinfo" stockInformation={this.props.stockInformation}/>
      </div>
    );
  }
});


var mapStateToProps = function(state){
	return {
        stockInformation: state.stockInformation,
        stockIDs: state.stockIDs,
        stockCompare: state.stockCompare
    };
};

var mapDispatchToProps = function(dispatch){
	return {
		updateStockInformation: function(stockInformation){
            dispatch(actions.updateStockInformation(stockInformation)); 
        },
        updateIDs: function(stockIDs){
            dispatch(actions.updateIDs(stockIDs));
        },
        updateStockCompare: function(stockCompare) {
            dispatch(actions.updateStockCompare(stockCompare));
        }
	}
};


module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Stock); 
