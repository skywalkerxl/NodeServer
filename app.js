const fs = require('fs');
let files = fs.readdirSync(`${__dirname}/controllers`);

files.map((elt, i)=>{
    console.log(elt);
});

// 处理每个js文件
for(let file of files){
    console.log(`process controller ${file} ...`);
}

function addMapping(router, mapping) {

}