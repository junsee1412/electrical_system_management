const router = require("express").Router()
const express_ws = require('express-ws')
express_ws(router)

const Device = require("../models/Device.js")

let map = new Map()
let device_state = new Map()

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
    device_state.set(req.headers['sec-websocket-protocol'], '')
    ws.on("open", (event) => {
        if (map.get("web")) {
            map.get("web").send(arrayDEV.join(" "))
        }
        console.log("Connected !!")
    })

    ws.on("message", async (msg) => {
        try {
            let arrayDEV = []
            let arrayDEV1 = []
            let arrayMSG = msg.split(" ")
            
            const device = await Device.findOne({mac: arrayMSG[0]})
            if (device) {

                for(subAddr in device.connect) {
                    const subDevice = await Device.findOne({mac: device.connect[subAddr]})
                    
                    arrayDEV = arrayDEV.concat(subDevice.connect, [device.connect[subAddr]])
                }
                
                map.forEach((value, key) => {
                    if (arrayDEV.includes(key)) {
                        value.send(arrayMSG[1])
                        device_state.set(key, arrayMSG[1])
                        arrayDEV1.push(key)
                    }
                });
            }
            arrayDEV1.push(arrayMSG[1])
            console.log(arrayDEV1)
            console.log(device_state)
            
            if (map.get("web")) {
                map.get("web").send(arrayDEV1.join(" "))
            }
        } catch (err) {
            console.log(err)
        }
    })

    ws.on("close", (event) => {
        let key = getByValue(map, ws)
        map.delete(key)
        device_state.delete(key)
        console.log('The connection has been closed successfully.')
    })
})


module.exports = router