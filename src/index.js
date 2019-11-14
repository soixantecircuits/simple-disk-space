const SpacebroClient = require('spacebro-client').SpacebroClient
var standardSettings = require('standard-settings')
var checkDiskSpace = require('check-disk-space')
var express = require('express')
var cors = require('cors')
var settings = standardSettings.getSettings()

var spacebroClient = new SpacebroClient()

var getDiskSpace = function () {
  return checkDiskSpace(settings.diskPath)
}

var start = async function () {
  spacebroClient.on(settings.service.spacebro.client.in.inMessage.eventName, data => {
    getDiskSpace()
  })

  const app = express()
  app.use(cors())
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    getDiskSpace().then((data) => res.send(data))
  })

  app.listen(settings.server.port, () => console.log('Started on port ' + settings.server.port))
}

start()
