const childProcess = require('child_process')

function execSync(cmd, options) {
    const base = { stdio: 'inherit' }
    childProcess.execSync(cmd, Object.assign(base, options))
}

execSync('rm -rf ./dist')
execSync('npm run lint')
execSync('npm test')
execSync('npm run build')
execSync('cp package.json ./dist')
execSync('npm publish', { cwd: 'dist' })
