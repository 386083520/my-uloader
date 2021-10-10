module.exports = {
    proxy: {
        '/upload': {
            target: 'http://localhost:3005',
            changeOrigin: true,
            pathRewrite: {
                '^/upload': '/upload'
            }
        }
    }
}
