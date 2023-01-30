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
            let key = sid

            console.log("[Connect-Hermod] Get request for SID: " + sid)
            http.get('http://' + this.server + ':2088/get', (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })

                res.on('error', (e) => {
                    console.log("[Connection-Hermod] Https error on Get request")
                    cb(e)
                })

                res.on('end', () => {
                    console.log("[Connect-Hermod] Get session received: " + JSON.parse(data))
                })

                cb(null)
            })
        }

        // Destroys a session given a SID
        destroy(sid, cb) {
            let key = sid

            console.log("[Connect-Hermod] Destroy request for SID: " + sid)
            http.get('http://' + this.server + ':2088/destroy', (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })

                res.on('error', (e) => {
                    console.log("[Connection-Hermod] Https error on Destroy request")
                    cb(e)
                })

                res.on('end', () => {
                    console.log("[Connect-Hermod] Destroy session received: " + JSON.parse(data))
                })

                cb(null)
            })
        }

        // Sets a new session info given a session and an SID
        set(sid, ses, cb) {
            let key = sid

            console.log("[Connect-Hermod] Set request for SID: " + sid + ", Session: ", + ses)
            http.get('http://' + this.server + ':2088/set', (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })

                res.on('error', (e) => {
                    console.log("[Connection-Hermod] Https error on Set request")
                    cb(e)
                })

                res.on('end', () => {
                    console.log("[Connect-Hermod] Set session received: " + JSON.parse(data))
                })

                cb(null)
            })
        }
    }

    return HermodStore
}