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
        <select name="stock" id="stock" ref="stock" onChange={this.stockSelect}>
        {stocks}
        </select>
    );
  }
});

module.exports = StockSelect; 
