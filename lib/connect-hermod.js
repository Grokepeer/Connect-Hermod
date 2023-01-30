// Connect-Hermod
// Copyright(c) 2022-2023 Matteo Minardi <info@ybdrinks.com>
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

            http.get(this.server + ':2088/get', (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })

                res.on('end', () => {
                    console.log("Get session received: " + JSON.parse(data))
                })
            })
        }

        // Destroys a session given a SID
        destroy(sid, cb) {
            let key = sid

            http.get(this.server + ':2088/destroy', (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })

                res.on('end', () => {
                    console.log("Destroy session received: " + JSON.parse(data))
                })
            })
        }

        // Sets a new session info given a session and an SID
        set(sid, session, cb) {
            let key = sid

            http.get(this.server + ':2088/set', (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })

                res.on('end', () => {
                    console.log("Set session received: " + JSON.parse(data))
                })
            })
        }
    }
}