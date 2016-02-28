var express = require('express');
var router = express.Router();
var db = require('../model/db');

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
    var comp;
    console.log("stockid:" + stockid);
    db.each("SELECT name, company FROM stocks WHERE name='" + stockid + "'", function(err, row) {
        comp = row.company;
    });
    res.json({'company': comp});
};
