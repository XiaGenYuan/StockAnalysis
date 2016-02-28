var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var StockSelect = React.createClass({
  stockSelect: function(e) {
    var select_data = e.target.value;
    this.refs.op1.text = select_data;
    alert(select_data);
  },
  render: function() {
    return (
        <select name="stock" id="stock" onChange={this.stockSelect}>
        <option ref="op1">beijing</option>
        <option>chognqing</option>
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
  render: function() {
    return (
      <div className="stock">
        选择股票
        <StockSelect/>
        <p></p>
        <StockInfo/>
      </div>
    );
  }
});

module.exports = Stock; 
