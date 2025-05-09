const yellowLine = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255,255,255,0.2'
  }),
  stroke: new ol.style.Stroke({
    color: '#ffcc33',
    width: 2
  })
})

const icon = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 60],
    anchorOrigin: 'top-right',
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    offsetOrigin: 'top-right',
    scale: 0.5,
    opacity: 0.75,
    src: '../image/blueIcon.png'
  })
})

const text = new ol.style.Style({
  text: new ol.style.Text({
    offsetY: 10,
    font: 'normal 14px 微软雅黑',
    text: '北京',
    fill: new ol.style.Fill({ color: '#aa3300', }),
    stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })

  })
})

const label = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 60],
    anchorOrigin: 'top-right',
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    offsetOrigin: 'top-right',
    scale: 0.5,
    opacity: 0.75,
    src: '../image/blueIcon.png'
  }),
  text: new ol.style.Text({
    offsetY: 10,
    font: 'normal 14px 微软雅黑',
    text: '北京',
    fill: new ol.style.Fill({ color: '#aa3300', }),
    stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })

  })
})