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
    state: {
        type: Boolean,
        default: false,
        required: true,
    },
    connect: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model("Device", DeviceSchema)