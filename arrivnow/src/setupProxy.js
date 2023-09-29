const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/security/oauth',
    createProxyMiddleware({
      target: 'https://outpost.mapmyindia.com',
      changeOrigin: true,
	  secure: false,
    })
  );
};