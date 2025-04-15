// #!/bin/bash
// # lessc -x style.less > style.css
// # lessc style.less > style.css

// gulp build-less：你会在目录下发现less目录下的less文件被编译成对应的css文件。
// gulp min-styles：会在css目录下输出all.css和all.min.css文件。
// gulp develop：会监听所有less文件，当有less文件改变时，会执行build-less和min-styles
const gulp      = require('gulp');
const less      = require('gulp-less');        //less编译
const minifycss = require('gulp-minify-css');  //css压缩
const jshint    = require('gulp-jshint');      //js检查
const uglify    = require('gulp-uglify-es').default;      //js压缩
const rename    = require('gulp-rename');      //重命名
const concat    = require('gulp-concat');      //合并文件
const clean     = require('gulp-clean');       //清空文件夹

const themes = ['hobbit', 'lo-fi', 'paper-print'];

/* themeTasksParam 要作为gulp.parallel(...)的参数列表，
 * 所以不能用数组，定义一个类数组。
 * 类数组必须有2个组成部分：1)* 属性要为索引（数字）属性，2)必须有length属性
 * 例如：var obj = {"0":'a',"1":'b', "length":3}
 */
const themeTasks = [];

// =======================
// css
// =======================

themes.forEach((theme) => {

	const imageTsk = 'process-images-' + theme;
	const imageSrc = 'src/themes/' + theme + '/images/';
	const imageDst = 'webroot/themes/' + theme + '/images/';
	gulp.task(imageTsk,  gulp.series(
		() => {
			return gulp.src([imageDst + '*'], {read: false, allowEmpty: true})
				.pipe(clean());
		}, () => {
			return gulp.src([imageSrc + '**/*']).pipe(gulp.dest(imageDst))
		}
	));
	themeTasks.push(imageTsk)

	const styleTsk = 'process-style-' + theme;
	const styleSrc = 'src/themes/';
	const styleThemesSrc = 'src/themes/' + theme + '/styles/';
	const styleDst = 'webroot/themes/' + theme + '/styles/';
	gulp.task(styleTsk,  gulp.series(
		() => {
			return gulp.src([styleDst+ '*'], {read: false, allowEmpty: true})
				.pipe(clean()); }, 
		() => {
			return gulp.src([styleThemesSrc + '**/*.less', styleSrc + 'comm.less'])
				.pipe(concat('all.less'))
 				.pipe(less({compress: false})).on('error', (e) => {console.log(e)})
 				.pipe(gulp.dest(styleDst))
 				.pipe(minifycss()).pipe(rename({suffix: '.min'}))
 				.pipe(gulp.dest(styleDst))
		}
	));
	themeTasks.push(styleTsk)

});

// =======================
// javascript
// =======================

const scriptSrc = 'src/scripts/';
const scriptTag = 'webroot/scripts/';
gulp.task('clean-scripts', () => {
	return gulp.src([scriptTag + '*'], 
		{read: false, allowEmpty: true}).pipe(clean());
});

// 检查javascript
gulp.task('check-scripts', () => {
	return gulp.src(scriptSrc + '**/*.js').pipe(jshint())
		.pipe(jshint.reporter('default'));
});


// 合并、压缩、重命名havascript
gulp.task('process-scripts', gulp.series('clean-scripts', () => {
	return gulp.src([
		scriptSrc + 'basic.js',
		scriptSrc + 'jqueryTools.js',
		scriptSrc + 'datetime.js',
		scriptSrc + 'web.js',
		scriptSrc + 'dataStructure.js',
		scriptSrc + 'instance.js',
		scriptSrc + 'wiki.js'
	]).pipe(jshint()).pipe(jshint.reporter('default'))
		.pipe(gulp.dest(scriptTag))
		//.pipe(concat('all.js'))
		//.pipe(gulp.dest(scriptTag))
		.pipe(rename({suffix: '.min'})).pipe(uglify())
		.pipe(gulp.dest(scriptTag))
}));
themeTasks.push('process-scripts')

gulp.task('default', gulp.parallel(themeTasks))

