const Netmask = require('netmask').Netmask;
const socketio = require('socket.io-client');
const ZwiftPacketMonitor = require('@zwfthcks/zwift-packet-monitor');
const internalIp = require('internal-ip');
const net = require('net');
const Socket = net.Socket;

const minDistance = 3;
let lastDistance = 0;
let lastAltitude = 0;
let currentIncline = 0;
let lastIncline = 0;
let lastChange = 0;

Array.prototype.asyncFilter = async function(f) {
	const array = this;
	const booleans = await Promise.all(array.map(f));
	return array.filter((x, i) => booleans[i]);
}

async function run() {

	console.log('Scanning your network for Zwifit...');
	const ips = [];
	const myIP = internalIp.v4.sync();
	const block = new Netmask(myIP + '/24');
	block.forEach((ip) => ips.push(ip));

	const tests = await Promise.all(ips
			.map(ip => testPortConnectable(ip, 1337)));
	const clients = tests
			.filter(test => test.result)
			.map(test => socketio(`http://${test.ip}:1337`));

	if (!clients || (clients.length === 0)) {
		console.log('Did not found Zwifit on any IP address of your local network running at port 1337 :-(');
		process.exit(1);
	} else {
		console.log('Found Zwifit at ', clients.map(client => client.io.uri));
	}

	console.log(`Tracking Zwift at ${myIP}...`);
	const monitor = new ZwiftPacketMonitor(myIP);
	monitor.on('outgoingPlayerState', (playerState, serverWorldTime) => {
		
			if (lastDistance && (playerState.distance > (lastDistance + minDistance))) {
				const angle = Math.asin((playerState.altitude - lastAltitude) / (200 * (playerState.distance - lastDistance)));
				const data = {
					zwiftIncline: Math.round(200 * Math.tan(angle)) / 2
				};
				const now = Date.now();
				if (data.zwiftIncline !== currentIncline) {
					if ((data.zwiftIncline !== lastIncline) // change incline if the delta is into the same direction (up or down)
							|| ((now - lastChange) > 7500)) {  // or, if it was up-down-up/down-up-down then only once in 7,5 seconds
						                                    // to avoid stressing the incline motor
						clients.forEach(client => client.emit('message', JSON.stringify({ event: 'control', data })));
						lastIncline = currentIncline;
						lastChange = now;
					}
					currentIncline = data.zwiftIncline;
				}
					
				lastAltitude = playerState.altitude;
				lastDistance = playerState.distance;
			} else if (!lastDistance || (playerState.distance < lastDistance)) {
				lastAltitude = playerState.altitude;
				lastDistance = playerState.distance;
			}
			
		});
	
	monitor.start();
	
}
run();

function testPortConnectable(ip, port) {
	
	return new Promise(resolve => {

		const socket = new Socket();
		let result = false;
	
		socket.on('connect', () => {
			result = true;
			socket.destroy();
		});
	
		socket.setTimeout(400);
		socket.on('timeout', () => {
			socket.destroy();
		});
		
		socket.on('error', (error) => {
		});
	
		socket.on('close', (exception) => {
			resolve({ ip, result });
		});
	
		socket.connect(port, ip);

	});
	
}
