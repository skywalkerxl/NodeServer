let fn_index = async function (ctx, next) {
    ctx.response.body = `Index`;
    await next();
};

module.exports = {
    "GET /index": fn_index
};