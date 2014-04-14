var connect = require('connect');
connect.createServer(
    connect.static('/Users/johnslater/dev/canjs/canjs1')
).listen(8080);
