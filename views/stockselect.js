var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var StockSelect = React.createClass({
  SelectChanged: function(e) {
    var select_data = e.target.value;
    this.props.onSelectStock({stockid: select_data});
  },
    
  render: function() {
    var stocks = this.props.data.map(function (stock_id){
        return (
            <option key={stock_id} ref={stock_id}>
            {stock_id}
            </option>
        );
    });
    return(
        <select key="stockselect" id="stockselect" ref="stockselect" onChange={this.SelectChanged}>
        {stocks}
        </select>
    );
  }
});

module.exports = StockSelect; 
