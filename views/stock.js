var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var StockSelect = require('./StockSelect');
var StockInfo = require('./StockInfo');


var Stock = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
    
    reflashTable: function(data) {
        var stockinfo = document.getElementById("stockinfo");
        var len = data.length;
        /*stockinfo.rows = len;
        var info = "";
        for(var i = 0; i < len; ++ i){
            info += data[i].name + " " + data[i].date + " " + data[i].open + " " + data[i].max +
            " " + data[i].min + " " + data[i].end + " " + data[i].uprate + " " + data[i].vibrationrate + 
            " " + data[i].sumtimes + " " + data[i].summoney + "\n";
        }
        stockinfo.value = info;
        */
        
        this.refs.stockinfo.drawLineChart(data);
    },
    
    loadStockIDsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data:data});
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
                this.reflashTable(data);
            }.bind(this),
            error: function(xhr, status, err) {
                alert(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    
    componentDidMount: function() {
        this.loadStockIDsFromServer();
    },
    
  render: function() {
    return (
      <div className="stock">
        选择股票
        <StockSelect data={this.state.data} onSelectStock={this.handleStockIDToServer}/>
        <p></p>
        <StockInfo ref="stockinfo"/>
      </div>
    );
  }
});

module.exports = Stock; 
