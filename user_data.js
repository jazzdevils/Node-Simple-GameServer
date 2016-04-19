
exports.setUserData = function (JsonObj){
    var userdata = {};

    userdata.q_type = JsonObj.q_type; //1:入力, 2: OX quiz, 4: multiple choice
    userdata.q_category_id = JsonObj.q_category_id;    //id of question category 0:random 1:~
    userdata.q_subcategory_id = JsonObj.q_subcategory_id; //id of question subcategory 0:random 1:~

//    if (JsonObj.play_type == "0"){
//        //random
//        userdata.play_type = Math.floor (Math.random () * 3 ) + 1; //0:random, 1: 1on1, 2: 1on1on1, 3: 1on1on1on1 ...
//    } else{
    userdata.play_type = JsonObj.play_type; //0:random, 1: 1on1, 2: 1on1on1, 3: 1on1on1on1 ...
//    }
    userdata.gametype_code = JsonObj.q_type + ":" + JsonObj.q_category_id + ":" + JsonObj.q_subcategory_id;
    userdata.gamechannel = {}; //game channel for playing
    userdata.gamechannelhost = false;
    userdata.id = JsonObj.id;
    userdata.name = JsonObj.name;
    userdata.connection_id = JsonObj.connection_id;
    userdata.competition_count = JsonObj.competition_count;
    userdata.win_count = JsonObj.win_count;
    userdata.lost_count = JsonObj.lost_count;
    userdata.level_name = JsonObj.level_name;
    userdata.point = JsonObj.point;
    userdata.tie_count = JsonObj.tie_count;
    userdata.picture_url = JsonObj.picture_url;
    userdata.gameplaying = false;
    userdata.goodclose = false;

    userdata.quizdata = "";

    return userdata;
};