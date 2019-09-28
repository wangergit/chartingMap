var config = {
    "errorTileUrl" : "images/noTiled.png",
    "attribute" : {
        "name" : "2018@ienc",
        "title" : "北京恒济引航科技股份有限公司",
        "link" : "http://www.ienc.cn"
    },
    "center" : [39.947, 116.348],
    "zoom" : 10,
    "businessData" : [
        {
            "name" : "区",
            "table" : "project",
            "xhrUrl" : "find?table=project&orderFiled=",
            "type" : "polygon",
            "tooltip" : [
                {
                    "name" : "",
                    "field" : "projectName"
                }
            ],
            'minZoom' : 0 ,
            'maxZoom' : 12 
        },
        {
            "name" : "分区",
            "table" : "section",
            "xhrUrl" : "find?table=section&orderFiled=",
            "type" : "polygon",
            "tooltip" : [
                {
                
                }
            ],
            'minZoom' : 13 ,
            'maxZoom' : 16 
        }
    ],
    "tiledLayers" : [
        {
            "name" : "天地图",
            "attribute" : "",
            "img" : "images/0.png",
            "path" : "http://47.92.39.111:6902/tianditu/{z}/{x}/{y}.png",
            "pathOnLine" : "http://t1.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=174705aebfe31b79b3587279e211cb9a",
            "pathOnLine1" : "http://t1.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=174705aebfe31b79b3587279e211cb9a",
            "visible" : false,
            "label" : "天地图",
            "maxZoom" : 18,
            "minZoom" : 1
        }
    ],
}