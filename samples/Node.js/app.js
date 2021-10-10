var express = require('express');
var { proxy: proxyConfig } = require('./serverConfig')
var { createProxyMiddleware: proxy } = require('http-proxy-middleware')
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../dist'))
Object.keys(proxyConfig).map(key => {
    app.use(key, proxy(proxyConfig[key]))
})
app.listen(3001);
