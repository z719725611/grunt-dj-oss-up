# grunt-ali-oss-upload

> A grunt tool for uploading static file to aliyun oss.

## Getting Started

```shell
npm install grunt-dj-oss-up --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dj-oss-up');
```

## The "oss" task


### Options


#### options.accessKeyId
Type: `String`

A string value that is your aliyun oss accessKeyId.

#### options.accessKeySecret
Type: `String`

A string value that is your aliyun oss accessKeySecret.

#### options.bucket
Type: `String`

A string value that is your aliyun oss bucket.

#### options.region
Type: `String`

A string value that is your aliyun oss region.

#### options.objectGen
Type: `Function`

Default: 
```js
function(dest, src){
	return [dest, path.basename(src)].join('\/');
}
```


```js
grunt.initConfig({
   oss: {
              upload:{
                  options: {
                      accessKeyId:'<%= cdn["js.ak"] %>',
                      accessKeySecret: '<%= cdn["js.sk"] %>',
                      bucket:'<%= cdn["js.bucket"] %>',
                      region:'<%= cdn["js.region"] %>'
                  },
                  files: [
                      {
                          cwd: '<%= config.view_dest %>',
                          src: ['build/*.js']
                      }
                  ]
              }
          },
});
```


