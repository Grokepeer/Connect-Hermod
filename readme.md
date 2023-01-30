# Connect-Hermod
### Hermod Store for Express-session

This extension of Node.js application that use express-session allows storage and operation of session on a Hermod In-Memory DB

Declaration:
Store: new HermodStore({ server: hostname })

Where "hostname" has to be changed with the correct hostname available to the node.js instance to connect to the Hermod server which must be available on port 2088