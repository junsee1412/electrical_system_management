const router = require("express").Router()
const axios = require("axios").default
const Evilscan = require("evilscan")

const Device = require("../models/Device.js")

router.get("/", async (req, res) => {
  try {
    const devices = await Device.find()
    res.status(200).json(devices)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/scan", (req, res) => {
  let device = []
  const options = {
    target: "192.168.1.0/24",
    port: "80",
  }
  const evilscan = new Evilscan(options)
  evilscan.on('result', (data) => {
    if (data.ip != '192.168.1.1') {
      device.push(data)
    }
  })

  evilscan.on('error', (err) => {
    throw new Error(data.toString())
  })

  evilscan.on('done', () => {
    res.json(device)
  })

  evilscan.run();
})

router.post("/add", async (req, res) => {
  const newDevice = await Device(req.body)
  try {
    const savedDevice = await newDevice.save()
    res.status(200).json(savedDevice)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/detai/:ip", (req, res) => {
  let ip = req.params.ip
  axios.get(`http://${ip}`)
  .then(response => {
    res.json(response.data)
  })
  .catch(err => {
    res.status(500).json(err)
  })
})

// cập nhật kết nối đến giữa switch vs device
router.put("/connect/:mac", async (req, res) => {
  try {
    let connects = req.body.connects

    const device = await Device.findOne({mac: req.params.mac})
    let oldCons = device.connect
    let newCons = []
    let rmCons = [] 
    
    for (con in connects) {
    
      const subDevice = await Device.findOne({mac: connects[con]})
      let subCon = subDevice.connect
    
      if (device.type != subDevice.type) {
    
        if (!subCon.find(element => element === req.params.mac)) {
    
          subCon.push(req.params.mac)
          const updatedSubDevice = await Device.findOneAndUpdate({mac: connects[con]}, {
            connect: subCon,
          })
        }
        newCons.push(connects[con])
      }
    }

    rmCons = oldCons.filter(x => !newCons.includes(x))
    for (con in rmCons) {
      const rmSubDevice = await Device.findOne({mac: rmCons[con]})
      let rmcon = rmSubDevice.connect.filter(x => ![req.params.mac].includes(x))
      await Device.findOneAndUpdate({mac: rmCons[con]}, {
        connect: rmcon,
      })
    }
    
    const updatedDevice = await Device.findOneAndUpdate({mac: req.params.mac}, {
      connect: newCons,
    },
    {
      new: true,
    })
    res.status(200).json(updatedDevice)
  
  } catch (err) {
    res.status(500).json(err)
  }
})

router.delete("/remove/:mac", async (req, res) => {
  try {
    
    let mac = req.params.mac
    const device = await Device.findOne({mac: mac})
    
    if(device) {
      device.delete()
      res.status(200).json("deleted!")
    } else {
      res.status(500).json("You can delete this device!")
    }
  
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router