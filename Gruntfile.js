module.exports = function (grunt) {

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-connect-proxy");

	var pkg = grunt.file.readJSON('package.json');

	grunt.config.init({
		pkg: pkg,
		connect: {
			server: {
				options: {
					port: 8125,
					debug: true,
					base: 'public',
					hostname: 'localhost',
					middleware: function (connect, options) {
						var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
						return [
							// Include the proxy first
							proxy,
							// Serve static files.
							connect.static(options.base[0]),
							// Make empty directories browsable.
							connect.directory(options.base)
						];
					}
				},
				proxies: [
					{
						context: '/api/v1',
						host: 'secure.gthrive.com',
						port: 80,
						https: false,
						changeOrigin: true,
						xforward: false
					}
				]
			}
		}
	});

	grunt.registerTask('serve', function () {
		grunt.task.run([
			'configureProxies:server',
            'connect:server:keepalive'
		]);
	});

};