var express = require("express");
const config = require('./config.js');
var app = express();

app.set('port', config.SERVER_PORT);

app.use(express.static(__dirname + '/public/html'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.listen(app.get('port'), function () {
        console.log('Photo Sharing Application is running on port', app.get('port'));
    });
