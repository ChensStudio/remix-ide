/* global postMessage addEventListener eval */
'use strict'
let ethers = require('ethers')
// let Web3 = require('web3')
let swarmgw = require('swarmgw')()
// let CommandInterpreterAPI = require('./cmdInterpreterAPI')
let web3 = null
let remix = null
// import solc from 'solc/wrapper'

// 'DedicatedWorkerGlobalScope' object (the Worker global scope) is accessible through the self keyword
// 'dom' and 'webworker' library files can't be included together https://github.com/microsoft/TypeScript/issues/20595

let console = {}
console.log = function () {
  postMessage({
    cmd: 'log',
    data: arguments
  })
}

console.info = function () {
  postMessage({
    cmd: 'info',
    data: arguments
  })
}

console.warn = function () {
  postMessage({
    cmd: 'warn',
    data: arguments
  })
}

console.error = function () {
  postMessage({
    cmd: 'error',
    data: arguments
  })
}

addEventListener('message', (e) => {
  const data = e.data
  switch (data.cmd) {
    case 'execute':
      // web3 = new Web3(self.executionContext.web3().currentProvider)
      eval(data.script)
      break
  }
}, false)

