/**
 * @param nth - one-indexed column index
 */
module.exports = function (nth) {
  var result = []
  var selector = 'table tbody td:nth-child(' + nth + ') a'
  var cells = document.querySelectorAll(selector)
  cells.forEach(function (a) {
    result.push(a.href)
  })
  return result
}
