var React = require('react');
var ReactDOM = require('react-dom');
var CommentBox = require('./Stock');

ReactDOM.render(
    <CommentBox url="/stock"/>,
    document.getElementById('stock')
 );
