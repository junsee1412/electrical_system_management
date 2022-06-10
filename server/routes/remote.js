const router = require("express").Router()
const express_ws = require('express-ws')
express_ws(router)

const Device = require("../models/Device.js")

let map = new Map()
let webcl = []

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue) {
            return key;
        }
    }
}

router.ws("/", (ws, req) => {
    let header = req.headers['sec-websocket-protocol'].split(', ')
    if (header.length === 2) {
        let key = header.join('_')
        webcl.push(key)
        map.set(key, ws)
    } else {
        map.set(header.toString(), ws)
    }
    
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
                        try {
                            if (arrayDEV.includes(key)) {
                                value.send(arrayMSG[1])
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    })
                }
                const afterUpdate = await Device.find()
                for (i in webcl) {
                    try {
                        map.get(webcl[i]).send(JSON.stringify(afterUpdate))
                    } catch (error) {
                        console.log(error)
                    }
                }
            } else {
                console.log(msg)
            }
        } catch (err) {
            console.log(err)
        }
    })

    ws.on("close", () => {
        let key = getByValue(map, ws)
        let index = webcl.indexOf(key)
        if (index !== -1) {
            webcl.splice(index, 1)
        }
        map.delete(key)
        console.log(`The ${key} has been closed successfully.`)
    })
})


module.exports = router