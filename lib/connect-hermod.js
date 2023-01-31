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
                throw new Error('A Hermod server must be provided')
            }

            this.server = options.server
        }

        // Gets session from SID
        get(sid, cb) {
            console.log('[Connect-Hermod] Get request for SID: ' + sid)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/get',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': sid.length,
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    console.log('[Connect-Hermod] Get session received: ' + JSON.parse(data))
                    cb(null)
                })
            })

            req.on('error', (e) => {
                console.log('[Connection-Hermod] Https error on Get request')
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
                    'Content-Type': 'application/json',
                    'Content-Length': sid.length,
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    console.log('[Connect-Hermod] Destroy session received: ' + JSON.parse(data))
                    cb(null)
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

            console.log('[Connect-Hermod] Set request for SID: ' + sid + ', Session: ', + ses)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/set',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(reqdata).length,
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    console.log('[Connect-Hermod] Set session received: ' + JSON.parse(data))
                    cb(null)
                })
            })

            req.on('error', (e) => {
                console.log('[Connection-Hermod] Https error on Set request')
                cb(e)
            })

            req.write(JSON.parse(reqdata))
            req.end()
        }
    }

    return HermodStore
}