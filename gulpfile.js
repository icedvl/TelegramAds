// Load plugins
const gulp = require("gulp");
const clean = require("gulp-clean");
const plumber = require("gulp-plumber");
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-include');
const version = require('gulp-version-number');
const less = require('gulp-less');
const minify = require('gulp-clean-css')
const uglify = require('gulp-uglify');




// PATH
const path = {
	build: {
		html: 'pre_build',
		js: 'pre_build/assets/script',
		libs: 'pre_build/assets/script/libs',
		style: 'pre_build/assets/style',
		lang: 'pre_build/assets/lang',
		img: 'pre_build/assets/images',
		server: './pre_build/'
	},
	src: {
		html: 'src/client/html/index.html',
		js: 'src/client/script/script.js',
		libs: 'src/client/script/libs/**/*',
		style: 'src/client/style/style.less',
		lang: 'src/client/lang/**/*.*',
		img: 'src/client/images/**/*.*',
		server: 'src/server/**/*'
	},
	watch: {
		html: 'src/client/html/index.html',
		js: 'src/client/script/**/*',
		libs: 'src/client/script/libs/**/*.*',
		style: 'src/client/style/**/*',
		lang: 'src/client/lang/**/*.*',
		img: 'src/client/images/**/*.*',
		server: 'src/server/**/*.*'
	},
	clean: './pre_build'
};




// Clean assets
function removeFolder() {
	return gulp
		.src(path.clean)
		.pipe(clean())
}



// HTML
function html() {
	return gulp
		.src(path.src.html)
		.pipe(version({
			'value': '%MDS%',
			'append': {
				'key': 'v',
				'to': ['css', {
					'type' : 'js',
					'attr' : ['src'],
					'key' : 'v',
					'value' : '%MDS%',
					'cover' : 1,
					'files' : ['style.css', 'script.js']
				}],
			}
		}))
		.pipe(gulp.dest(path.build.html))
}

// CSS task
function css() {
	return gulp
		.src( path.src.style )
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		// .pipe(minify())
		.pipe( gulp.dest(path.build.style) )
}

// CSS task BUILD
function cssBuild() {
	return gulp
		.src( path.src.style )
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}))
		.pipe(minify())
		.pipe( gulp.dest(path.build.style) )
}




// Transpile, concatenate and minify scripts
function script() {
	return (
		gulp
			.src([path.src.js])
			.pipe(include())
			.on('error', console.log)
			// .pipe(uglify())
			.pipe(gulp.dest(path.build.js))
	);
}

// Transpile, concatenate and minify scripts
function scriptBuild() {
	return (
		gulp
			.src([path.src.js])
			.pipe(include())
			.on('error', console.log)
			.pipe(uglify())
			.pipe(gulp.dest(path.build.js))
	);
}


function lang() {
	return gulp
		.src(path.src.lang)
		.pipe(gulp.dest(path.build.lang))
}

function libs() {
	return gulp
		.src(path.src.libs)
		.pipe(gulp.dest(path.build.libs))
}

function images() {
	return gulp
		.src(path.src.img)
		.pipe(gulp.dest(path.build.img))
}

function server() {
	return gulp
		.src(path.src.server)
		.pipe(gulp.dest(path.build.server))
}



// const script = gulp.series(libs, script);

// Watch files
function watchFiles() {
	gulp.watch(path.watch.style, css);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.js, gulp.series(html, script));
	gulp.watch(path.watch.lang, lang);
	gulp.watch(path.watch.img, images);
	gulp.watch(path.watch.server, server);
}

// define complex tasks
const watch = gulp.parallel(watchFiles);
const dev = gulp.parallel(gulp.series(removeFolder, gulp.parallel(html, css, script, libs, images, lang, server)), watch);
const build = gulp.series(removeFolder, gulp.parallel(cssBuild, images, html, scriptBuild, libs, lang, server));



// export tasks
exports.build = build;
exports.watch = watch;
exports.dev = dev;
exports.default = dev;
