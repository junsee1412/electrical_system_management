const router = require("express").Router()
const express_ws = require('express-ws')
express_ws(router)

const Device = require("../models/Device.js")

let map = new Map()

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue) {
            return key;
        }
    }
}

router.ws("/", (ws, req) => {
    // console.log(req.headers['sec-websocket-protocol'])
    // console.log('--------------------------------')
    map.set(req.headers['sec-websocket-protocol'], ws)
    // device_state.set(req.headers['sec-websocket-protocol'], '')
    
    ws.on("message", async (msg) => {
        try {
            let arrayMSG = msg.split(" ")
            let mapDev = new Map()
            let arrayDEV = []

            if (arrayMSG.length == 2) {
                const devices = await Device.find()
                for(i in devices) {
                    mapDev.set(devices[i].mac, devices[i].connect)
                }

                const device = await Device.findOne({mac: arrayMSG[0]})
                if (device) {
                    const searchConn = (macCon) => {
                        if(!arrayDEV.includes(macCon)) {
                            arrayDEV.push(macCon)
                            valMapDev = mapDev.get(macCon)
                            valMapDev.forEach(e => {
                                searchConn(e)
                            })                            
                        }
                    }
                    searchConn(device.mac)

                    for(i in arrayDEV) {
                        let state = new Boolean()
                        if (arrayMSG[1] === 'ON') {
                            state = true
                        } else {
                            state = false
                        }

                        await Device.findOneAndUpdate({mac: arrayDEV[i]}, {state: state})
                    }

                    map.forEach((value, key) => {

                        if (arrayDEV.includes(key)) {
                            value.send(arrayMSG[1])
                        }
                    })
                }
                if (map.get('web')) {
                    const devices = await Device.find()
                    map.get('web').send(JSON.stringify(devices))
                }
            } else {
                console.log(msg)
            }
        } catch (err) {
            console.log(err)
        }
    })

    ws.on("close", (event) => {
        let key = getByValue(map, ws)
        map.delete(key)
        console.log('The connection has been closed successfully.')
    })
})


module.exports = router