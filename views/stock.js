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
        this.refs.stockinfo.drawLineChart(data);
    },
    
    loadStockIDsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data:data});
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
