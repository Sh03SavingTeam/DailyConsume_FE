const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('setupProxy.js 로드됨');

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:9999",
            changeOrigin: false,
            logLevel: 'debug', // 추가: 로그 레벨을 디버그 모드로 설정
            onProxyReq: (proxyReq, req, res) => {
                console.log(`프록시 요청: ${req.method} ${req.url}`);
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log(`프록시 응답: ${req.method} ${req.url}`);
            },
        })
    );
};