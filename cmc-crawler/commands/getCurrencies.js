const Nightmare = require('./nightmare-adapter')
const getTableColumn = require('../evals/getTableColumn')

// Return top 100 list of currencies
module.exports = function () {
  const nightmare = Nightmare.newBrowser()
  return nightmare
    .goto('https://coinmarketcap.com/currencies/')
    .wait('table')
    .evaluate(getTableColumn, 2)
    .end()
}
