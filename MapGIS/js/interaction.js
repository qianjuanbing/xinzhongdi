/**
 * 根据类型创建画笔
 * @param {object} cource 数据源对象
 * @param {string} type 画笔类型
 * @param {function} callback (可选)
 * @returns {OfflineAudioCompletionEvent.interaction.Draw}
 */

function createDraw(source, type, callback) {
  let geometryFunction = null
  let maxPoints = 0

  const support = ['Point', 'LineString', 'Polygon', 'Circle', 'Square', 'Box']
  if (!support.includes(type)) {
    type = 'Point'
  }
  if (type == 'Square') {
    type = 'Circle'
    geometryFunction = ol.interaction.Draw.createRegularPolygon(4)
  } else if (type == 'Box') {
    type = 'LineString'
    geometryFunction = function (coordinates, geometry) {
      if (!geometry) {
        // 多边形
        geometry = new ol.geom.Polygon(null)
      }
      const start = coordinates[0]
      const end = coordinates[1]
      geometry.setCoordinates([[start, [start[0], end[1]], end, [end[0], start[1]], start]])
      return geometry
    },
      (maxPoints = 2)
  }
  const draw = new ol.interaction.Draw({
    source,
    type,
    geometryFunction,
    maxPoints
  })
  callback && draw.on('drawend', callback)
  return draw
}