module.exports = {
  web: {
    host: 'localhost' || process.env.HOST,
    port: 8887 || process.env.PORT
  },
  deploy: {
    dir: __dirname || process.env.DEPLOY_DIR,
    cmds: [
      // `git pull`,
      `git status`,
      'npm install',
      // `pm2 restart ${process.env.APP_NAME}`
    ]
  }
}
