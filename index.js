var path = require('path'),
    gutil = require('gulp-util'),
    through = require('through2'),
    crypto = require('crypto'),
    fs = require('fs'),
    glob = require('glob');

module.exports = function (ifile, opts) {
    var isEncrypted = (opts && opts.isEncrypted) ? true : false;
    var length = (opts && opts.length) ? opts.length : 10;
    return through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
            return cb();
        }

        if(!file.contents){
            return cb();
        }

        var d = calcMd5(file, length)
        , filename = path.basename(file.path)
        , extname = path.extname(file.path)
        , relativepath = path.relative(file.base ,file.path)
        , sub_namepath = relativepath.replace(new RegExp(filename) , "").split(path.sep).join('/')
        , dir;

        if(file.path[0] == '.'){
            dir = path.join(file.base, file.path);
        } else {
            dir = file.path;
        }
        dir = path.dirname(dir);

        var md5_filename = filename.split('.').map(function(item, i, arr){
            return i == arr.length-2 ? item + '_'+ d : item;
        }).join('.');

        var fileRegExp = null;
        var extlen = extname.length;
        if(isEncrypted){
          fileRegExp = new RegExp('/' + filename.slice(0, -extlen) + '(_[0-9a-f]{' + length + '})?\\' + extname + '[^a-zA-Z_0-9].*?', 'g');
        }else{
          fileRegExp = new RegExp('/' + filename + '[^a-zA-Z_0-9].*?', 'g');
        }

        if(Object.prototype.toString.call(ifile) == "[object Array]"){
            ifile.forEach(function(i_ifile){
                i_ifile && glob(i_ifile,function(err, i_files){
                    if(err) return console.log(err);
                    i_files.forEach(function(i_ilist){
                        var result = fs.readFileSync(i_ilist,'utf8').replace(fileRegExp, function(sfile_name){
                        return sfile_name.replace(filename, md5_filename)
                    });
                        fs.writeFileSync(i_ilist, result, 'utf8');
                    })
                })
            })
        }else{
            ifile && glob(ifile,function(err, files){
                if(err) return console.log(err);
                files.forEach(function(ilist){
                    var result = fs.readFileSync(ilist,'utf8').replace(fileRegExp, function(sfile_name){
                        return sfile_name.replace(filename, md5_filename)
                    });
                    fs.writeFileSync(ilist, result, 'utf8');
                })
            })
        }

        file.path = path.join(dir, md5_filename);

        this.push(file);
        cb();
    }, function (cb) {
        cb();
    });
};


function calcMd5(file, length){
    var md5 = crypto.createHash('md5');
    md5.update(file.contents, 'utf8');

    return length > 0 ? md5.digest('hex').slice(0, length) : md5.digest('hex');
}
