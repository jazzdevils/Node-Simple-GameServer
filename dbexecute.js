var _Pool = require('./dbpool');
/*
 * GET users listing.
 */

exports.getTestList_query = function(cb){
    _Pool.acquire(function(err, db) {
        if (err) {
            return "CONNECTION error: " + err;
        }

        db.query("select * from test",[],function(err, rows, columns) {
            _Pool.release(db);

            if (err) {
                return res.end("QUERY ERROR: " + err);
            }
//            for(var i=0; i<rows.length;i++){
//                console.log(rows[i].id+" | "+rows[i].test1+" | "+rows[i].test2 + " | "+rows[i].test3 + " | "+rows[i].test4);
//            }
            cb(rows);
        });
    });
};

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

exports.getQuizList_query = function(category1, category2, q_type, cb){
    _Pool.acquire(function(err, db) {
        if (err) {
            return "CONNECTION error: " + err;
        }

        db.query("call getQuizList (?,?, ?);", [category1, category2, q_type], function(err, rows, columns) {
            _Pool.release(db);

            if (err) {
                return "QUERY ERROR: " + err;
            }

            for(var i=0; i<rows[0].length;i++){
                var row = rows[0][i];

                if(row.ANSWER1 == "1"){
                    var answerStr = row.EX1;
                } else if(row.ANSWER1 == "2"){
                    var answerStr = row.EX2;
                } else if(row.ANSWER1 == "3"){
                    var answerStr = row.EX3;
                } else if(row.ANSWER1 == "4"){
                    var answerStr = row.EX4;
                }

                var EXs = [];
                EXs.push(row.EX1);
                EXs.push(row.EX2);
                EXs.push(row.EX3);
                EXs.push(row.EX4);

                var newEXs = shuffle(EXs);
                row.EX1 = newEXs[0];
                row.EX2 = newEXs[1];
                row.EX3 = newEXs[2];
                row.EX4 = newEXs[3];

                for(var j=0; j<newEXs.length;j++){
                    if(newEXs[j] === answerStr){
                        var newANSWER1 = ++j;
                        break;
                    }
                }
                row.ANSWER1 = newANSWER1;
            }

            cb(rows[0]);
        });
    });
};