var xlsx = require('node-xlsx');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
 
 db.serialize(function() {
     // 创建股票代码及其公司的相关信息表
     db.run('CREATE TABLE stocks (name TEXT, company TEXT)');
     var stmt = db.prepare('INSERT INTO stocks VALUES (?, ?)');
     
     var obj = xlsx.parse('./model/data/company.xlsx');
     var companies = obj[0].data;
     var len = companies.length;
     
     for(var i = 0; i < len; ++ i) {
         stmt.run(companies[i][0], companies[i][1]);
     }
     
     stmt.finalize();
     
     //db.each('SELECT rowid AS id, name, company FROM stocks', function(err, row) {
     //    console.log(row.id + ":" + row.name + "-"  + row.company);
     //});
     // 创建每天的交易信息表
     db.run('CREATE TABLE exchanges (name TEXT, date TEXT, open TEXT, max TEXT,' + 
             'min TEXT, end TEXT, uprate TEXT, vibrationrate TEXT, sumtimes TEXT, summoney TEXT)');
     
     for(var i = 0; i < len; ++ i) {
         stmt = db.prepare('INSERT INTO exchanges VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
         obj = xlsx.parse('./model/data/' + companies[i][0] + '.xlsx');
         var change = obj[0].data;
         var change_len = change.length;
         for(var j = 1; j < change_len; ++ j) {
             stmt.run(companies[i][0], change[j][0], change[j][1], change[j][2], change[j][3], change[j][4], change[j][5], change[j][6], change[j][7], change[j][8]);
         }
         stmt.finalize();
     }
    
    /*db.each("SELECT name, summoney FROM exchanges WHERE name='" + "IBM'"  , function(err, row) {
         console.log(row.name + "-"  + row.summoney);
    });*/
     console.log('datebase initialization finished!');
 });
 
 module.exports = db;

