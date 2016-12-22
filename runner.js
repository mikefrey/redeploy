const exec = require('child_process').exec
const EventEmitter = require('events')

class Run extends EventEmitter {

  constructor(dir, cmds) {
    super()
    this.dir = dir
    this.cmds = cmds
  }

  start() {
    this.next()
  }

  next() {
    const cmd = this.cmds.shift()
    if (!cmd) return this.emit('end')

    console.log(`Executing "${cmd}" in ${this.dir}`)

    exec(cmd, { cwd: this.dir, maxBuffer: 3*1024*1024 }, err => {
      if (err) return this.emit('error', err)
      this.next()
    })
  }
}

class Runner extends EventEmitter {

  constructor({dir, cmds}) {
    super()
    this.dir = dir
    this.cmds = cmds
    this.running = false
  }

  deploy() {
    if (this.running) return false

    const run = new Run(this.dir, this.cmds)
    run.once('end', () => {
      this.running = false
      this.emit('complete')
    })

    run.once('error', err => {
      console.error(err)
      this.emit('error', err)
    })

    this.running = true
    run.start()

    return true
  }

}

module.exports = Runner
