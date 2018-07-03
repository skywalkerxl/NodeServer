let fn_index = function (ctx, next) {
    ctx.response.body = `Hello Index`;
};

module.exports = {
    "GET /index": fn_index
};