const Evilscan = require('evilscan');

exports.scanIp = (result) => {
    let ips = []
    const options = {
        target:'192.168.1.0/24',
        port:'80',
    };

    new Evilscan(options, (err, scan) => {

        if (err) {
            console.log(err);
            return;
        }
    
        scan.on('result', data => {
            if (data.ip != "192.168.1.1") {
                ips.push(data)
            }
        });
    
        scan.on('error', err => {
            throw new Error(data.toString());
        });
    
        scan.on('done', () => {
            result(ips)
        });
    
        scan.run();
    });
}