Jadeutils V2
=============

Build
-------------

构建脚本`build.sh`：

```bash
gulp
rm -rf ../../webroot/jadeutils.v2
cp -r webroot ../../webroot/jadeutils.v2
```
构建脚本`gulpfiles.js`：

* JS脚本只有一套，从`src/scripts/**/*.js`构建到`webroot/scripts/**/*.js`
* CSS有多套，相同的结构不同的配色。`src/themes/{theme}/styles/**/*.less`到
		`webroot/themes/{theme}/styles/**/*.css`
* Gulp脚本遍历定义的`themes`数组，动态生成每个Gulp Task，并添加到执行队列中。

Useage
-------------

```bash
python run-cdn.py -n <hostname> -p <port> -a <allow-origin>
```

* dev env: `bash run-dev.sh`
* fat env: `bash run-fat.sh`
* prd env: `bash run-prd.sh`


TODO List
-------------

* `Number.prototype.format(formatExp)`方法，格式表达式处理的代码还没有写，
	只能生成`##,###.##`的形式的字符串。



