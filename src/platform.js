const OakPlatform = require('@oaklabs/platform')
const _ = require('lodash')

async function getDisplayInfo (cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let display = await platform.display()

  display.Info(undefined, cb)
}
async function getTouchInfo (cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let touch = await platform.touch()

  touch.Info(undefined, cb)
}
async function displayConfiguration ( rotate, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let display = await platform.display()

  display.Configure(rotate.display, cb)
}

async function touchConfiguration ( rotate, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let touch = await platform.touch()

  touch.Configure(rotate.touch, cb)
}

module.exports.getDisplayInfo = getDisplayInfo
module.exports.getTouchInfo = getTouchInfo
module.exports.displayConfiguration = displayConfiguration
module.exports.touchConfiguration = touchConfiguration

