const fs = require('fs');
let files = fs.readdirSync(`${__dirname}/controllers`);
let addMapping;
let addController;
let urlLog;

// 处理每个js文件
for(let file of files){
    console.log(`process controller ${file} ...`);
}

addMapping = function (router, mapping) {
    for (let url of mapping) {
        if(url.startsWith("GET ")){
            let path = router.substring(4);
            router.get(path, mapping[url]);
            urlLog(path);
        }else if(url.startsWith("POST ")){
            let path = router.substring(5);
            router.post(path, mapping[url]);
            urlLog(path);
        }else if(url.startsWith("PUT ")){
            let path = router.substring(4);
            router.put(path, mapping[url]);
            urlLog(path);
        }else if(url.startsWith("DELETE ")){
            let path = router.substring(7);
            router.delete(path, mapping[url]);
            urlLog(path);
        }
    }
};

addController = function (router, dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f)=>{
        return f.endsWith('.js');
    }).forEach((f)=>{
        let mapping = `${__dirname}/dir/${f}`;
        addMapping(router, mapping);
    });
};

urlLog = function (path) {
    console.log(`Process URL Mapping : ${path}`);
};

module.exports = function (dir) {
    let
        controllers_dir = dir || "controllers",
        router = require("koa-router")();

    addController(router, controllers_dir);
    return router.routes();
};