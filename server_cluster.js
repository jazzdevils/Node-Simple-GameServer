const CNT_JSON_START = 15;
const CNT_JSON_END = 13;

const QUIZ_FIRST_INDEX  = "0";

const _JSON_START = "__JSON__START__";
const _JSON_END = "__JSON__END__";

//Status code
const _OK = "0";                            //OK
const _UNMATCHED_CONNECTION_ID = "1";       //not matched connection_id
const _UNMATCHED_CMD_VER = "2";             //not matched cmd version
const _UNKNOWN_CMD = "3";                   //unknown cmd
const _NOT_YET_MATCHED_GAME = "4";          //not yet matched game

var shortid = require("shortid");
var dbexecute = require('./dbexecute');
var user_data = require('./user_data');
var cmd_return = require('./cmd_return');
var quiz = require('./quiz');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var game_channel = require('./game_channel');

var server = require('net').createServer()
    , sockets = {}  // this is where we store all current client socket connections
    , cfg = {
        port: 5027,
        buffer_size: 1024*8, // buffer is allocated per each socket client
        log: true
    }
    , STORE = {

    }
    , _log = function(){
        if (cfg.log) console.log.apply(console, arguments);
    };

// black magic
process.on('uncaughtException', function(err){
    _log('Exception: ' + err);
});

function nextGo(socket){
    var next_go = true;

    for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
        var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];
        if(userSocket.user_cmd_in == false){
            next_go = false;

            break;
        }
    }

    return next_go;
}

server.on('connection', function(socket) {
    socket.user = {};  //user information
    socket.quiz_score = {}; //user game score

    socket.user_cmd_in = false; //get the any command from user

    socket.setNoDelay(true);

    socket.setKeepAlive(true, 8000);

    socket.buffer = new Buffer(cfg.buffer_size);
    socket.buffer.len = 0;

    _log('New client: ' + socket.remoteAddress +':'+ socket.remotePort + ' connected by process #' +  process.id);

    socket.on('data', function(data_raw) {
        if (data_raw.length > (cfg.buffer_size - socket.buffer.len)) {
            _log("Message doesn't fit the buffer. Adjust the buffer size in configuration");
            socket.buffer.len = 0;
            return false;
        }

        socket.buffer.len +=  data_raw.copy(socket.buffer, socket.buffer.len); // keeping track of how much data we have in buffer

        var str, start, end, conn_id, channel;
        str = socket.buffer.slice(0,socket.buffer.len).toString();

        var time_to_exit = true;
        do{  // this is for a case when several messages arrived in buffer
            if ( (start = str.indexOf(_JSON_START)) !=  -1   &&  (end = str.indexOf(_JSON_END))  !=  -1 ) {
                var json = str.substr( start + CNT_JSON_START,  end-(start + CNT_JSON_START) );
                //something do on command
                var jsonObj = JSON.parse(json);
//                _log(json);
                switch (jsonObj.action){
                    case "authentication" :{
                        if(jsonObj.ver == "1"){
                            var uniqueID = shortid.generate();
                            socket.user.connection_id = uniqueID;

                            socket.write(_JSON_START + cmd_return.getMsg2Clients_authentication(uniqueID, _OK) + _JSON_END);
                        } else {
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_authentication("", _UNMATCHED_CMD_VER) + _JSON_END);
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);

                        break;
                    }
                    case "adduserinfo":{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
//                            _log(jsonObj);
                                socket.user = user_data.setUserData(jsonObj);

                                sockets[socket.user.gametype_code] = sockets[socket.user.gametype_code] || {}; // hashmap of sockets  subscribed to the same channel
                                sockets[socket.user.gametype_code][socket.user.connection_id] = socket;

                                socket.write(_JSON_START + cmd_return.getMsg2Clients_adduserinfo(socket.user, _OK) + _JSON_END);
                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_adduserinfo(socket.user, _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        } else {
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_adduserinfo(socket.user, _UNMATCHED_CONNECTION_ID) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);

                        break;
                    }
                    case "arrange"  :{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
                                var go = "false";
//                                _log("socket.user : " + JSON.stringify(socket.user));
                                socket.user.gamechannel = game_channel.get_gamechannel(sockets, socket.user
                                    , function(isMatched){
//                                        _log(isMatched);
                                        go = isMatched;
                                    }
                                );
                                if(go == "true"){
                                    _log(JSON.stringify(socket.user.gamechannel));

                                    for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                        var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];
                                        if(userSocket){
                                            userSocket.user.gameplaying = true;
                                            userSocket.write(_JSON_START + cmd_return.getMsg2Clients_arrange(userSocket.user, _OK) + _JSON_END);
                                        }
                                    }
                                } else {
                                    socket.write(_JSON_START + cmd_return.getMsg2Clients_arrange(socket.user, _NOT_YET_MATCHED_GAME) + _JSON_END);
                                }
//                                game_channel.print_game_channels_1on1();
                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_arrange(socket.user, _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        }else {
                            ////not matched connection_id
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_arrange(socket.user, _UNMATCHED_CONNECTION_ID) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);

                        break;
                    }
                    case "playerinfo" :{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
                                var otherplayerinfo = [];

                                for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                    var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];
                                    if(socket.user.connection_id !== userSocket.user.connection_id){
                                        otherplayerinfo.push(userSocket.user);
                                    }
                                }

                                socket.write(_JSON_START + cmd_return.getMsg2Clients_playerinfo(socket.user, otherplayerinfo, _OK) + _JSON_END);
                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_playerinfo(socket.user, otherplayerinfo, _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        }else {
                            ////not matched connection_id
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_playerinfo(socket.user,"", _UNKNOWN_CMD) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);
                        break;
                    }
                    case "getquiz":{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
                                socket.user_cmd_in = true;
                                if(nextGo(socket) == true){
                                    var json_row;

                                    quiz.getQuizList(socket.user, function(json_row){
//                                        _log("getQuiz : " + json_row);

                                        for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                            var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];

                                            if(userSocket){
                                                userSocket.user_cmd_in = false; //initialize command
                                                userSocket.user.quizdata = json_row;

                                                userSocket.write(_JSON_START + cmd_return.getMsg2Clients_getquiz(userSocket.user, json_row, _OK) + _JSON_END);
                                            }else {
                                                _log("could not send the getQuiz packet");
                                            }
                                        }
                                    });
                                }

                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_getquiz(socket.user, otherplayerinfo, _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        } else {
                            ////not matched connection_id
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_getquiz(socket.user,"", "", _UNKNOWN_CMD) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);

                        break;
                    }
                    case "playready":{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
                                socket.user_cmd_in = true;

                                if(nextGo(socket) == true){
                                    for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                        var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];

                                        if(userSocket){
                                            quiz.setInitializeQuizScore(userSocket.quiz_score, function(quiz_score){
                                                userSocket.quiz_score = quiz_score;
                                            });
                                            userSocket.user_cmd_in = false; //initialize command
                                            userSocket.write(_JSON_START + cmd_return.getMsg2Clients_playnext(userSocket.user, QUIZ_FIRST_INDEX, _OK) + _JSON_END);
                                        }
                                    }
                                }
                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_playnext(socket.user, QUIZ_FIRST_INDEX, _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        }else {
                            ////not matched connection_id
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_playnext(socket.user, QUIZ_FIRST_INDEX, _UNKNOWN_CMD) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);
                        break;
                    }
                    case "playing":{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
                                if(jsonObj.subaction == "choice" || jsonObj.subaction == "timeout"){
                                    socket.user_cmd_in = true;

                                    if(jsonObj.subaction == "timeout"){
                                        jsonObj.choice_index = "99";
                                    }
                                    quiz.getQuizJudgment(socket.user, socket.quiz_score, jsonObj.quiz_index,
                                        jsonObj.choice_index, function(judgment, reward_point){
                                        _log("Judgment : " + judgment + "  reward_point : " + reward_point);

                                        for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                            var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];

                                            if(userSocket){
                                                userSocket.write(_JSON_START + cmd_return.getMsg2Clients_getjudgment(userSocket.user, userSocket.quiz_score,
                                                    jsonObj.quiz_index, reward_point, jsonObj.choice_index, judgment, _OK) + _JSON_END);
                                            }
                                        }
                                    });

                                    if(nextGo(socket) == true){
                                        if(jsonObj.quiz_last == "false"){
                                            var nextQuizIndex = String(parseInt(jsonObj.quiz_index) + 1);

                                            for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                                var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];

                                                if(userSocket){
                                                    userSocket.write(_JSON_START + cmd_return.getMsg2Clients_playnext(userSocket.user, nextQuizIndex, _OK) + _JSON_END);
                                                    userSocket.user_cmd_in = false; //initialize command
                                                }
                                            }
                                        } else {
                                            for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                                var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];

                                                if(userSocket){
                                                    userSocket.write(_JSON_START + cmd_return.getMsg2Clients_playend(userSocket.user, _OK) + _JSON_END);
                                                    userSocket.user_cmd_in = false; //initialize command
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_playnext(socket.user, "", _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        }else {
                            ////not matched connection_id
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_playnext(socket.user,"", _UNKNOWN_CMD) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);
                        break;
                    }
                    case "playresult":{
                        if (socket.user.connection_id == jsonObj.connection_id){
                            if (jsonObj.ver == "1"){
                                socket.user_cmd_in = true;

                                var score_r = [];
                                for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                    var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];
                                    userSocket.quiz_score.connection_id = userSocket.user.connection_id;
                                    score_r.push(userSocket.quiz_score);
                                }
                                _log("score_r : " + JSON.stringify(score_r));
                                quiz.getQuizResult(score_r);

                                socket.write(_JSON_START + cmd_return.getMsg2Clients_playresult(socket.user, score_r, _OK) + _JSON_END);

                                if(nextGo(socket) == true){
                                    for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                                        var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];
                                        userSocket.user.goodclose = true;

                                        userSocket.end();
                                    }
                                }
                            } else {
                                socket.write(_JSON_START + cmd_return.getMsg2Clients_playresult(socket.user, "", _UNMATCHED_CMD_VER) + _JSON_END);
                            }
                        }else {
                            ////not matched connection_id
                            socket.write(_JSON_START + cmd_return.getMsg2Clients_playresult(socket.user,"", _UNKNOWN_CMD) + _JSON_END);
                            socket.end();
                        }

                        str = str.substr(end + CNT_JSON_START);
                        socket.buffer.len = socket.buffer.write(str, 0);
                        break;
                    }
                }

                time_to_exit = false;
            } else {  time_to_exit = true; } // if no json data found in buffer - then it is time to exit this loop
        } while ( !time_to_exit );
    }); // end of  socket.on 'data'

    socket.on('close', function(){  // we need to cut out closed socket from array of client socket connections
        var gametype_code = socket.user.gametype_code;
        var connection_id = socket.user.connection_id;
        var play_type = socket.user.play_type;
        var goodclose = socket.user.goodclose;
        var gameplaying = socket.user.gameplaying;
        var gamechannelindex = socket.user.gamechannelindex;

        if (goodclose == false){
            for(var i = 0, len = socket.user.gamechannel.length; i < len; i++ ){
                var userSocket = sockets[socket.user.gametype_code][socket.user.gamechannel[i]];
                if(userSocket) {
                    if(socket.user.connection_id !== userSocket.user.connection_id){
                        userSocket.write(_JSON_START + cmd_return.getMsg2Clients_exceptionClose(socket.user.id, gameplaying, _OK) + _JSON_END);
                    }
                }
            }
        }

        if  (!gametype_code || !sockets[gametype_code])
            return;

        _log(connection_id + " has been disconnected from channel " + gametype_code);

        game_channel.delete_gamechannel(play_type, gamechannelindex, connection_id);

        delete socket.user; //remove user data
        delete socket.quiz_score;
        delete sockets[gametype_code][connection_id]; //remove socket

        game_channel.print_game_channels_1on1();
    }); // end of socket.on 'close'
}); //  end of server.on 'connection'

if (cluster.isMaster) {
//    var numCPUs = 2;

    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();
        console.log('worker ' + worker.process.pid + ' fork');
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');

        cluster.fork();
    });

//    cluster.on('online', function(worker) {
//        console.log("Yes sir!, I'm going to work! " + worker.process.pid);
//    });

    cluster.on('listening', function(worker, address) {
        console.log("A worker is now connected to " + address.address + ":" + address.port);
    });
} else {
// Workers can share any TCP connection
//    server.on('listening', function(){ console.log('on ' + server.address().address +':'+ server.address().port); });
    server.on('listening', function(){ });
    server.listen(cfg.port);
}



