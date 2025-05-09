const key = '11dce887d8c343629fe8efcf0c60caec'

const TiandiMap_vec = new ol.layer.Tile({
  title: '天地图矢量图层',
  source: new ol.source.XYZ({
    url:
      'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + key, //parent.TiandituKey()为天地图密钥,
    wrapX: false, // 在横向不重复
  }),
})

const TiandiMap_cva = new ol.layer.Tile({
  title: '天地图矢量注记图层',
  source: new ol.source.XYZ({
    url:
      'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + key,
    wrapX: false,
  }),
})

const TiandiMap_img = new ol.layer.Tile({
  title: '天地图影像图层',
  source: new ol.source.XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + key,
    wrapX: false,
  })
})

const TiandiMap_cia = new ol.layer.Tile({
  title: '天地图影像注记图层',
  source: new ol.source.XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + key,
    wrapX: false,
  })
})