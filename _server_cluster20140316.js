const CNT_JSON_START = 15;
const CNT_JSON_END = 13;
const CNT_SUBSCRIBE = 13;
const CNT_ENDSUBSCRIBE = 16;

var dbexecute = require('./dbexecute');
//require('./dbpool');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
//var getTest = require('./DBSelect');

var server = require('net').createServer()
    , sockets = {}  // this is where we store all current client socket connections
    , cfg = {
        port: 5555,
        buffer_size: 1024*8, // buffer is allocated per each socket client
        log: true
    }
    , _log = function(){
        if (cfg.log) console.log.apply(console, arguments);
    };

// black magic
process.on('uncaughtException', function(err){
    _log('Exception: ' + err);
});

server.on('connection', function(socket) {
    socket.setNoDelay(true);
    socket.connection_id = require('crypto').createHash('sha1').update( 'noobhub'  + Date.now() + Math.random() ).digest('hex') ; // unique sha1 hash generation
    socket.channel = '';

    socket.win = 0;
    socket.buffer = new Buffer(cfg.buffer_size);
    socket.buffer.len = 0; // due to Buffer's nature we have to keep track of buffer contents ourself

    _log('New client: ' + socket.remoteAddress +':'+ socket.remotePort);

    socket.on('data', function(data_raw) { // data_raw is an instance of Buffer as well
        if (data_raw.length > (cfg.buffer_size - socket.buffer.len)) {
            _log("Message doesn't fit the buffer. Adjust the buffer size in configuration");
            socket.buffer.len = 0; // trimming buffer
            return false;
        }

        socket.buffer.len +=  data_raw.copy(socket.buffer, socket.buffer.len); // keeping track of how much data we have in buffer

        var str, start, end
            , conn_id = socket.connection_id;
        str = socket.buffer.slice(0,socket.buffer.len).toString();
        console.log(str);
        if ( (start = str.indexOf("__SUBSCRIBE__")) !=  -1   &&   (end = str.indexOf("__ENDSUBSCRIBE__"))  !=  -1) {
            socket.channel = str.substr( start + CNT_SUBSCRIBE,  end-(start + CNT_SUBSCRIBE) );
//            socket.write('welcome online. \r\n');
            _log("Client subscribes for channel: " + socket.channel);
            str = str.substr(end + CNT_ENDSUBSCRIBE);  // cut the message and remove the precedant part of the buffer since it can't be processed
            socket.buffer.len = socket.buffer.write(str, 0);
            sockets[socket.channel] = sockets[socket.channel] || {}; // hashmap of sockets  subscribed to the same channel
            sockets[socket.channel][conn_id] = socket;
        }

        var time_to_exit = true;
        do{  // this is for a case when several messages arrived in buffer
            if ( (start = str.indexOf("__JSON__START__")) !=  -1   &&  (end = str.indexOf("__JSON__END__"))  !=  -1 ) {
                var json = str.substr( start + CNT_JSON_START,  end-(start + CNT_JSON_START) );
//                _log("Client posts json:  " + json);

                //something do on command
                var jsonObj = JSON.parse(json);
                switch (jsonObj.action){
                    case "login":{
                        //something do
//                        console.log(dbexecute.getTestList());
                        _log("Login coming here");
//                        getTest.getTest();
                        var json_row;
                        dbexecute.getTestList(function(json_row){
                            console.log(json_row);
                        });

//                        str = str.substr(end + CNT_JSON_START);  // cut the message and remove the precedant part of the buffer since it can't be processed
//                        socket.buffer.len = socket.buffer.write(str, 0);
//                        for (var prop in sockets[socket.channel]) {
//                            if (sockets[socket.channel].hasOwnProperty(prop)) {
//                                sockets[socket.channel][prop].write("__JSON__START__" + res + "__JSON__END__");
//                            }
//                        }
                        break;
                    }
                    case "cmd"  :{
                        //something do
                        break;
                    }
                }

                str = str.substr(end + CNT_JSON_START);  // cut the message and remove the precedant part of the buffer since it can't be processed
                socket.buffer.len = socket.buffer.write(str, 0);
                for (var prop in sockets[socket.channel]) {
                    if (sockets[socket.channel].hasOwnProperty(prop)) {
                        sockets[socket.channel][prop].write("__JSON__START__" + json + "__JSON__END__");
                    }
                } // writing this message to all sockets with the same channel

                time_to_exit = false;
            } else {  time_to_exit = true; } // if no json data found in buffer - then it is time to exit this loop
        } while ( !time_to_exit );
    }); // end of  socket.on 'data'

    socket.on('close', function(){  // we need to cut out closed socket from array of client socket connections
        if  (!socket.channel   ||   !sockets[socket.channel])  return;
        delete sockets[socket.channel][socket.connection_id];
        _log(socket.connection_id + " has been disconnected from channel " + socket.channel);
    }); // end of socket.on 'close'

}); //  end of server.on 'connection'

if (cluster.isMaster) {
    // Fork workers.
//    numCPUs = 5;
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
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



