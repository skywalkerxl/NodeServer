const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');

const app = new koa();

app.use(async (ctx, next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.uri}`);
    await next();
});

app.use(bodyParser());

app.use(controller());

app.listen(3000);
console.log(`Server is running at port 3000`);