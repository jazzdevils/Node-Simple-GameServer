var status_code = {
    0: "000",   //OK
    1: "001",   //not matched api_key
    2: "002",   //not matched cmd version
    3: "003",   //unknown cmd
    4: "004"    //not yet game matched
};

function getStatus_code(code){
    return status_code[code];
}

exports.getMsg2Clients_authentication = function (uniqueId, status){
    var r = {};
    r.action = "authentication";
    r.connection_id = uniqueId;
    r.status = getStatus_code(status);

    return JSON.stringify(r);
};

exports.getMsg2Clients_adduserinfo = function (user, status){
    var r = {};
    r.action = "adduserinfo";
    r.gametype_code = user.gametype_code;
    r.connection_id = user.connection_id;
    r.status = getStatus_code(status);

    return JSON.stringify(r);
};

exports.getMsg2Clients_arrange = function (user, status){
    var r = {};
    r.action = "arrange";
//    r.gametype_code = user.gametype_code;
    r.connection_id = user.connection_id;
    r.status = getStatus_code(status);

    return JSON.stringify(r);
};

exports.getMsg2Clients_playerinfo = function (user, playerinfo, status){
    var r = {};
    r.action = "playerinfo";
    r.connection_id = user.connection_id;
    r.status = getStatus_code(status);
    r.players = {}

    for (var i = 0, len = playerinfo.length; i < len; i++){
        r.players[i] = playerinfo[i];
    }

    return JSON.stringify(r);
};

exports.getMsg2Clients_getquiz = function (user, strquiz, status){
    var r = {};
    r.action = "getquiz";
    r.connection_id = user.connection_id;
    r.status = getStatus_code(status);
    r.quiz = strquiz;

//    console.log(JSON.stringify(r));
    return JSON.stringify(r);
};

exports.getMsg2Clients_playnext = function(user, quiz_index, status){
    var r = {};
    r.action = "playnext";
    r.connection_id = user.connection_id;
    r.quiz_index = quiz_index;
    r.status = getStatus_code(status);

    return JSON.stringify(r);
};

exports.getMsg2Clients_getjudgment = function(user, quiz_score, quiz_index, reward_point, correct_index, judgment ,status){
    var r = {};
    r.action = "playing";
    r.subaction = "choice";
    r.id = user.id;
    r.quiz_index = quiz_index;
    r.reward_point = reward_point;
    r.total_point = quiz_score.total_point;
    r.correct_index = correct_index;
    r.correct_count = quiz_score.correct_count;
    r.wrong_count = quiz_score.wrong_count;
    r.judgment = judgment;
    r.status = getStatus_code(status);

    return JSON.stringify(r);
};

exports.getMsg2Clients_playend = function(user, status){
    var r = {};
    r.action = "playend";
    r.id = user.id;
    r.connection_id = user.connection_id;
    r.status = getStatus_code(status);

    return JSON.stringify(r);
};

exports.getMsg2Clients_playresult = function(user, score_r, status){
    var r = {};
    r.action = "playresult";
    r.id = user.id;
    r.connection_id = user.connection_id;
    r.status = getStatus_code(status);
    r.score_r = score_r;
    return JSON.stringify(r);
};

exports.getMsg2Clients_exceptionClose = function (userid, gameplaying, status){
    var r = {};
    r.action = "exceptionclose";
    r.closed_conn_id = userid;
    r.gameplaying = gameplaying;
    r.status = getStatus_code(status);

//    console.log(JSON.stringify(r));
    return JSON.stringify(r);
};