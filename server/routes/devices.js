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

router.get("/scan", async (req, res) => {
  let con = req.query.con
  const inDB = await Device.find()
  let macInDB = []
  for (i in inDB) {
    macInDB.push(inDB[i].mac)
  }
  let device = []
  
  const options = {
    target: "192.168.1.0/24",
    port: "80",
  }
  const evilscan = await new Evilscan(options)
  await evilscan.on('result', (data) => {
    if (data.ip != '192.168.1.1') {
      device.push(data)
    }
  })

  evilscan.on('error', (err) => {
    throw new Error(data.toString())
  })

  await evilscan.on('done', async () => {
    let result = []
    for (i in device) {
      let ip = device[i].ip
      await axios.get(`http://${ip}`)
      .then(response => {
        if (!macInDB.includes(response.data.mac) && con != "true") {
          result.push(response.data)
        } 
        if (macInDB.includes(response.data.mac) && con === "true") {
          result.push(response.data)
        }
      })
      .catch(err => {
        if (con === "true") {
          result.push(err)
        }
      })
    }
    res.status(200).json(result)
  })

  evilscan.run();
})

router.post("/add", async (req, res) => {
  try {
    const newDevice = await Device(req.body)
    const savedDevice = await newDevice.save()
    res.status(200).json(savedDevice)
  } catch (err) {
    res.status(500).json(err)
  }
})

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
      let con = device.connect
      for (i in con) {
        const subConDel = await Device.findOne({mac: con[i]})
        let subCon = subConDel.connect.filter(x => x != mac)
        await Device.findOneAndUpdate({mac: con[i]}, {connect: subCon})
      }
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