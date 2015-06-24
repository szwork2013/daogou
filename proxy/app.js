var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');

var proxy = require('./src/conf/config.js').proxy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../')));
app.use(function(req, res, next){

  if(req.originalUrl==='/'||req.originalUrl==='/index.html'){
    var indexoption={
      url:"http://"+req.headers.host+"/.tmp/serve/index.html",
      method: req.method,
      headers: req.headers,
      gzip: true
    };
    request(indexoption,function(error,response,body){
      console.log(indexoption)
      if (!error) {
        res.send(body);
      }else{
        res.send(error);
      }
    })
    return;
  }
  // console.log([1,req.originalUrl]);
  next();

});
app.use(express.static(path.join(__dirname, '../src')));
app.use(express.static(path.join(__dirname, '../.tmp/serve')));






// app.disable('etag');
// app.disable('x-powered-by');

app.all("*", function(req, res, next) {
  // req.headers["Cache-Control"]="no-cache, no-store, must-revalidate";
  // req.headers["Pragma"]="no-cache";
  // req.headers["Expires"]=0;
  // if(req.url.indexOf("/items/") === -1) return;

  //导购index.html代理



  //服务器代理
  var proxyOption = {
    url: proxy.protocol + "://" + proxy.hostname + ":" + proxy.port + req.originalUrl,
    method: req.method,
    headers: req.headers,
    gzip: true
  }

  request(proxyOption, function (error, response, body) {

  // console.log(proxyOption.)
  
  // if (!error && response.statusCode == 200) {
    if (!error) {

      res.set(response.headers);
      // res.setHeader('Access-Control-Allow-Origin', "*");
      // res.setHeader('Access-Control-Allow-Credentials', true);
      // res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
      if(response.statusCode == 200){
        res.send(body);
      }else{
        console.log(['接口调用不成功',response.statusCode,response.headers,body])
        res.sendStatus(response.statusCode);
      }


    } else {
      console.log(error)
      res.send("代理请求出错!");
    }
  })
})
// var proxy = http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('okay');
// });
//
// app.all("*", function(req, res, next) {
//   req.hostname = '10.200.187.58';
//   req.port = 9090;
//   console.log(req)
//
//   var proxy = http.request(req, function(response) {
//     console.log('STATUS: ' + res.statusCode);
//     console.log('HEADERS: ' + JSON.stringify(res.headers));
//     // res.setEncoding('utf8');
//     res.send(response);
//     proxy.end();
//   });
// })



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
