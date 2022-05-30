const express = require('express')
const express_ws = require('express-ws')
const mongoose = require("mongoose")
const app = express()
const ep_wss = express_ws(app)

const port = 3000
const ip = require("./modules/scan.js")

let wss = ep_wss.getWss('/ws');
app.use(express.static('public'))

const devicesRouter = require('./routes/devices.js')
const remoteRouter = require('./routes/remote.js')

app.use(express.json())
mongoose.connect("mongodb://junsee:jun1412@127.0.0.1:27017/IoT?authSource=admin")
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err))

app.use("/devices", devicesRouter)
app.use("/ws", remoteRouter)

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`)
})