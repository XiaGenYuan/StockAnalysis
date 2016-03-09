var db = require('../model/db');

var jsonWrite = function(res, ret) {
    if( typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    query: function(sql, req, res){
        db.all(sql, function(err, rows) {
            //console.log(rows);
            jsonWrite(res, rows);
        });
    }
};

