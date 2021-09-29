const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const image = require("gulp-image");
const del = require("del");

// compile scss into css
function style() {
	return gulp
		.src("./scss/**/*.scss")
		.pipe(
			plumber({
				errorHandler(err) {
					console.log(err);
					this.emit("end");
				},
			})
		)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass({ errLogToConsole: true }))
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write("../maps"))
		.pipe(gulp.dest("./css"));
}

// Image optimize
function imgmin() {
	return gulp.src("./raw/*").pipe(image()).pipe(gulp.dest("./inc/img"));
}

// Listen to actions in VSCode
function watch() {
	gulp.watch("./raw/*", imgmin);
	gulp.watch("./scss/**/*.scss", style);
}

// Build
function clean() {
	return del(["./dist/**"]);
}

function publish() {
	clean();
	return gulp
		.src([
			"./**",
			"!./dist/**",
			"!./scss/**",
			"!./maps/**",
			"!./raw/**",
			"!./node_modules/**",
			"!./.git/**",
			"!./gulpfile.js",
			"!./gitignore",
			"!./package-lock.json",
			"!./package.json",
			"!./README.md",
			"!./LICENCE",
		])
		.pipe(gulp.dest("./dist"));
}

exports.imgmin = imgmin;
exports.style = style;
exports.watch = watch;
exports.publish = publish;
