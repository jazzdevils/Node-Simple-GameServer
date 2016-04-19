//var shortid = require("shortid");

var game_channels_1on1 = [];
var game_channels_1on1on1 = [];
var game_channels_1on1on1on1 = [];

exports.delete_gamechannel = function (play_type, gamechannelindex, connection_id){
    switch(play_type){
        case "1": {
//            console.log("delete game channel game index : " + gamechannelindex);
            var gc = game_channels_1on1[gamechannelindex];
            if(gc){
                for (var i = 0, len = gc.length; i< len; i++){
                    if(gc[i] == connection_id){
                        gc.splice(i, 1);
                    }
                }
                if(gc.length == 0){
                    game_channels_1on1.splice(gamechannelindex, 1);
//                    console.log("gc.length == 0");
                }
            } else {
                game_channels_1on1.splice(gamechannelindex, 1);
//                console.log("gc.length == Null")
            }
            break;
        }
//        case "2": {
//            for (var i = 0, len = game_channels_1on1on1.length; i< len; i++){
//                if (game_channels_1on1on1[i].length == 0){
//                    game_channels_1on1on1.splice(game_channels_1on1on1[i], 1);
//                }
//            }
//            break;
//        }
//        case "3": {
//            for (var i = 0, len = game_channels_1on1on1on1.length; i< len; i++){
//                if (game_channels_1on1on1on1[i].length == 0){
//                    game_channels_1on1on1on1.splice(game_channels_1on1on1on1[i], 1);
//                }
//            }
//            break;
//        }
    }
};

exports.print_game_channels_1on1 = function(){
    console.log("game_channels_1on1 : " + game_channels_1on1);
//    console.log("game_channels_1on1on1 : " + game_channels_1on1on1);
//    console.log("game_channels_1on1on1on1 : " + game_channels_1on1on1on1);
};

exports.get_gamechannel = function (sockets, user, callBack){
    var gamechannel = [];
    var isMatched = "false";

    switch (user.play_type){
        case "1":{
            //1on1
            for (var i = 0, len = game_channels_1on1.length; i< len; i++){
                if (game_channels_1on1[i].length == 1){
                    var userSocket = sockets[user.gametype_code][game_channels_1on1[i]];
                    if(userSocket){
                        if(userSocket.user.gameplaying == false){
                            game_channels_1on1[i].push(user.connection_id);

                            user.gamechannelindex = i;    //the index of game channel

                            isMatched = "true";
                            callBack(isMatched);
                            return game_channels_1on1[i];
                        }
                    } else {
                        game_channels_1on1.splice(i, 1);
//                        console.log("!userSocket : " + userSocket);
                    }
                }
            }

            callBack(isMatched);
            user.gamechannelhost = true;  //game channel host
            gamechannel.push(user.connection_id);
            game_channels_1on1.push(gamechannel);
            user.gamechannelindex = game_channels_1on1.length - 1;     //the index of game channel

            break;
        }
        case "2":{
            //1on1on1
//            for (var i = 0, len = game_channels_1on1on1.length; i< len; i++){
//                if (game_channels_1on1on1[i].length == 2){
//                    console.log("game channel 1on1on1 matched")
//                    game_channels_1on1on1[i].push(connection_id);
//
//                    isMatched = "true";
//                    callBack(isMatched);
//                    return game_channels_1on1on1[i];
//                }
//            }
//            var inserted = "false";
//            for (var i = 0, len = game_channels_1on1on1.length; i< len; i++){
//                if (game_channels_1on1on1[i].length == 1){
//                    game_channels_1on1on1[i].push(connection_id);
//                    inserted = "true";
//                    console.log("game channel 1on1on1 inserted")
//
//                    break;
//                }
//            }
//
//            if (inserted = "false"){
//                callBack(isMatched);
//                gamechannel.push(connection_id);
//                game_channels_1on1on1.push(gamechannel) ;
//            }

            break;
        }
        case "3":{
            //1on1on1on1

            break;
        }
    }

    return gamechannel;
};