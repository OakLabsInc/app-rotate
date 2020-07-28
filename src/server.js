
const debug = process.env.NODE_ENV !== 'production'

const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
const tools = require('oak-tools')

oak.catchErrors()

const express = require('express')
const stylus = require('stylus')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9000
const platform = require(join(__dirname, 'platform'))

const logger = tools.logger({
  level: debug ? 'debug' : 'info',
  pretty: debug
})

let publicPath = join(__dirname, 'public')
let viewsPath = join(__dirname, 'views')

let window = null

console.log(process.versions)
app.set('views', viewsPath)
app.set('view engine', 'pug')
app.use(stylus.middleware({
  src: viewsPath,
  dest: publicPath
}))
app.use(express.static(publicPath))

app.listen(port, function () {
  oak.on('ready', () => loadWindow())
})

app.get('/', function (req, res) {
  res.render('index')
})

// accept the api call from angular and return the available displays
app.get('/display/available', function (req, res) {
  platform.getDisplayInfo(function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
      console.log("display available: ", results)
    }
  })
})

app.get('/touch/available', function (req, res) {
  platform.getTouchInfo(function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
      console.log("touch available: ", results)
    }
  })
})

app.get('/rotate/display', function (req, res) {
  let display = JSON.parse(req.query.display)
  
  if (_.has(display, 'display_id') && display.display_id !== '') {
    console.log('/rotate/display::', display)
    platform.displayConfiguration(display, function (err, results) {
      if (err) {
        res.status(404).send()
      } else {
        res.json(results)
      }
    })
  }
})

app.get('/rotate/touch', function (req, res) {
  let touch = JSON.parse(req.query.touch)
  
  if (_.has(touch, 'touch_device_id') && touch.touch_device_id !== '') {
    console.log('/rotate/touch::', touch)
    platform.touchConfiguration(touch, function (err, results) {
      if (err) {
        res.status(404).send()
      } else {
        res.json(results)
        console.log("touch results: ", results)
      }
    })
  }
})
app.get('/automatic/generate', function (req, res) {
  platform.listPlatformMethods()
  platform.automaticGenerate(function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
      console.log('automaticGenerate', results)
      platform.automaticStore(results, function (err, res) {
        console.log('automaticStore', res)
      })
    }
  })
})

function loadWindow () {
  logger.info({
    message: `Started on port ${port}`
  })
  window = oak.load({
    url: `http://localhost:${port}/`,
    ontop: false,
    insecure: true,
    flags: ['enable-vp8-alpha-playback'],
    sslExceptions: ['localhost'],
    background: '#ffffff',
    scripts: [
      {
        name: 'lodash',
        path: 'lodash'
      },
      {
        name: 'uuid',
        path: 'uuid'
      },
      join(__dirname, '..', 'node_modules', 'angular'),
      join(__dirname, '..', 'node_modules', 'angular-animate'),
      join(__dirname, '..', 'node_modules', 'angular-aria'),
      join(__dirname, '..', 'node_modules', 'angular-messages'),
      join(__dirname, '..', 'node_modules', 'angular-material'),
      join(__dirname, 'public', 'index.js')
    ]
  }).on('ready', function () {
      if (debug) {
        window.debug()
      }
    })
    .on('log.*', function (props) {
      logger[this.event.replace('log.', '')](props)
    })
}
