require('@babel/polyfill')
const EventEmitter = require('events')

class addAtAddressInstance extends EventEmitter {
  async command (address, isValidFormat, isValidChecksum) {
    await this.api.perform(async () => {
      await addInstance(this.api, address, isValidFormat, isValidChecksum);
      await this.emit('complete');
    })
    return this
  }
}

async function addInstance (browser, address, isValidFormat, isValidChecksum, callback) {
  await browser.clickLaunchIcon('udapp').clearValue('.ataddressinput').setValue('.ataddressinput', address);
  await browser.click('button[id^="runAndDeployAtAdressButton"]');
  await browser.execute(()=>{
    var ret = document.querySelector('div[class^="modal-body"] div').innerHTML
    document.querySelector('#modal-footer-ok').click()
    return ret
  }, [], async result => {
    if (!isValidFormat) {
      await browser.assert.equal(result.value, 'Invalid address.')
    } else if (!isValidChecksum) {
      await browser.assert.equal(result.value, 'Invalid checksum address.')
    }
    if(callback) callback()
    return;
  })
}

module.exports = addAtAddressInstance
