var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var StockCompareList = React.createClass({
  render: function() {
    var stocks = this.props.stockCompare.map(function (stock_id){
        return (
            <option key={stock_id} ref={stock_id}>
            {stock_id}
            </option>
        );
    });
    return(
        <select key="stockcompare" id="stockcompare" ref="stockcompare">
        {stocks}
        </select>
    );
  }
});

module.exports = StockCompareList; 
