
'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks
	var co = require('co'),
		OSS = require('ali-oss'),
		async = require('async'),
		path = require('path'),
		fs = require('fs'),
		chalk = require('chalk');

	grunt.registerMultiTask('oss', 'A grunt tool for uploading static file to aliyun oss.', function() {
		var done = this.async();
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			/**
			 * @name objectGen --return a aliyun oss object name
			 *					  default return grunt task files' dest + files' name
			 * @param dest  --grunt task files' dest
			 * @param src  --grunt task files' src
			 */
			objectGen: function(dest, src){
				return [dest, path.basename(src)].join('\/');
			}
		});

		if(!options.accessKeyId || !options.accessKeySecret || !options.bucket ||!options.region ){
			grunt.fail.fatal('accessKeyId, accessKeySecret and bucket, region  are all required!');
		}
		var option = {
			accessKeyId: options.accessKeyId,
			accessKeySecret: options.accessKeySecret,
			bucket:options.bucket,
			region:options.region,
			//host: options.host,
			//timeout:options.timeout
		};
		//creat a new oss-client
		var oss=new OSS(option),
		//var	oss = new OSS.OssClient(option),
			uploadQue = [];
		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			// Concat specified files.
			var objects = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				// return an oss object.
				return {
					bucket: options.bucket,
					object: options.objectGen(f.dest, filepath),
					destFile: f.dest,
					srcFile: filepath
				};

			});
			objects.forEach(function(o) {
				uploadQue.push(o);
			});
		});
		var uploadTasks = [];
		uploadQue.forEach(function(o) {
			uploadTasks.push(makeUploadTask(o));
		});
		grunt.log.ok('Start uploading files.')
		async.series(uploadTasks, function(error, results) {
			if (error) {
				grunt.fail.fatal("uploadError:"+ JSON.stringify(error));
			} else {
				grunt.log.ok('All files has uploaded yet!');
			}
			done(error, results);
		});
		/**
		 * @name makeUploadTask  -- make task for async
		 * @param object  --aliyun oss object
		 */
		function makeUploadTask(o) {
			return function(callback) {
				//skip object when object's path is a directory;
				if( fs.lstatSync(o.srcFile).isDirectory() ){
					grunt.log.error(chalk.cyan(o.srcFile) + chalk.red(' is a directory, skip it!'));
					callback();
				}else {
					grunt.log.ok('Start uploading file '+ chalk.cyan(o.srcFile));
					co(function* () {
						//var timestamp=new Date().getTime();//时间戳
						var result = yield oss.put(o.srcFile, o.srcFile);
						console.log(result);
						callback();
					}).catch(function (err) {
						console.log(err);
					});
					/*oss.putObject(o, function (error, result) {
					 callback(error, result);
					 });*/
				}
			}
		}
	});
};
