# Connect-Hermod
### Hermod Store for Express-session

This extension of Node.js application that use express-session allows storage and operation of session on a Hermod In-Memory DB

### Install using:

npm i connect-hermod

### How to set up:

// Requiring package
const HermodStore = require("connect-hermod")

// Session setup
app.use(session({
  secret: 'aye',
  resave: false,
  store: new HermodStore({ server: *hostname* })
  saveUninitialized: true,
  cookie: { secure: true }
}))

Where *hostname* has to be changed to the correct hostname available to the node.js instance to connect to the Hermod server which must be available on port 2088