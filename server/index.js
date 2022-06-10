const express = require('express')
const express_ws = require('express-ws')
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()
const ep_wss = express_ws(app)

const port = 3000
const ip = require("./modules/scan.js")

let wss = ep_wss.getWss('/ws');
app.use(cors())
app.use(express.static('public'))

const devicesRouter = require('./routes/devices.js')
const remoteRouter = require('./routes/remote.js')

app.use(express.json())
mongoose.connect("mongodb://junsee:jun1412@127.0.0.1:27017/IoT?authSource=admin")
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err))

app.use("/devices", devicesRouter)
app.use("/ws", remoteRouter)


const Device = require("./models/Device.js")
ep_wss.getWss().on('connection', async (ws, req) => {

  header = req.headers['sec-websocket-protocol']
  // console.log(`${header} connected !!`)

  let arrayHeader = header.split(', ')
  if (arrayHeader.length === 2) {
    try {
      const devices = await Device.find()
      ws.send(JSON.stringify(devices))
    } catch (error) {
      ws.send(error)
      console.log(error)
    }
  } 
  else {
    try {
      const device = await Device.findOne({mac: header})
      if (device) {
        ws.send(String(`${device.state ? 'ON' : 'OFF'}`))
      }
    } catch (error) {
      ws.close()
      console.log(error)
    }
  }
})



app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`)
})