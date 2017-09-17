const promiseLimit = require('promise-limit')
const getCurrencies = require('./commands/getCurrencies')
const getHistoricalData = require('./commands/getHistoricalData')
const csv = require('./csv')

async function main () {
  console.log('Retrieving TOP 100 currencies list...')
  const currencies = await getCurrencies()
  console.log('List retrieved!', currencies.length)
  const jobs = createJobs(currencies, 4)
  await run(jobs)
}

function createJobs (currencies, limit) {
  const pl = promiseLimit(limit)
  return currencies.map(url => {
    return pl(() => {
      const name = getCurrencyName(url)
      return getHistoricalDataAndWrite(url, name)
    })
  })
}

function getCurrencyName (s) {
  const base = 'https://coinmarketcap.com/currencies/'
  return s.substring(base.length, s.length - 1)
}

async function getHistoricalDataAndWrite (currencyUrl, name) {
  const url = currencyUrl + 'historical-data'
  try {
    console.log('Getting historical data:', url, name)
    const data = await getHistoricalData(url)
    console.log('CryptoCoin ' + name + ' got ' + data.length + ' lines')
    const filename = await csv.writeTabularData(name, data)
    console.log('Csv data file was written', filename)
  } catch (err) {
    console.log('Failed to getHistoricalDataAndWrite:', url)
    console.log(err)
  }
}

function run (jobs) {
  return Promise
    .all(jobs)
    .then(results => {
      console.log()
      console.log('results:', results)
    })
    .catch(err => {
      console.log(err)
    })
}

main()

// Cancelation
