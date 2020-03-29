# zwifit-incline-tracker

Zwift does not send any "set incline" commands to a treadmill. If you wish to adapt your treadmills incline automatically to the gain shown in your current Zwift session and you are using [Zwifit](https://github.com/dawsontoth/zwifit) to connect your treadmill to Zwift then you can use this software
for that purpose.

# Safety and claims

The treadmills' incline mechanism is driven by a powerful engine. To incline or to decline opens and closes air gaps around your treadmill. It is possible to hurt yourself or a person nearby or damage anything getting into such an air gap. To avoid any injury do not start this software and leave your treadmill alone! I take no responsibility for any injury or damage caused by changing the incline according to your current Zwift session by this software.

*Hint:* Updates to the incline of the treadmill are only processed by Zwifit if your treadmill is in the active
state. If there is a problem then pause the treadmill or simply pull the safety key.

# Usage

## Prerequisites

This software uses the module [zwift-packet-monitor](https://www.npmjs.com/package/@zwfthcks/zwift-packet-monitor)
to track status updates from Zwift. It is based on the pcap-library which has to be installed first:

* On Windows this use [WinPcap](https://www.winpcap.org/), [Win10PCap](http://www.win10pcap.org/) or [Npcap](https://nmap.org/npcap/).
* On MacOS the pcap-library is installed by default.
* On Linux systems install libpcap e.g. [Raspberry Pi](https://zoomadmin.com/HowToInstall/UbuntuPackage/libpcap-dev).

## Installation

*This software needs to run on the same computer as your Zwift is running!*

Run this commands to install the software:

```bash
git clone https://github.com/RasPelikan/zwifit-incline-tracker.git
cd zwifit-incline-tracker
npm install
```

## Running

Once installed you have to start the software evertime you start your Zwift run session. Therefor go to the installation directory and use this command:

```bash
npm start
```

On Linux and MacOS you will have to run

```bash
sudo npm start
```

*This will only succeed if you have already started Zwifit before!*

## Hints

1. On startup the software tries to find Zwifit in your local network. If it is running but could not be found then retry starting.
