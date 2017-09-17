const Nightmare = require('./nightmare-adapter')
const extractData = require('../evals/extractData')

module.exports = function (url) {
  const nightmare = Nightmare.newBrowser()
  return nightmare
    .goto(url)
    .wait('.daterangepicker')
    .click('[data-range-key="All Time"]')
    .wait(1000 * 5)
    .wait('table')
    .evaluate(extractData)
    .end()
}
