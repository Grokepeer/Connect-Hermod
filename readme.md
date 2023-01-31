# Connect-Hermod
### Hermod Store for Express-session

This extension of Node.js application that use express-session allows storage and operation of session on a Hermod In-Memory DB

### Install using:

```
npm i connect-hermod
```

### How to set up:

```
// Requiring package  
const session = require("express-session")
const HermodStore = require("connect-hermod")(session)

// Session setup  
app.use(session({
  secret: 'aye',
  resave: false,
  store: new HermodStore({ server: *hostname* })
  saveUninitialized: true,
  cookie: { secure: true }
}))
```

Where *hostname* has to be changed to the correct hostname available to the node.js instance to connect to the Hermod server which must be available on port 2088

### Implemented functions:

- *prototype*.get(sid, callback)
- *prototype*.set(sid, session, callback)
- *prototype*.destroy(sid, callback)