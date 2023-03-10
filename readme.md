# Connect-Hermod

### Hermod Store for Express-session

An extension for Node.js applications that allows storage of express-sessions on a Hermod In-Memory DBMS.

### Installation

```
npm i connect-hermod
```

### How to set up

```
// Requiring package  
const session = require("express-session")
const HermodStore = require("connect-hermod")(session)

// Session setup  
app.use(session({
  secret: 'aye',
  resave: false,
  store: new HermodStore({ server: *hostname* })
  saveUninitialized: false,
  cookie: { secure: true }
}))
```

Where *hostname* has to be changed to the correct hostname available to the node.js instance to connect to the Hermod server which must be available on port 2088

### Implemented functions

- *prototype*.get(sid, callback)
- *prototype*.set(sid, session, callback)
- *prototype*.destroy(sid, callback)