// Connect-Hermod
// Copyright(c) 2022-2023 Matteo Minardi <grokepeer@gmail.com>
// AGPL Licensed

const http = require('http');
const net = require('net');
const EventEmitter = require('events');

module.exports = function (session) {
    const Store = session.Store
    const noop = () => {}

    // Initializing event emitter instances
    var eventEmitter = new EventEmitter();

    class HermodStore extends Store {
        constructor(options = {}) {
            super(options)
            if(!options.server || !options.dbname) {
                throw new Error('[Connect-Hermod] A Hermod server and dbname must be provided')
            }

            this.server = options.server
            this.dbname = options.dbname
            this.apiver = "0.4."

            //Establishing connection to the Host
            var host = new net.Socket();
            this.socket = host.connect(2088, this.server, function() {
                host.write('auth: ' + options.deltoken + '\u{4}')
            })

            var welmsg = ""
            var buff = ""
            this.socket.on('data', data => {
                const dataparse = data.toString()
                const datalen = dataparse.length
                // console.log("[Connect-Hermod] " + data + "\n\n> " + dataparse.slice(datalen - 1))

                if(welmsg == "") {
                    welmsg = dataparse;
                    if(welmsg.slice(42, 46) != this.apiver) {
                        throw new Error('[Connect-Hermod] Non-matching Hermod API version, try and update the Host and the Client')
                    }
                    return
                }

                buff = buff + dataparse
                if(dataparse.slice(datalen - 1) == '\u{17}') {
                    // console.log("yes")
                    const bufflen = buff.length
                    eventEmitter.emit('DataReceived', {data: buff.slice(0, bufflen - 20), code: buff.slice(bufflen - 5, bufflen - 2)})
                    buff = ""
                }
            })
        }

        // Gets session from SID
        get(sid, cb = noop) {
            console.log('[Connect-Hermod] GET request for SID: ' + sid)

            this.socket.write('get ' + sid + ' from ' + this.dbname + '\u{4}', function() {
                eventEmitter.prependOnceListener('DataReceived', function(pkg) {
                    try {
                        var tmp = pkg.data
                        // console.log('cb-ed this: -' + tmp + '-')
                        cb(null, JSON.parse(tmp))
                    } catch (error) {
                        console.log('[Connect-Hermod] Impossible JSON.parse on GET request: ' + error)
                        cb(null, null)
                    }
                })
            })
        }

        // Destroys a session given a SID
        destroy(sid, cb = noop) {
            console.log('[Connect-Hermod] DEL request for SID: ' + sid)

            this.socket.write('del ' + sid + ' from ' + this.dbname + '\u{4}')
        }

        // Sets a new session info given a session and an SID
        set(sid, ses, cb = noop) {
            console.log('[Connect-Hermod] SET request for SID: ' + sid + ', Session: ' + ses)

            this.socket.write('set ' + sid + ' in ' + this.dbname + ' to ' + JSON.stringify(ses) + '\u{4}', function() {
                eventEmitter.prependOnceListener('DataReceived', function(pkg) {
                    // console.log('cb-ed code: ' + pkg.code)
                    cb(null)
                })
            })
        }
    }

    return HermodStore
}