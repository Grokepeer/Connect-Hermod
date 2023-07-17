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
  store: new HermodStore({ server: *hostname*, deltoken: *token*, dbname: *dbname* })
  saveUninitialized: false,
  cookie: { secure: true }
}))
```

Where:
- *hostname* has to be changed to the correct hostname available to the node.js instance to connect to the Hermod server which must be available on port 2088
- *token* must be the same that was set in the host configuration files
- *dbname is the name of the table that does or will hold all the sessions data in the Host

### Implemented functions

- *prototype*.get(sid, callback)
- *prototype*.set(sid, session, callback)
- *prototype*.destroy(sid, callback)