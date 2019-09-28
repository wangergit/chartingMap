//全局变量
var map = null
var tiles //tileLayer
var overlayMaps = {}

/**
 * 初始化地图组件
 * @param {json} data 
 */
function initMap(){
    //创建地图组件
    map = new L.Map('map' ,{
        zoomControl: true ,//缩放控件
        attributionControl : false,//属性控件
        contextmenu: false,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'Center',
            callback: function(){}
        }],
        minZoom : 5,
        maxZoom : 19
    })
    // for(var i = 0  i < config.tiledLayers.length  i ++){
    //     new L.tileLayer(config.tiledLayers[i].pathOnLine1, {
    //         label : config.tiledLayers[i].label,
    //         maxZoom : config.tiledLayers[i].maxZoom,
    //         minZoom : config.tiledLayers[i].minZoom,
    //         errorTileUrl : config.errorTileUrl,
    //         visible : config.tiledLayers[i].visible
    //     }).addTo(map)
    //     tiles = new L.tileLayer(config.tiledLayers[i].pathOnLine, {
    //         maxZoom : config.tiledLayers[i].maxZoom,
    //         minZoom : config.tiledLayers[i].minZoom,
    //         errorTileUrl : config.errorTileUrl,
    //         visible : config.tiledLayers[i].visible
    //     }).addTo(map)
    // }
    map.setView(config.center, config.zoom)
    //scaleControl()
    getBusinessData()
    mousePositioControl()
    //clearEasyButton()
}

/**
 * 比例尺
 */
function scaleControl(){
    L.control.scale({
        imperial : false , 
        position : "bottom-left"
    }).addTo(map)
}

/**
 * 鼠标信息
 */
function mousePositioControl(){
    L.control.mousePosition({
        lngFirst : true,
        position : "bottomleft",
        numDigits : 6
    }).addTo(map) 
}

/**
 * 属性信息
 */
function attributionControl(){
    L.control.attribution({
        "prefix" : "<a href='" + config.attribute.link + "' title='" + config.attribute.title + "' target='_blank'>" + config.attribute.name + "</a>"
    }).addTo(map)
}

/**
 * 缩放到坐标
 * @param {*} x 
 * @param {*} y 
 * @param {*} zoom 
 */
function centerAndZoom(x,y,zoom){
    if(x && y && typeof(zoom) == "number"){
        map.setView([parseFloat(y),parseFloat(x)], parseInt(zoom))
        addPositionMarker(x,y)
    }else{
        var jd = $("#jd")[0].value
        var wd = $("#wd")[0].value
        var zoom = $("#zoom")[0].value
        if(jd && wd && zoom) {
        	map.setView([parseFloat(wd),parseFloat(jd)], parseInt(zoom))
            addPositionMarker(jd,wd)
        }else alert("请输入正确的经纬度及缩放比例")
    }
}

/**
 * 添加定位图标
 * @param {*} x 
 * @param {*} y 
 */
function addPositionMarker(x,y){
    plotLayer.clearLayers()
    var myIcon = L.icon({
        iconUrl: config.positionImg,
        iconSize : config.positionImgSize
    })
    L.marker(L.latLng(y, x), {
        icon : myIcon
    }).addTo(plotLayer).bindTooltip("坐标：" + x + "," + y)
}

/**
 * 加载业务数据
 */
function getBusinessData(){
    for(var i = 0 ; i < config.businessData.length ; i ++){
    	var tooltip = config.businessData[i].tooltip ? config.businessData[i].tooltip : []
        var geojsonOpts = {
            tableName : config.businessData[i].table,
            layerName : config.businessData[i].name,
            pointToLayer : function(feature, latlng) {

            },
            onEachFeature : function(feature,layer){
                // var str = ""
            	// for (var int = 0 int < tooltip.length int++) {
            	// 	str += (int > 0 ? "</br>" : "") + tooltip[int].name + (tooltip[int].name?":":"") + disposeString(feature.properties[tooltip[int].field])
                // }
                // layer.bindTooltip(str)
            },
            style : function (feature) {
                if(feature.properties.amenity == "project"){//区
                    return {
                        color: '#0000ff',
                        fillColor: '#0000ff',
                        fillOpacity: 0.3
                    }
                }else if(feature.properties.amenity == "section"){//分区
                    return {
                        color: '#0000ff',
                        fillColor: '#0000ff',
                        fillOpacity: 0.3
                    }
                }else if(feature.properties.amenity == "section"){//墓位

                }
            }
        }
        var url = mongoUrl + config.businessData[i].xhrUrl
        results = syncGetData(url)
        if(!results){
            console.log("获取" + config.businessData[i].name + "数据失败哦！")
            continue
        }
        results = exchangeData(JSON.parse(results),config.businessData[i].table,config.businessData[i].type)
        
        overlayMaps[config.businessData[i].table] = L.geoJson(results,geojsonOpts)
        if(config.zoom >= config.businessData[i].minZoom && config.zoom <=config.businessData[i].maxZoom){
            map.addLayer(overlayMaps[config.businessData[i].table])
        }
        overlayMaps[config.businessData[i].table].on('contextmenu',function(feature){
            
        })
        overlayMaps[config.businessData[i].table].on("click",function(feature){
            
        })
    }
    map.on("zoomend",function(e){
        handleMapZoom(e.target.getZoom())
    })
    var id = getQueryString("id")
    handlePosition(id)
}

/**
 * 同步抓取数据
 * @param {*} name 
 * @param {*} url 
 * @param {*} callback 
 */
function syncGetData(url,callback,type,params){
    var path = url ? url : ""
    var results = null
    if(path){
         $.ajaxSettings.async = false
         if(type == "POST"){
            $.post(path,params,function(data,status){
                if(status == "success"){
                    results = data.data ? data.data : data
                }
             })
         }else{
            $.get(path,function(data,status){
                if(status == "success"){
                    results = data.data ? data.data : data
                }
             })
         }
         $.ajaxSettings.async = true
    }
    callback && callback(results)
    return results
}

/**
 * 常用业务操作清除功能按钮
 */
function clearEasyButton(){
    L.easyButton("clearBtn", function (e) {
    	clearMap()
    }, '清除').addTo(map)
}

function clearMap(){

}

/**
 * 数据交换
 * @param {} params 
 */
function exchangeData(params,amenity,geoType){
    if(!params || !params.data || params.data.length == 0 || typeof(params.data) == "string") {return []}
    var results = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "",
        "timestamp": "",
        "features" : []
    }
    for(var i = 0 ; i < params.data.length ; i ++){
        if(amenity) params.data[i].properties.amenity = amenity
        if(geoType === "point"){
        	results.features.push({
                "type": "Feature",
                "id": params.data[i].id,
                "properties": params.data[i],
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        parseFloat(params.data[i].longtitude),
                        parseFloat(params.data[i].latitude)
                    ]
                }
            })
        }else if(geoType === "polygon"){
        	results.features.push({  
    			"type":"Feature",
                "id": params.data[i].id,
                "properties": params.data[i].properties,
    			"geometry": params.data[i].geometry
    		})
        }else if(geoType === "polyline"){
        	results.features.push({  
    			"type":"Feature",
                "id": params.data[i].id,
                "properties": params.data[i],
    			"geometry":{
    				"type":"LineString",
    				"coordinates":[
    				     JSON.parse(params.data[i].regionalScope).data
    				]
    			}
    		})
        }
    }
    return results
}

/**
 * 处理文本（未定义字符串处理）
 * @param text
 */
function disposeString(text){
	return text ? text : ""
}

/**
 * 根据区编号定位 
 * @param {*} id 
 */
function handlePosition(id){
    var url = mongoUrl + "find?table=project&key=properties.id&value=" + id + "&orderFiled="
    results = syncGetData(url)
    if(!results || !JSON.parse(results) || !JSON.parse(results).data || JSON.parse(results).data.length == 0){
        console.log("获取数据失败哦！")
        return
    }
    var coordinates = JSON.parse(results).data[0].geometry.coordinates
    for(var i = 0 ; i < coordinates.length ; i ++){
        for(var j = 0 ; j < coordinates[i].length ; j ++){
            coordinates[i][j].reverse()
        }
    }
    var polygon = L.polygon(coordinates, {color: 'red'})
    map.fitBounds(polygon.getBounds())
}

/**
 * 处理地图缩放控制图层显示隐藏
 * @param {*} zoom 
 */
function handleMapZoom(zoom){
    for(var i = 0 ; i < config.businessData.length ; i ++){
        if(zoom >= config.businessData[i].minZoom && zoom <=config.businessData[i].maxZoom){
            if(!map.hasLayer(overlayMaps[config.businessData[i].table])){
                map.eachLayer(function(layer){
                    map.removeLayer(layer)
                })
                map.addLayer(overlayMaps[config.businessData[i].table])
            }
            break;
        }
    }
}

function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)")
    var r = window.location.search.substr(1).match(reg)
    if(r!=null)return  unescape(r[2]); return null
}
