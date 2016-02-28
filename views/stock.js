var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var StockSelect = React.createClass({
  stockSelect: function(e) {
    var select_data = e.target.value;
    this.props.onSelectStock({stockid: select_data});
  },
    
  render: function() {
    var stocks = this.props.data.map(function (stock_id){
        return (
            <option ref={stock_id}>
            {stock_id}
            </option>
        );
    });
    return(
        <select name="stock" id="stock" onChange={this.stockSelect}>
        {stocks}
        </select>
    );
  }
});


var StockInfo = React.createClass({
  render: function() {
    return (
        <table id="stockinfo" border="1">
        <tr>
            <th>股票代码</th>
            <th>股票公司名</th>
            <th>开盘价</th>
            <th>收盘价</th>
            <th>交易总额</th>
        </tr>
        <tr>
            <td>IBM</td>
            <td>IBM</td>
            <td>100.2</td>
            <td>120.3</td>
            <td>87392</td>
        </tr>
        </table>
    );
  }
});


var Stock = React.createClass({
  getInitialState: function() {
    return {data: []};
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
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
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
        <StockInfo/>
      </div>
    );
  }
});

module.exports = Stock; 
