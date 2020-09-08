var express = require('express');
var path = require('path');
var compression = require('compression');
var load = require('dotenv');
var cors = require('cors');
var DBConnection = require('./db/DBConnection');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

load.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var eventsRouter = require('./routes/events');
var pollsRouter = require('./routes/polls');
var loginRouter = require('./routes/login');
var amazonS3Router = require('./routes/amazonS3');
var homepageTabsRouter = require('./routes/homepageTabs');

var app = express();

app.set('env', 'production');

DBConnection(process.env.MONGODB_URL)
  .then(() => console.log('Connection ok'))
  .catch(error => console.log('Connection to MongoDB failed'));

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, '/build', 'static')));
app.use(cors());

app.use(function(errors, request, response, next) {
    response.json({errors: errors});
});

app.use('/', indexRouter);
app.use('/server/users', usersRouter);
app.use('/server/posts', postsRouter);
app.use('/server/events', eventsRouter);
app.use('/server/polls', pollsRouter);
app.use('/server/login', loginRouter);
app.use('/server/sign-s3', amazonS3Router);
app.use('/server/homepageTabs', homepageTabsRouter);

app.get('*', (request, response) => {response.sendFile(path.join(__dirname, '/build/index.html'))});

module.exports = app;
