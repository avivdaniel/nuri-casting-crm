const {createProxyMiddleware} = require("http-proxy-middleware");

// Proxy for Israel data gov API
module.exports = app => {
    app.use(
        createProxyMiddleware('/banks', {
            target: 'https://data.gov.il',
            changeOrigin: true,
        })
    )
};