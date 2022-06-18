const express = require('express');
const favicon = require('express-favicon');
const compression = require('compression');
const path = require('path');
const port = process.env.PORT || 3005;
const app = express();
app.use(compression());
var options = {
    maxAge: '365d',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          // All of the project's HTML files end in .html
          res.setHeader('Cache-Control', 'no-cache');
        }
    }
}

app.use(favicon(__dirname + '/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build'), options));
// app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
    return res.send('pong');
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));  
});

app.listen(port,() => console.log(`App is running on ${port}`));