// Connect-Hermod
// Copyright(c) 2022-2023 Matteo Minardi <contact@ybdrinks.com>
// AGPL Licensed

const http = require('http');

module.exports = function (session) {
    const Store = session.Store
    const noop = () => {}

    class HermodStore extends Store {
        constructor(options = {}) {
            super(options)
            if(!options.server) {
                throw new Error('[Connect-Hermod] A Hermod server must be provided')
            }

            this.server = options.server
        }

        // Gets session from SID
        get(sid, cb = noop) {
            console.log('[Connect-Hermod] GET request for SID: ' + sid)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/get',
                method: 'GET',
                headers: {
                    'Data-Key': sid
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
                        if(data == 'No key found') {
                            cb(null, null)
                        } else {
                            console.log('[Connect-Hermod] Couldn\'t parse JSON data from HTTP GET request')
                            cb(new Error('[Connect-Hermod] Invalid HTTP session body from DB'))
                        }
                    }
                })
            })

            req.on('error', (e) => {
                console.log('[Connect-Hermod] HTTP error on GET request')
                cb(e)
            })

            req.end()
        }

        // Destroys a session given a SID
        destroy(sid, cb = noop) {
            console.log('[Connect-Hermod] DEL request for SID: ' + sid)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/del',
                method: 'GET',
                headers: {
                    'Data-Key': sid,
                    'Del-Token': 'deltoken'
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    console.log('[Connect-Hermod] DEL session received: ' + data)

                    if (data == 'Record deleted' || data == 'No record to be deleted') {
                        cb(null)
                    } else {
                        cb(new Error('[Connect-Hermod] Could not delete the session, an error occured'))
                    }
                })
            })

            req.on('error', (e) => {
                console.log('[Connect-Hermod] HTTP error on DEL request')
                cb(e)
            })

            req.end()
        }

        // Sets a new session info given a session and an SID
        set(sid, ses, cb = noop) {
            console.log('[Connect-Hermod] SET request for SID: ' + sid + ', Session: ', + ses)

            const options = {
                hostname: this.server,
                port: 2088,
                path: '/set',
                method: 'GET',
                headers: {
                    'Data-Key': sid,
                    'Del-Token': 'deltoken',
                    'Content-Length': JSON.stringify(ses).length
                }
            }

            const req = http.request(options, (res) => {
                let data = ''

                res.on('data', (chunk) => {
                    data += chunk
                })                

                res.on('end', () => {
                    console.log('[Connect-Hermod] SET session received: ' + data)
                    
                    if(data == 'Record created successfully' || data == 'Record updated successfully') {
                        cb(null)
                    } else {
                        cb(new Error('[Connect-Hermod] Could\'n set a new value for the session, an error occured'))
                    }
                })
            })

            req.on('error', (e) => {
                console.log('[Connect-Hermod] HTTP error on SET request')
                cb(e)
            })

            req.write(JSON.stringify(ses))
            req.end()
        }
    }

    return HermodStore
}