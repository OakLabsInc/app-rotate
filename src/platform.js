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

async function displayConfiguration (config, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })
  let display = await platform.display()
  //console.log('display config', config)
  display.Configure(config, cb)
}

async function touchConfiguration (config, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })
  let touch = await platform.touch()
  //console.log('touch config', config)

  touch.Configure(config, cb)
}

async function automaticGenerate (cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })
  let automatic = await platform.automatic()

  automatic.Generate(undefined, cb)
}

async function automaticStore (config, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let automatic = await platform.automatic()
  automatic.Store(config, cb)
}

async function listPlatformMethods () {
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })
  console.log('Platform methods:')
  Object.keys(platform).forEach(v => {
    console.log(`* ${v}`)
    Object.keys(platform[v].proto).forEach(v => {
      console.log(`  * ${v}`)
    })
    let upper = _.startCase(v).replace(/\s/g, '')
    if (platform[v].proto[upper]) {
      Object.keys(platform[v].proto[upper].service).forEach(v => {
        console.log(`    * ${v}`)
      })
    }
  })
}

module.exports.getDisplayInfo = getDisplayInfo
module.exports.getTouchInfo = getTouchInfo
module.exports.displayConfiguration = displayConfiguration
module.exports.touchConfiguration = touchConfiguration
module.exports.automaticGenerate = automaticGenerate
module.exports.automaticStore = automaticStore
module.exports.listPlatformMethods = listPlatformMethods
