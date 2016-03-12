var React = require('react');
var ReactDOM = require('react-dom');
var Stock = require('./Stock');
var Provider = require('react-redux').Provider;
var store = require('./store');

ReactDOM.render(
    <Provider store={store}>
        <Stock url="/stock"/>
    </Provider>,
    document.getElementById('stock')
 );
