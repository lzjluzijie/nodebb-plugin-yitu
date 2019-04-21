//Modified from https://github.com/barisusakli/nodebb-plugin-imgur
//Also check https://github.com/lzjluzijie/nodebb-plugin-smms

'use strict';

var request = require('request');
var fs = require('fs');

var plugin = {};

plugin.upload = function(data, callback) {
	var image = data.image;

	if (!image) {
		return callback(new Error('invalid image'));
	}

	var type = image.url ? 'url': 'file';
	if (type === 'file' && !image.path) {
		return callback(new Error('invalid image path'));
	}

	var formDataImage;
	if (type === 'file') {
		formDataImage = fs.createReadStream(image.path);
		formDataImage.on('error',
		function(err) {
			done(err);
		});
	} else if (type === 'url') {
		formDataImage = image.url;
	} else {
		return callback(new Error('unknown-type'));
	}

	var options = {
		url: 'https://t.halu.lu/api/upload',
		headers: {
			'User-Agent': 'request'
		},
		formData: {
			tu: formDataImage
		}
	};

	request.post(options, function optionalCallback(err, httpResponse, body) {
		if (err) {
			return console.error('upload failed:', err);
		}
		var resp;
		try {
			resp = JSON.parse(body);
		} catch(err) {
			return console.error('parse json failed:', err);
		}
		
		console.log('Upload successful! Server responded with:', body);
		return callback(null, {
			name: image.name,
			url: resp.url
		});
	});

};

module.exports = plugin;