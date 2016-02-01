# gulp-md5-replace

[![NPM](https://nodei.co/npm-dl/gulp-md5-replace.png)](https://nodei.co/npm/gulp-md5-replace/)

[![NPM](https://nodei.co/npm/gulp-md5-replace.png?downloads=true&downloadRank=true&stars=true)](https://github.com/wangfulin/gulp-md5-replace)

> md5 plugin for [gulp](https://github.com/wangfulin/gulp-md5-replace) ,md5 the static files(eg javascript style image files) ;then replace the filenames in css or the html if needed by passing the file or dir in the first parameter, if you want to replace the encrypted filenames to newly generated encrypted filenames or you want to specify the length of md5 filename, you can passing an opts object in the second parameter.

## Usage

First, install `gulp-md5-replace` as a development dependency:

```shell
npm install --save-dev gulp-md5-replace
```

Then, add it to your `gulpfile.js`:

```javascript
var md5 = require("gulp-md5-plus");

gulp.src("./src/*.css")
	.pipe(md5('./output/index.html', {length: 10, isEncrypted: true}))
	.pipe(gulp.dest("./dist"));
```

md5 all css files in the src folder and change these css names in the quoted html--index.html

```javascript

gulp.task('img' ,function() {
    var imgSrc = './static/img/**',
        quoteSrc = './output/static/css/**/*.css', // [./output/static/css/**/*.css',./output/static/js/**/*.js']
        imgDst = './output/static/img';

    return gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(md5(quoteSrc, {isEncrypted: true}))
        .pipe(gulp.dest(imgDst));
});

```

first, optimize all images in the img folder including all sub folders; then md5 all these images and change these images' names in the quoted css files ;
####note
the directory of the md5ed files in the imgDst folder is the same as that of original files in the imgSrc folder; and css files can refer the image file with the same name in different folder rightly;

## API

### md5(file, opts)

#### file
Type: `String`
Default: null

Optionnal: the file need to replace the file name of the md5ed files. dir is also supported

#### opts
Type: `Object`
Default: null

Optionnal: you can pass the `length` to limit the length of the hash that is appended and the `isEncrypted` to replace the specific filenames or encrypted filenames

Example:
```javascript
	gulp.src('static/js/*')
        .pipe(md5('./output/html', {length: 10, isEncrypted: true}))
        .pipe(gulp.dest('./output'));
```

The sample above will append the md5 hash(length : 10) to each of the file in the static/js folder then repalce the link file name in the output/html/ using md5ed file name; at last store all of that into the *output* folder.

## Thank You

This is based on [gulp-md5-plus](https://github.com/wpfpizicai/gulp-md5-plus)

## License

http://en.wikipedia.org/wiki/MIT_License[MIT License]




