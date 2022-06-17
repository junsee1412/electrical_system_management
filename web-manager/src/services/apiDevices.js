import API from "./API"

export default{
    getList() {
        return API().get('/devices')
    },
    scanDevices(con) {
        return API().get('/devices/scan', {params: {con: con}})
    },
    addDevices(data) {
        return API().post('/devices/add', data)
    },
    updateConnect(mac, connect) {
        return API().put(`/devices/connect/${mac}`, {connects: connect})
    },
    deleteDevices(mac) {
        return API().delete(`/devices/remove/${mac}`)
    },
}