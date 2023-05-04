'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// count connections
const countConnect  = () => {
    const numOfConnection = mongoose.connections.length;
    console.log('Num of connections: ', numOfConnection)
}

// check overload
const checkOverload = () =>{
    setInterval(() => {
        const numOfConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsed = process.memoryUsage().rss;
        // ex: maximum number of connections based on number osf cores
        const maxConnections = numCores * 5;

        console.log(`Active connections:: ${numOfConnection}`)
        console.log(`Memory usage:: ${memoryUsed / 1024 / 1024} MB`)

        if(numOfConnection > maxConnections) {
            console.log('Connections is overloaded');
        }

    }, _SECONDS); // monitor every _SECONDS 
}

module.exports = {
    countConnect,
    checkOverload
}