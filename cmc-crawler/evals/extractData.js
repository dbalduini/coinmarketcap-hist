module.exports = function () {
  var data = [ [] ]
  var table = document.querySelector('table')
  var thead = table.querySelectorAll('thead tr th')
  var tbody = table.querySelectorAll('tbody tr')

  thead.forEach(function (th) {
    data[0].push(th.innerText)
  })

  var n = data[0].length
  tbody.forEach(function (tr) {
    var row = new Array(n)
    var td = tr.querySelectorAll('td')

    for (var i = 0; i < n; i++) {
      row[i] = td[i].innerText
    }
    data.push(row)
  })

  return data
}
