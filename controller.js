const fs = require('fs');
let files = fs.readdirSync(`${__dirname}/controllers`);
// 处理每个js文件
for(let file of files){
    console.log(`process controller ${file} ...`);
}

let Chain = function (fn){
    this.fn = fn;
    this.successor = null;
};

Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor;
};

Chain.prototype.passRequest = function(){
  let ret = this.fn.apply(this, arguments);
  if(ret === "nextSuccessor"){
      return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};

let addMapping = function (router, mapping) {
    for(let url in mapping){
        if(!mapping.hasOwnProperty(url))
            return;
        chainUrlHandlerGet.passRequest(url, mapping, router);
    }
};

let addController = function (router, dir) {

    fs.readdirSync(__dirname + '/' + dir).filter(
            /**
             * @param f {string}
             * @returns {boolean}
             */
            (f)=>{
                return f.endsWith('.js');
            }
        ).forEach((f)=>{
        let mapping = require(`${__dirname}/${dir}/${f}`);
        addMapping(router, mapping);
    });
};
// get方法路由
let urlHandlerGet = function(url, mapping, router){
    if(url.startsWith("GET ")){
        let path = url.substring(4);
        router.get(path, mapping[url]);
        urlLog(path);
    }else{
        return 'nextSuccessor';
    }
};
// post方法路由
let urlHandlerPost = function(url, mapping, router){
    if(url.startsWith("POST ")){
        let path = url.substring(5);
        router.post(path, mapping[url]);
        urlLog(path);
    }else{
        return 'nextSuccessor';  // 不清楚下一个节点是谁，将请求扔下下一个节点
    }
};
// put方法路由
let urlHandlerPut = function(url, mapping, router){
    if(url.startsWith("PUT")){
        let path= url.substring(4);
        router.put(path, mapping[url]);
        urlLog(path);
    }else{
        return 'nextSuccessor';
    }
};
// delete方法路由
let urlHandlerDelete = function(url, mapping, router){
    if(url.startsWith("DELETE ")){
        let path = url.substring(7);
        router.delete(path, mapping[url]);
        urlLog(path);
    }else{
        return 'nextSuccessor';
    }
};

let urlLog = function (path) {
    console.log(`Process URL Mapping : ${path}`);
};

let chainUrlHandlerGet = new Chain(urlHandlerGet);
let chainUrlHandlerPost = new Chain(urlHandlerPost);
let chainUrlHandlerPut = new Chain(urlHandlerPut);
let chainUrlHandlerDelete = new Chain(urlHandlerDelete);

chainUrlHandlerGet.setNextSuccessor(chainUrlHandlerPost);
chainUrlHandlerPost.setNextSuccessor(chainUrlHandlerPut);
chainUrlHandlerPut.setNextSuccessor(chainUrlHandlerDelete);

module.exports = function (dir) {
    let controllers_dir = dir || "controllers",
        router = require("koa-router")();
    addController(router, controllers_dir);
    return router.routes();
};