var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

//rl.on('line', function (cmd) {
//    console.log('You just typed: '+cmd);
//});
rl.setPrompt('Command> ');
rl.prompt();
//
rl.on('line', function(line) {
    switch(line.trim()) {
        case 'reboot':
            console.log('server reboot!');
            break;
        case 'close':
            rl.close();

            break;
        case 'start':
            var server_cluster = require('./server_cluster');
            server_cluster.start();
//            server_cluster.serverstart();
//            console.log('server start!');
//            rl.close();
//            process.stdin._destroy();
            break;
        default:
            console.log('Say what? I might have heard `' + line.trim() + '`');
            break;
    }
//    rl.prompt();
}).on('close', function() {
        console.log('Have a great day!');
        process.exit(0);
    });