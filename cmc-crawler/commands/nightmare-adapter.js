const Nightmare = require('Nightmare')

// timeout in ms
const waitTimeout = 1000 * 30 // 30 seconds
const gotoTimeout = 1000 * 60 * 3 // 3 minutes
const loadTimeout = 1000 * 10 // 10 seconds
const executionTimeout = 1000 * 30 // 30 seconds

exports.newBrowser = function () {
  return Nightmare({
    show: true,
    waitTimeout,
    gotoTimeout,
    loadTimeout,
    executionTimeout
  })
}

// Extends Nightmare
// Nightmare.action('waitUrlChange', function (url, done) {
//   this.wait(url => {
//     return url !== location.href
//   }, url)
//   done()
// })
