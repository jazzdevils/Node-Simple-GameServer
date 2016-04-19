var dbexecute = require('./dbexecute');

exports.getQuizList = function(user, callback){
    var json_row;
    dbexecute.getQuizList_query(user.q_category_id, user.q_subcategory_id, user.q_type, function(json_row){
        callback(json_row);
    });
};

exports.setInitializeQuizScore = function(quiz_score, callback){
    quiz_score.total_point = 0;
    quiz_score.correct_count = 0;
    quiz_score.wrong_count = 0;
//    quiz_score.correct_rate = 0;

    callback(quiz_score);
};

exports.getQuizJudgment = function(user, quiz_score, quiz_index, choice_index, callback){
    var quizchannel = user.quizdata;
    var judgment = false;

    console.log("quizchannel[quiz_index].ANSWER1 : " + quizchannel[quiz_index].ANSWER1);
    console.log("choice_index : " + choice_index);

    if(quizchannel[quiz_index].ANSWER1 == choice_index){
        quiz_score.total_point = quiz_score.total_point + quizchannel[quiz_index].REWARD_POINT
        quiz_score.correct_count = quiz_score.correct_count + 1;

        judgment = true;
    } else {
        quiz_score.wrong_count = quiz_score.wrong_count + 1;
    }
    callback(judgment, quizchannel[quiz_index].REWARD_POINT);
};

exports.getQuizResult = function(score_r){
    var result = {};
//    console.log("before : " + JSON.stringify( score_r));
    score_r = score_r.sort(function (a, b){
        console.log("a : " + JSON.stringify(a));
        console.log("b : " + JSON.stringify(b));
        return a.total_point < b.total_point;  //quiz_score.total_point
    });
//    console.log("after : " + JSON.stringify(score_r));
//    callback(result);
};