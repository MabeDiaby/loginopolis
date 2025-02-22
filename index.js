const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post('/register', async (req, res, next) => {
  try {
    const SALT_COUNT = 10
    const {username, password} = req.body
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    const newUser = await User.create({
      username: username,
      password: hashedPassword
    })
    res.status(200).send(`successfully created user ${newUser.username}`)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body
    const findUser = await User.findOne({
      where: username
    })
    const isAMatch = await bcrypt.compare(findUser.password, hashedPassword)
    if (isAMatch === True) {
      res.status(200).send(`successfully logged in user ${findUser.username}`)
    } else if (isAMatch === False) {
      res.status(401).send('incorrect username or password')
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
