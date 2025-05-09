# 一. 概述

地图编辑的核心在于对要素进行编辑(增删改查)

要素主要包括

- 点要素: 地图上的一个点, 通常用来表示某一个地物, 如天安门广场, 中地数码...
- 线要素: 地图上的一个线段, 通常用来表示河流, 街道, 铁路...
- 面要素: 地图上的一个区域, 通常用来表示居民区, 工业园区, 商场...

中地的MapGIS中要素有两方面的信息

1. 几何.颜色，线，面（坐标）
2. 样式. 颜色, 图例, 大小（几何的颜色，线的颜色，面的颜色，宽度，填充）
3. 属性. 对要素的描述

# 二. 基于坐标的添加操作

## 1 添加点要素

### 1) 步骤

1. 通过MapGIS创建点要素地图文档
2. 通过ServerManager发布
3. 通过web显示
4. 调用中地接口
   1. 中地几何信息
   2. 中地图形信息
   3. 中地属性信息
   4. 根据(几何信息+图形信息+属性信息)构成要素
   5. 创建要素集, 将新创建的要素添加到要素集中
   6. 创建地图编辑服务

### 2) 相关接口

![image-20210815112304469](http://image.brojie.cn/image-20210815112304469.png)

### 3) 处理数据

使用MapGIS处理数据

#### 创建GDB

GDB: (地理信息数据库)

![image-20210823092152215](http://image.brojie.cn/image-20210823092152215.png)

![image-20210823092250343](http://image.brojie.cn/image-20210823092250343.png)

![image-20210823092329070](http://image.brojie.cn/image-20210823092329070.png)

![image-20210823092405045](http://image.brojie.cn/image-20210823092405045.png)

![image-20210823092442216](http://image.brojie.cn/image-20210823092442216.png)

#### 创建要素类

![image-20210823093132111](http://image.brojie.cn/image-20210823093132111.png)

![image-20210823093213729](http://image.brojie.cn/image-20210823093213729.png)

![image-20210823093409490](http://image.brojie.cn/image-20210823093409490.png)

![image-20210823093431699](http://image.brojie.cn/image-20210823093431699.png)

![image-20210823093450749](http://image.brojie.cn/image-20210823093450749.png)

#### 绘制一个点

![image-20210823093852257](http://image.brojie.cn/image-20210823093852257.png)

![image-20210823094436515](http://image.brojie.cn/image-20210823094436515.png)

### 4) 发布数据

使用server manager发布数据

![image-20210823094515144](http://image.brojie.cn/image-20210823094515144.png)

![image-20210823094620106](http://image.brojie.cn/image-20210823094620106.png)

![image-20210823094659478](http://image.brojie.cn/image-20210823094659478.png)

![image-20210823100423366](http://image.brojie.cn/image-20210823100423366.png)

### 5) 显示数据

通过调用js的SDK显示数据

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <button onclick="addPoint()">添加点</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'point', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function addPoint() {
        //创建一个点形状，描述点形状的几何信息
        var gpoint = new Zondy.Object.GPoint(0, 0)
        //设置当前点要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] })
        //设置点要素的图形信息
        var pointInfo = new Zondy.Object.CPointInfo({
          Angle: 0,
          Color: 7,
          SymHeight: 20,
          SymID: 110,
          SymWidth: 20,
        })
        //设置当前点要素的图形参数信息
        var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 1,
          PntInfo: pointInfo,
        })
        //设置添加点要素的属性信息
        var attValue = ['1', 'xiaoming']
        //创建一个要素
        var feature = new Zondy.Object.Feature({
          fGeom: fGeom,
          GraphicInfo: webGraphicInfo,
          AttValue: attValue,
        })
        //设置要素为点要素
        feature.setFType(1)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        featureSet.clear()
        //设置属性结构
        var cAttStruct = new Zondy.Object.CAttStruct({
          FldName: ['id', 'name'],
          FldNumber: 2,
          FldType: ['string', 'string'],
        })
        featureSet.AttStruct = cAttStruct
        //添加要素到要素数据集
        featureSet.addFeature(feature)
        //创建一个编辑服务类
        var editService = new Zondy.Service.EditDocFeature('point', 0, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        //执行添加点要素功能
        editService.add(featureSet, onPntSuccess)
      }
      //添加点要素回调函数
      function onPntSuccess(data) {
        if (data.succeed) {
          alert('添加点要素成功！')
          //图层刷新方法
          docLayer.refresh()
          // map.removeLayer(docLayer)
          // map.addLayer(docLayer)
        } else {
          alert('添加点要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 2 添加线要素

### 1) 步骤

1. 通过MapGIS创建线要素地图文档
2. 通过ServerManager发布
3. 通过web显示

### 2) 创建线要素类

![image-20210823112652790](http://image.brojie.cn/image-20210823112652790.png)

![image-20210823112719895](http://image.brojie.cn/image-20210823112719895.png)

![image-20210823112914756](http://image.brojie.cn/image-20210823112914756.png)

![image-20210823112935692](http://image.brojie.cn/image-20210823112935692.png)

### 3) 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <button onclick="addLine()">添加线</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'Line', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function addLine() {
        //构成线要素的点
        var pointObj = new Array()
        pointObj[0] = new Zondy.Object.Point2D(0, 30)
        pointObj[1] = new Zondy.Object.Point2D(0, 0)
        //构成折线的弧段
        var gArc = new Zondy.Object.Arc(pointObj)
        //构成线的折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc])
        //设置线要素的几何信息
        var gline = new Zondy.Object.GLine(gAnyLine)
        //设置要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] })
        //设置添加线要素的图形参数信息
        var clineInfo = new Zondy.Object.CLineInfo({
          Color: 7,
          LinStyleID: 0,
          LinStyleID2: 18,
          LinWidth: 0.05,
          Xscale: 10,
          Yscale: 10,
        })
        //设置要素的图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 2,
          LinInfo: clineInfo,
        })
        //设置添加点要素的属性信息
        var attValue = ['京九线', '200']
        //创建一个要素
        var feature = new Zondy.Object.Feature({
          fGeom: fGeom,
          GraphicInfo: graphicInfo,
          AttValue: attValue,
        })
        //设置要素为线要素
        feature.setFType(2)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()

        //设置属性结构
        var cAttStruct = new Zondy.Object.CAttStruct({
          FldName: ['name', 'length'],
          FldNumber: 2,
          FldType: ['string', 'string'],
        })
        featureSet.AttStruct = cAttStruct
        //添加要素到要素数据集
        featureSet.addFeature(feature)
        //创建一个编辑服务类
        var editService = new Zondy.Service.EditDocFeature('Line', 0, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        //执行添加点要素功能
        editService.add(featureSet, onLineSuccess)
      }
      //添加点要素回调函数
      function onLineSuccess(data) {
        if (data.succeed) {
          alert('添加线要素成功！')
          //图层刷新方法
          docLayer.refresh()
          // map.removeLayer(docLayer)
          // map.addLayer(docLayer)
        } else {
          alert('添加线要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 3 添加区要素

### 1) 步骤

1. 通过MapGIS创建点要素地图文档
2. 通过ServerManager发布
3. 通过web显示

### 2) 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <button onclick="addPolygon()">添加区</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function addPolygon() {
        var pointObj = new Array()
        pointObj[0] = new Zondy.Object.Point2D(0, 0)
        pointObj[1] = new Zondy.Object.Point2D(-20, 0)
        pointObj[2] = new Zondy.Object.Point2D(-20, -20)
        pointObj[3] = new Zondy.Object.Point2D(0, -20)
        //设置区要素的几何信息
        var gArc = new Zondy.Object.Arc(pointObj)
        //构成区要素折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc])
        //构成区要素
        var gRegion = new Zondy.Object.GRegion([gAnyLine])
        //构成区要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ RegGeom: [gRegion] })
        //设置区要素的图形参数信息
        var cRegionInfo = new Zondy.Object.CRegionInfo({
          EndColor: 1,
          FillColor: 7,
          FillMode: 0,
          OutPenWidth: 1,
          OverMethod: 0,
          PatAngle: 1,
          PatColor: 1,
          PatHeight: 1,
          PatID: 27,
          PatWidth: 1,
        })
        //要素图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 3,
          RegInfo: cRegionInfo,
        })
        //设置区要素的属性信息
        var attValue = ['中地数码小区', '100', '200']
        //创建一个新的区要素
        var newFeature = new Zondy.Object.Feature({
          AttValue: attValue,
          fGeom: fGeom,
          GraphicInfo: graphicInfo,
        })
        newFeature.setFType(3)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        var cAttValue = new Zondy.Object.CAttStruct({
          FldNumber: 3,
          FldType: ['string', 'string'],
          FldName: ['name', 'num', 'area'],
        })
        featureSet.AttStruct = cAttValue
        featureSet.addFeature(newFeature)
        //创建一个要素编辑服务对象
        var editDocFeature = new Zondy.Service.EditDocFeature('beike', 0, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        editDocFeature.add(featureSet, onPloySuccess)
      }
      //添加区要素回调函数
      function onPloySuccess(data) {
        if (data.succeed) {
          alert('添加区要素成功！')
          docLayer.refresh()
        } else {
          alert('添加区要素失败！')
        }
      }
    </script>
  </body>
</html>

```

# 三. 手动删除操作

由于每一个要素都有一个OID, 也就是在mapGIS中不可编辑的属性

![image-20210822092102146](http://image.brojie.cn/image-20210822092102146.png)

1. 指定要删除的OID
2. 调用中地的地图编辑服务

> 示例

目前阶段, 我们暂时先通过mapGIS查询要删除的OID, 先把流程梳理清楚, 后续再通过交互式的查询得到OID

```js
//创建一个编辑服务类
var featureIds=“1”;
var deleteService = new Zondy.Service.EditDocFeature("beike", 2, 
{ 
  ip: "127.0.0.1",
  port: "6163" 
});
//执行删除要素操作
deleteService.deletes(featureIds, onPntSuccess);
```

## 1 删除点要素

通过手动输入OID的方式指定, 执行删除操作

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <input type="text" id="OID" />
    <button onclick="deletePoint()">删除点</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function deletePoint() {
        var deleteService = new Zondy.Service.EditDocFeature('beike', 2, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        deleteService.deletes(document.getElementById('OID').value, onSuccess)
      }

      //删除点要素回调函数
      function onSuccess(result) {
        // console.log(rlt)
        if (result) {
          alert('删除要素成功！')
          docLayer.refresh()
        } else {
          alert('删除要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 2 删除线要素

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <input type="text" id="OID" />
    <button onclick="deleteLine()">删除线</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function deleteLine() {
        var deleteService = new Zondy.Service.EditDocFeature('beike', 1, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        deleteService.deletes(document.getElementById('OID').value, onSuccess)
      }

      //删除点要素回调函数
      function onSuccess(result) {
        if (result) {
          alert('删除要素成功！')
          docLayer.refresh()
        } else {
          alert('删除要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 3 删除区要素

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <input type="text" id="OID" />
    <button onclick="deletePolygon()">删除区</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function deletePolygon() {
        var deleteService = new Zondy.Service.EditDocFeature('beike', 0, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        deleteService.deletes(document.getElementById('OID').value, onSuccess)
      }

      //删除点要素回调函数
      function onSuccess(result) {
        // console.log(rlt)
        if (result) {
          alert('删除要素成功！')
          docLayer.refresh()
        } else {
          alert('删除要素失败！')
        }
      }
    </script>
  </body>
</html>

```

# 四. 手动修改操作

修改操作跟添加操作类似, 在调用地图服务的修改接口时, 指定OID

1. 指定要修改的要素的OID(FID)
2. 指定要修改的要素的信息(几何信息坐标/样式/属性)

## 1 修改点要素

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <input type="text" id="OID" />
    <button onclick="updatePoint()">更新点</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function updatePoint() {
        //创建一个点形状，描述点形状的几何信息
        var gpoint = new Zondy.Object.GPoint(0, 0)
        var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] })
        //设置添加点要素的图形参数信息
        var pointInfo = new Zondy.Object.CPointInfo({
          Angle: 0,
          Color: 8,
          Space: 0,
          SymHeight: 20,
          SymID: 197,
          SymWidth: 20,
        })
        //设置当前点要素的图形参数信息
        var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 1,
          PntInfo: pointInfo,
        })
        //设置添加点要素的属性信息
        var attValue = ['修改后']
        //创建一个点要素
        var newFeature = new Zondy.Object.Feature({
          fGeom: fGeom,
          GraphicInfo: webGraphicInfo,
          AttValue: attValue,
        })
        //设置要素为点要素
        newFeature.setFType(1)
        //设置FID----被选中点的OID，可以在桌面端中查看
        newFeature.setFID(document.getElementById('OID').value)
        //创建一个点要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        //设置属性结构
        var cAttStruct = new Zondy.Object.CAttStruct({
          FldName: ['name'],
          FldNumber: 1,
          FldType: ['string'],
        })
        featureSet.AttStruct = cAttStruct
        //添加要素到要素数据集
        featureSet.addFeature(newFeature)
        //创建一个编辑服务类
        var editService = new Zondy.Service.EditDocFeature('beike', 2, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        editService.update(featureSet, onSuccess)
      }

      //删除点要素回调函数
      function onSuccess(result) {
        // console.log(rlt)
        if (result) {
          alert('更新要素成功！')
          docLayer.refresh()
        } else {
          alert('更新要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 2 修改线要素

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <input type="text" id="OID" />
    <button onclick="updateLine()">更新线</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      function updateLine() {
        //构成线要素的点
        var pointObj = new Array()
        pointObj[0] = new Zondy.Object.Point2D(0, 30)
        pointObj[1] = new Zondy.Object.Point2D(30, 0)
        //构成折线的弧段
        var gArc = new Zondy.Object.Arc(pointObj)
        //构成线的折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc])
        //设置线要素的几何信息
        var gline = new Zondy.Object.GLine(gAnyLine)
        //设置要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] })
        //设置添加线要素的图形参数信息
        var clineInfo = new Zondy.Object.CLineInfo({
          Color: 8,
          LinStyleID: 0,
          LinStyleID2: 38,
          LinWidth: 2,
          Xscale: 10,
          Yscale: 10,
        })
        //设置要素的图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 2,
          LinInfo: clineInfo,
        })
        //设置添加线要素的属性信息
        var attValue = ['京沪', '3000']
        //创建一个线要素
        var newFeature = new Zondy.Object.Feature({
          fGeom: fGeom,
          GraphicInfo: graphicInfo,
          AttValue: attValue,
        })
        //设置要素为线要素
        newFeature.setFType(2)
        //设置FID----被选中点的OID，可以在桌面端中查看
        newFeature.setFID(document.getElementById('OID').value)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        var fldNumber = 2
        var fldName = ['name', 'length']
        var fldType = ['string', 'string']
        //创建属性结构设置对象
        var cAttStruct = new Zondy.Object.CAttStruct({
          FldName: fldName,
          FldNumber: fldNumber,
          FldType: fldType,
        })
        //设置要素数据集的树形结构
        featureSet.AttStruct = cAttStruct
        //将添加的线要素添加到属性数据集中
        featureSet.addFeature(newFeature)
        //创建一个地图编辑对象
        var editDocFeature = new Zondy.Service.EditDocFeature('beike', 1, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        editDocFeature.update(featureSet, onSuccess)
      }

      //删除点要素回调函数
      function onSuccess(result) {
        // console.log(rlt)
        if (result) {
          alert('更新要素成功！')
          docLayer.refresh()
        } else {
          alert('更新要素失败！')
        }
      }
    </script>
  </body>
</html>

```

# 五. 交互式添加操作

## 1 交互式添加点

### 1) 步骤

1. 加载地图
2. 创建交互式点控件
3. 获取点坐标, 基于坐标调用中地的地图编辑服务

### 2) 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <button onclick="activePoint()">激活</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      //实例化一个矢量图层Vector作为绘制层
      let source = new ol.source.Vector({ wrapX: false })
      const layer = new ol.layer.Vector({
        source: source,
        style: null,
      })
      //将绘制层添加到地图容器中
      map.addLayer(layer)

      function activePoint() {
        const draw = new ol.interaction.Draw({
          source: source,
          type: 'Point',
        })
        draw.on('drawend', function (e) {
          const point = e.feature.getGeometry().getCoordinates()
          const arr = ['武汉']
          const struct = {
            FldName: ['name'],
            FldNumber: 1,
            FldType: ['string'],
          }
          addPoint(point, arr, struct)
        })
        map.addInteraction(draw)
      }

      function addPoint(point, attValue, cStruct) {
        //创建一个点形状，描述点形状的几何信息
        var gpoint = new Zondy.Object.GPoint(point[0], point[1])
        //设置当前点要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] })
        //设置点要素的图形信息
        var pointInfo = new Zondy.Object.CPointInfo({
          Angle: 0,
          Color: 7,
          SymHeight: 2,
          SymID: 1,
          SymWidth: 2,
        })
        //设置当前点要素的图形参数信息
        var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 1,
          PntInfo: pointInfo,
        })
        //设置添加点要素的属性信息
        //创建一个要素
        var feature = new Zondy.Object.Feature({
          fGeom: fGeom,
          GraphicInfo: webGraphicInfo,
          AttValue: attValue,
        })
        //设置要素为点要素
        feature.setFType(1)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        featureSet.clear()
        //设置属性结构
        var cAttStruct = new Zondy.Object.CAttStruct(cStruct)
        featureSet.AttStruct = cAttStruct
        //添加要素到要素数据集
        featureSet.addFeature(feature)
        //创建一个编辑服务类
        var editService = new Zondy.Service.EditDocFeature('beike', 2, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        //执行添加点要素功能
        editService.add(featureSet, onPntSuccess)
      }
      //添加点要素回调函数
      function onPntSuccess(data) {
        if (data.succeed) {
          alert('添加点要素成功！')
          //图层刷新方法
          docLayer.refresh()
          // map.removeLayer(docLayer)
          // map.addLayer(docLayer)
        } else {
          alert('添加点要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 2 交互式添加线

### 1) 步骤

1. 加载地图
2. 创建交互式线控件
3. 获取坐标, 基于坐标调用中地的地图编辑服务

### 2) 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <button onclick="activeLine()">激活</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      //实例化一个矢量图层Vector作为绘制层
      let source = new ol.source.Vector({ wrapX: false })
      const layer = new ol.layer.Vector({
        source: source,
        style: null,
      })
      //将绘制层添加到地图容器中
      map.addLayer(layer)

      function activeLine() {
        const draw = new ol.interaction.Draw({
          source: source,
          type: 'LineString',
        })
        draw.on('drawend', function (e) {
          const points = e.feature.getGeometry().getCoordinates()

          const arr = ['京广', '200']
          const struct = {
            FldName: ['name', 'length'],
            FldNumber: 2,
            FldType: ['string', 'string'],
          }
          addLine(points, arr, struct)
        })
        map.addInteraction(draw)
      }

      function addLine(points, attValue, cStruct) {
        //构成线要素的点
        var pointObj = new Array()

        for (let i in points) {
          pointObj.push(new Zondy.Object.Point2D(points[i][0], points[i][1]))
        }
        //构成折线的弧段
        var gArc = new Zondy.Object.Arc(pointObj)
        //构成线的折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc])
        //设置线要素的几何信息
        var gline = new Zondy.Object.GLine(gAnyLine)
        //设置要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] })
        //设置添加线要素的图形参数信息
        var clineInfo = new Zondy.Object.CLineInfo({
          Color: 7,
          LinStyleID: 0,
          LinStyleID2: 18,
          LinWidth: 0.05,
          Xscale: 10,
          Yscale: 10,
        })
        //设置要素的图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 2,
          LinInfo: clineInfo,
        })
        //设置添加点要素的属性信息

        //创建一个要素
        var feature = new Zondy.Object.Feature({
          fGeom: fGeom,
          GraphicInfo: graphicInfo,
          AttValue: attValue,
        })
        //设置要素为线要素
        feature.setFType(2)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()

        //设置属性结构
        var cAttStruct = new Zondy.Object.CAttStruct(cStruct)
        featureSet.AttStruct = cAttStruct
        //添加要素到要素数据集
        featureSet.addFeature(feature)
        //创建一个编辑服务类
        var editService = new Zondy.Service.EditDocFeature('beike', 1, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        //执行添加点要素功能
        editService.add(featureSet, onLineSuccess)
      }
      //添加点要素回调函数
      function onLineSuccess(data) {
        if (data.succeed) {
          alert('添加线要素成功！')
          //图层刷新方法
          docLayer.refresh()
          // map.removeLayer(docLayer)
          // map.addLayer(docLayer)
        } else {
          alert('添加线要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 3 交互式添加区

### 1) 步骤

1. 加载地图
2. 创建交互式区控件
3. 获取坐标, 基于坐标调用中地的地图编辑服务

### 2) 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./lib/include-openlayers-local.js"></script>
    <script src="./js/TianDiTu.js"></script>
  </head>
  <body>
    <button onclick="activePolygon()">激活</button>
    <div id="mapCon"></div>

    <script>
      const docLayer = new Zondy.Map.Doc('', 'beike', {
        ip: 'localhost',
        port: '6163',
      })
      const map = new ol.Map({
        target: 'mapCon',
        layers: [TiandiMap_vec, TiandiMap_cva, docLayer],
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326',
        }),
      })

      //实例化一个矢量图层Vector作为绘制层
      let source = new ol.source.Vector({ wrapX: false })
      const layer = new ol.layer.Vector({
        source: source,
        style: null,
      })
      //将绘制层添加到地图容器中
      map.addLayer(layer)

      function activePolygon() {
        const draw = new ol.interaction.Draw({
          source: source,
          type: 'Polygon',
        })
        draw.on('drawend', function (e) {
          const points = e.feature.getGeometry().getCoordinates()[0]

          const arr = ['小区', '200', '1200']
          const struct = {
            FldName: ['name', 'num', 'area'],
            FldNumber: 2,
            FldType: ['string', 'string', 'string'],
          }
          addPolygon(points, arr, struct)
        })
        map.addInteraction(draw)
      }

      function addPolygon(points, attValue, cStruct) {
        var pointObj = new Array()
        for (let i in points) {
          pointObj.push(new Zondy.Object.Point2D(points[i][0], points[i][1]))
        }
        //设置区要素的几何信息
        var gArc = new Zondy.Object.Arc(pointObj)
        //构成区要素折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc])
        //构成区要素
        var gRegion = new Zondy.Object.GRegion([gAnyLine])
        //构成区要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ RegGeom: [gRegion] })
        //设置区要素的图形参数信息
        var cRegionInfo = new Zondy.Object.CRegionInfo({
          EndColor: 1,
          FillColor: 7,
          FillMode: 0,
          OutPenWidth: 1,
          OverMethod: 0,
          PatAngle: 1,
          PatColor: 1,
          PatHeight: 1,
          PatID: 27,
          PatWidth: 1,
        })
        //要素图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({
          InfoType: 3,
          RegInfo: cRegionInfo,
        })
        //设置区要素的属性信息

        //创建一个新的区要素
        var newFeature = new Zondy.Object.Feature({
          AttValue: attValue,
          fGeom: fGeom,
          GraphicInfo: graphicInfo,
        })
        newFeature.setFType(3)
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet()
        var cAttValue = new Zondy.Object.CAttStruct(cStruct)
        featureSet.AttStruct = cAttValue
        featureSet.addFeature(newFeature)
        //创建一个要素编辑服务对象
        var editDocFeature = new Zondy.Service.EditDocFeature('beike', 0, {
          ip: 'localhost',
          port: '6163', //访问IGServer的端口号，.net版为6163，Java版为8089
        })
        editDocFeature.add(featureSet, onPloySuccess)
      }
      //添加区要素回调函数
      function onPloySuccess(data) {
        if (data.succeed) {
          alert('添加区要素成功！')
          docLayer.refresh()
        } else {
          alert('添加区要素失败！')
        }
      }
    </script>
  </body>
</html>

```

## 4 调试技巧

![image-20230823173358003](http://image.brojie.cn/image-20211228115316261.png)



![image-20230823173358004](http://image.brojie.cn/image-20211228115433038.png)

![image-20230823173358005](http://image.brojie.cn/image-20211228115625711.png)

## 作业

> 需求

1. 使用交互式点控件显示pop弹窗
2. 在弹窗中输入数据, 点击确定
3. 添加到GDB数据库中

> 思路

一. 加载地图

二. 创建交互式点控件

​	2.1 创建画布

​	2.2 创建画笔

​	2.3 激活交互式点控件

​	2.4 绘制完成的回调----显示pop弹窗

三. 实现pop弹窗

​	3.1 html结构+css样式

​	3.2 显示的pop弹窗: 包括一个输入框, 确定按钮

四. 按钮的点击事件处理函数

​	4.1 准备(点坐标+输入的数据+数据结构)

​	4.2 调用中地添加接口

​	4.3 隐藏pop弹窗



