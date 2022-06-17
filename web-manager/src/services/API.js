import axios from "axios"
const ip = '192.168.1.252'
export default(url=`http://${ip}:3000`) => {
    return axios.create({
        baseURL: url,
    })
}