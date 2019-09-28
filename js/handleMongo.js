var mongoUrl = "http://39.105.39.37:8080/MongoDBManage/"//真实环境
var handleMongo = {
    /**
     *新增
        table 表类型
        geojson  标准geojson格式    必须带有属性关联信息
    */
    save : function(table,geojson,key,value,callback){
        geojson.properties.uuid = this.GenNonDuplicateID()
        let param = new URLSearchParams()
        param.append("table", table)
        param.append("key", key)
        param.append("value", value)
        param.append("save", JSON.stringify(geojson))
        axios.post(mongoUrl + "save",param).then(function (result) {
            if(result.data.data == "success"){
                console.log("mongoDB保存成功！")
                callback && callback(1)
            }else{
                console.log("mongoDB保存失败！")
                callback && callback(0)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },
        
    /**
     *更新空间范围
        table 表类型
        geojson  标准geojson格式    必须带有属性关联信息
    */
    update : function(table,geojson,callback){
        let param = new URLSearchParams()
        param.append("table", table)
        param.append("update", JSON.stringify(geojson))
        param.append("key", "properties.id")
        param.append("value", geojson.properties.id)
        axios.post(mongoUrl + "update",param).then(function (result) {
            if(result.data.data == "success"){
                console.log("mongoDB更新成功！")
                callback && callback(1)
            }else{
                console.log("mongoDB更新失败！")
                callback && callback(1)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },

    /**
     * 更新属性信息
        * table 表类型
        * key  字段   数组格式  a,b,c
        * value  字段值  数组格式  a,b,c
        * prototype 属性   对象格式
     */
    updatePrototype : function(table,key,value,prototype,callback){
        let param = new URLSearchParams()
        param.append("table", table)
        param.append("prototype", JSON.stringify(prototype))
        param.append("key", key)
        param.append("value", value)
        axios.post(mongoUrl + "updatePrototype",param).then(function (result) {
            if(result.data.data == "success"){
                console.log("mongoDB更新成功！")
                callback && callback(1)
            }else{
                console.log("mongoDB更新失败！")
                callback && callback(0)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },

    /**
     * 更新某一特定属性
        * @param t 表名称
        * @param rk 约束字段
        * @param rv 约束字段值
        * @param uk 更新字段
        * @param uv 更新字段值
     */
    updateAttribute : function(t, rk, rv, uk, uv,callback){
        axios.get(mongoUrl + "updateAttribute", {
        　　params: { 
                't': t,
                'rk': rk,
                'rv': rv,
                'uk': uk,
                'uv': uv
            }
        }).then(function (result) {
            callback && callback(result.data) 
        }).catch(function (error) {
            console.error(error)
            callback && callback(0)
        })
    },

    /**
     * 查询
        * table 表类型
        * orderFiled 排序字段
        * key  字段   数组格式  a,b,c
        * value  字段值  数组格式  a,b,c
        * callback 回调函数
     */
    find : function(table,orderFiled,key,value,callback){
        axios.get(mongoUrl + "find", {
        　　params: { 
                'table': table,
                'orderFiled': orderFiled,
                'key': key,
                'value': value
            }
        }).then(function (result) {
            callback && callback(result.data.data) 
        }).catch(function (error) {
            console.error(error)
            callback && callback(0)
        })
    },

    /**
     * 删除
        * table 表类型
        * key  字段   数组格式  a,b,c
        * value  字段值  数组格式  a,b,c
     */
    delete : function(table,key,value,callback){
        let param = new URLSearchParams()
        param.append("table", table)
        param.append("key",key)
        param.append("value", value)
        axios.post(mongoUrl + "delete",param).then(function (result) {
            if(result.data.data > 0){
                console.log("mongoDB删除成功！")
                callback && callback(1)
            }else{
                console.log("mongoDB删除失败！")
                callback && callback(0)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },

    /**
     * 包含删除
        * table 表类型
        * key  字段   数组格式  a,b,c
        * value  字段值  数组格式  a,b,c
     */
    deleteIn : function(table,key,value,callback){
        axios.get(mongoUrl + "deleteIn?table=" + table + "&key=" + key + "&value=" + value).then(function (result) {
            if(result.data.data > 0){
                console.log("mongoDB删除成功！")
                callback && callback(1)
            }else{
                console.log("mongoDB删除失败！")
                callback && callback(0)
            }
        }).catch(function (error) {
            console.error(error)
        })
    },

    /**
     * 查询最近点
        * table 表类型
        * x 经度
        * y 纬度
        * distance  距离（单位/米）
        * limit 返回最大记录数
        * callback 回调函数
     */
    near : function(table, x, y, distance, limit,callback){
        axios.get(mongoUrl + "near", {
        　　params: { 
                'table': table,
                'x': x,
                'y': y,
                "distance" : (distance ? distance : 500),
                "limit" :  (limit ? limit : 5)
            }
        }).then(function (result) {
            callback && callback(result.data.data) 
        }).catch(function (error) {
            console.error(error)
            callback && callback(0)
        })
    },

    GenNonDuplicateID : function(){
        return Math.random().toString(16)
    }
}
