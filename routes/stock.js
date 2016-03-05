var express = require('express');
var router = express.Router();
var db = require('../model/db');
var exchangesQuery = require('../model/exchanges');

// TODO: 直接放在list函数中会出错，不知原因
var stocks = new Array();
db.each("SELECT name, company FROM stocks", function(err, row) {
    stocks.push(row.name + " " + row.company);
});

/* GET home page. */
exports.list = function(req, res) {
  res.json(stocks);
};



// update stock information
exports.update = function(req, res) {
    var stockidname = req.body.stockid;
    var stockid = stockidname.split(" ")[0];
    console.log("stockid:" + stockid);
    var sql = "SELECT date, open, max, min, end, uprate, vibrationrate, sumtimes, summoney FROM exchanges WHERE name='" + 
         stockid + "'";
    exchangesQuery.query(sql, req, res);
    /*var stockidname = req.body.stockid;
    var stockid = stockidname.split(" ")[0];
    var comp;
    console.log("stockid:" + stockid);
    db.each("SELECT name, company FROM stocks", function(err, row) {
        exchanges.push(row.name);
        //exchanges = row.name + "";
    });*/
    /*db.each("SELECT name, date, open, max, min, end, uprate, vibrationrate, sumtimes, summoney FROM exchanges", function(err, row) {
         stock_exchanges.push(row.date + " " + row.open + " " + row.max + " " + row.min + " " + row.end + " " + row.uprate + 
             " " + row.vibrationrate + " " + row.sumtimes + " " + row.summoney);
    });*/
    //console.log(exchanges);
    //res.json({'exchanges': exchanges});
};
