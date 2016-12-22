const Web = require('./web')
const Runner = require('./runner')

function loadConfig() {
  let Config
  try {
    Config = require('./config')
  } catch(ex) {
    Config = require('./config-tmpl')
  }
  return Config
}

const Config = loadConfig()
const runner = new Runner(Config.deploy)
const web = Web.start(Config.web)

web.on('deploy', () => runner.deploy())
