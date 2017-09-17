const fs = require('fs')
const path = require('path')

exports.writeTabularData = function (name, data, sep = '|') {
  return new Promise((resolve) => {
    const filename = path.join('data/', name + '.csv')
    const file = fs.createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf8'
    })
    data.forEach(row => {
      file.write(row.join(sep) + '\n')
    })
    file.end()
    resolve(filename)
  })
}
