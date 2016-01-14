var gulp             	= require('gulp');
var mainBowerFiles   	= require('main-bower-files');
var rename           	= require('gulp-rename');
var gulpFilter       	= require('gulp-filter');
var order            	= require("gulp-order");
var concat           	= require('gulp-concat');
var uncss 			 	= require('gulp-uncss');
var cssmin			 	= require('gulp-cssmin');
var uglify 			 	= require('gulp-uglify');
var prefix    		 	= require('gulp-autoprefixer');
var livereload 		 	= require('gulp-livereload');
var spritesmith      	= require('gulp.spritesmith');
var unhtml           	= require('gulp-minify-html');
var open             	= require('open');
var connect          	= require('connect');
var serveStatic      	= require('serve-static');
var gulpSequence 		= require('gulp-sequence');


// мини-сервер для livereload
gulp.task('server', function(next) {
	connect().use(serveStatic('./www')).listen(process.env.PORT || 8002, next);
	open("http://localhost:8002/", "chrome");
	console.log("Server start\nOpen http://localhost:8002/\nStop server Ctrl+C");
});

// следим и распределяем main файлы Bower
gulp.task('libs', function () {
	var jsFilter = gulpFilter('**/*.js');
	var cssFilter = gulpFilter('**/*.css');
	
	return gulp.src(mainBowerFiles(
	{
		includeDev: true
	}))
	
	// собираем js файлы , склеиваем и отправляем в папку www/js 
	.pipe(jsFilter)
	.pipe(concat('libs.js'))
	.pipe(uglify())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('./src/js'))
	.pipe(jsFilter.restore())
	.pipe(cssFilter)
	.pipe(concat('libs.scss'))
	.pipe(gulp.dest('./src/style/library/'));
	
});

// css. Автопрефикс, очистка кода от неиспользуемых стилей, минификация.
gulp.task('css', function() {
	return gulp.src('./src/style/style.css')
	.pipe(prefix(["last 5 version", "ie 8", "ie 7"]))
	.pipe(cssmin())	
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('./www/style/'));
});


// js. Минифицирует и склеивает
gulp.task('js', function () {
	return gulp.src(['./src/js/modernizr.custom.js', './src/js/*min.js', './src/js/*.js'])
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('./www/js/'));
});

// минифицируем html
gulp.task('minifyHtml', function() {
    var opts = {spare:true};

  gulp.src('./src/*.html')
    .pipe(unhtml(opts))
    .pipe(gulp.dest('./www/'))
});

//создаем спрайт
gulp.task('sprite', function () {
  var spriteData = gulp.src('./src/image/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
	cssFormat: 'sass',
    cssName: 'sprite.sass',
	padding: 10,
	algorithm: 'binary-tree',
	cssVarMap: function(sprite) {
                    sprite.name = 'sprite-' + sprite.name
                }
  }));
  spriteData.img.pipe(gulp.dest('./www/image/'));
  spriteData.css.pipe(gulp.dest('./src/style/library/'));
});

//img
gulp.task('img', function(){
	gulp.src('./src/image/*')
		.pipe(gulp.dest('./www/image'));
});

// а теперь наблюдаем за происходящим =)
gulp.task('watch', ['libs', 'css', 'js', 'minifyHtml', 'sprite', 'img', 'server'], function() {
  var server = livereload();
  
  gulp.watch('bower.json',['libs']);
  
  gulp.watch('./src/style/style.css',['css']);
  
  gulp.watch('./src/js/*.js',['js']);
  
  gulp.watch('./src/*.html',['minifyHtml']);
  
  gulp.watch('./src/image/sprite/*.png',['sprite']);

  gulp.watch('./www/**/*').on('change', function(file) {
      server.changed(file.path);
  });
});

gulp.task('build', gulpSequence(['libs', 'css', 'minifyHtml', 'sprite', 'img', 'server'], 'js'));

//, function () {
//	console.log("Server start\nOpen http://localhost:8002/\nStop server Ctrl+C");
//}





