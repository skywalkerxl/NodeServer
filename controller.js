const fs = require('fs');
let files = fs.readdirSync(`${__dirname}/controllers`);
// 处理每个js文件
for(let file of files){
    console.log(`process controller ${file} ...`);
}

let addMapping = function (router, mapping) {
    for(let url in mapping){
        if(!mapping.hasOwnProperty(url))
            return;
        if (url.startsWith("GET ")) {
            let path = url.substring(4);
            router.get(path, mapping[url]);
            urlLog(path);
        } else if (url.startsWith("POST ")) {
            let path = url.substring(5);
            router.post(path, mapping[url]);
            urlLog(path);
        } else if (url.startsWith("PUT ")) {
            let path = url.substring(4);
            router.put(path, mapping[url]);
            urlLog(path);
        } else if (url.startsWith("DELETE ")) {
            let path = url.substring(7);
            router.url(path, mapping[url]);
            urlLog(path);
        }
    }
};

let addController = function (router, dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f)=>{
        return f.endsWith('.js');
    }).forEach((f)=>{
        let mapping = require(`${__dirname}/${dir}/${f}`);
        addMapping(router, mapping);
    });
};

let urlLog = function (path) {
    console.log(`Process URL Mapping : ${path}`);
};

module.exports = function (dir) {
    let controllers_dir = dir || "controllers",
        router = require("koa-router")();

    addController(router, controllers_dir);
    return router.routes();
};