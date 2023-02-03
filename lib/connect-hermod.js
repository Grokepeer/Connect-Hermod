// Connect-Hermod
// Copyright(c) 2022-2023 Matteo Minardi <contact@ybdrinks.com>
// AGPL Licensed

const http = require('http');

module.exports = function (session) {
    const Store = session.Store

    class HermodStore extends Store {
        constructor(options = {}) {
            super(options)
            if(!options.server) {
                throw new Error('[Connect-Hermod] A Hermod server must be provided')
            }

            this.server = options.server
        }

        // Gets session from SID
        get(sid, cb) {
            console.log('[Connect-Hermod] GET request for SID: ' + sid)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/get',
                method: 'POST',
                headers: {
                    'Origin': 'CH',
                    'Content-Type': 'json',
                    'Content-Length': sid.length,
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    try {
                        let parsedata = JSON.parse(data)
                        console.log('[Connect-Hermod] GET session received: ' + parsedata)
                        cb(null, parsedata)
                    } catch (error) {
                        console.log('[Connect-Hermod] Couldn\'t parse JSON data from HTTP GET request')
                        cb(new Error('Invalid HTTP body from DB'))
                    }
                })
            })

            req.on('error', (e) => {
                console.log('[Connection-Hermod] HTTP error on GET request')
                cb(e)
            })

            req.write(sid)
            req.end()
        }

        // Destroys a session given a SID
        destroy(sid, cb) {
            console.log('[Connect-Hermod] Destroy request for SID: ' + sid)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/destroy',
                method: 'POST',
                headers: {
                    'Origin': 'CH',
                    'Content-Type': 'json',
                    'Content-Length': sid.length,
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    try {
                        let parsedata = JSON.parse(data)
                        console.log('[Connect-Hermod] Destroy session received: ' + parsedata)
                        cb(null)
                    } catch (error) {
                        console.log('[Connect-Hermod] Couldn\'t parse JSON data from HTTP Destroy request')
                        cb(new Error('Invalid HTTP body from DB'))
                    }
                })
            })

            req.on('error', (e) => {
                console.log('[Connection-Hermod] Https error on Destroy request')
                cb(e)
            })

            req.write(sid)
            req.end()
        }

        // Sets a new session info given a session and an SID
        set(sid, ses, cb) {
            let reqdata = {
                'sid': sid, 
                'session': ses
            }

            console.log('[Connect-Hermod] SET request for SID: ' + sid + ', Session: ', + ses)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/set',
                method: 'POST',
                headers: {
                    'Origin': 'CH',
                    'Content-Type': 'json',
                    'Content-Length': JSON.stringify(reqdata).length,
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    try {
                        let parsedata = JSON.parse(data)
                        console.log('[Connect-Hermod] SET session received: ' + parsedata)
                        cb(null)
                    } catch (error) {
                        console.log('[Connect-Hermod] Couldn\'t parse JSON data from HTTP SET request')
                        cb(new Error('Invalid HTTP body from DB'))
                    }
                })
            })

            req.on('error', (e) => {
                console.log('[Connection-Hermod] HTTP error on SET request')
                cb(e)
            })

            req.write(JSON.stringify(reqdata))
            req.end()
        }
    }

    return HermodStore
}