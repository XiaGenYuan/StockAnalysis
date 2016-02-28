var React = require('react');
var ReactDOM = require('react-dom');
var Stock = require('./Stock');

ReactDOM.render(
    <Stock url="/stock"/>,
    document.getElementById('stock')
 );
