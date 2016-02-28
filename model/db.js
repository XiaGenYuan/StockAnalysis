var xlsx = require('node-xlsx');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
 
 db.serialize(function() {
     
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
 });
 
 module.exports = db;
