const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/userManagement';
const port = process.env.PORT || 3000;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(userRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((result) => {
    app.listen(port);
    console.log('connected');
  })
  .catch((err) => {
    console.log(err);
  });
