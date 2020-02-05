require('@babel/polyfill')
const EventEmitter = require('events')
const deepequal = require('deep-equal')

class TestFunction extends EventEmitter {
  async command (fnFullName, txHash, log, expectedInput, expectedReturn, expectedEvent, callback) {
    await this.api.waitForElementPresent('.instance button[title="' + fnFullName + '"]');
    await this.api.perform(async (client, done) => {
      await client.execute(()=>{
        document.querySelector('#runTabView').scrollTop = document.querySelector('#runTabView').scrollHeight
      }, [], async () => {
        if (expectedInput) {
          await client.setValue('#runTabView input[title="' + expectedInput.types + '"]', expectedInput.values)
        }
      })
      done();
    });
    await this.api.click('.instance button[title="' + fnFullName + '"]');
    await this.api.pause(500);
    await this.api.waitForElementPresent('#main-panel div[class^="terminal"] span[id="tx' + txHash + '"]');
    await this.api.assert.containsText('#main-panel div[class^="terminal"] span[id="tx' + txHash + '"] span', log);
    await this.api.click('#main-panel div[class^="terminal"] span[id="tx' + txHash + '"] div[class^="log"]');
    await this.api.perform(async (client, done) => {
      if (expectedReturn) {
        const result = await client.getText('#main-panel div[class^="terminal"] span[id="tx' + txHash + '"] table[class^="txTable"] #decodedoutput');
        console.log(result)
        var equal = deepequal(JSON.parse(result.value), JSON.parse(expectedReturn))
        if (!equal) {
          await client.assert.fail('expected ' + expectedReturn + ' got ' + result.value, 'info about error', '')
        }
      }
      done();
    });
    await this.api.perform(async (client, done) => {
      if (expectedEvent) {
        const result = await client.getText('#main-panel div[class^="terminal"] span[id="tx' + txHash + '"] table[class^="txTable"] #logs');
        console.log(result)
        var equal = deepequal(JSON.parse(result.value), JSON.parse(expectedEvent))
        if (!equal) {
          await client.assert.fail('expected ' + expectedEvent + ' got ' + result.value, 'info about error', '')
        }
      }
      if (callback) {
        await callback.call(this.api);
      }
      await this.emit('complete');
      done();
    });
    return this
  }
}

module.exports = TestFunction
