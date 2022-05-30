const mongoose = require("mongoose")

const DeviceSchema = new mongoose.Schema({
    mac: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    connect: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model("Device", DeviceSchema)