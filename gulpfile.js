/**
 * プラグインの読み込み
 */
const gulp = require("gulp");

// Pug
const pug = require('gulp-pug');

// SCSS
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const reporter = require('postcss-reporter');
const autoprefixer = require("gulp-autoprefixer");
const cssWring = require('csswring');
const sassGlob = require("gulp-sass-glob");

// JS
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');

// Image
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

// Utility
const browserSync = require("browser-sync").create();
const notify = require("gulp-notify");

/**
 * 開発用ディレクトリ
 */
const src = {
  root: "src/",
  pug: "src/**/*.pug",
  css: "src/assets/_scss/**/*.scss",
  js: "src/assets/js/**/*.js",
  img: "src/assets/img/*"
};

/**
 * 公開用ディレクトリ
 */
const dist = {
  root: "dist/",
  css: "dist/common/css",
  js: "dist/common/js",
  img: "dist/common/img"
};

/**
 * Pugファイルのトランスパイル
 */
const pugOptions = {
  pretty: true,
  basedir: src.root
}
gulp.task("pug", (done) => {
  return gulp.src([src.pug, "!" + src.root + "**/_*.pug"])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(dist.root));
  done();
});

/**
 * SCSSファイルのトランスパイルとLint
 */
const postcssOption = [
  autoprefixer,
  reporter,
  cssWring
];
gulp.task("sass", (done) => {
  return gulp
    .src(src.css)
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss(postcssOption))
    .pipe(gulp.dest(dist.css));
  done();
});

/**
 * JSファイルの圧縮とLint
 */
gulp.task("js", (done) => {
  return gulp
    .src(src.js)
    .pipe(plumber())
    .pipe(babel({presets: ["@babel/preset-env"]}))
    .pipe(gulp.dest(dist.js));
  done();
})

/**
 * 画像の圧縮
 */
const imageminOption = [
  imageminPngquant({ quality: [.65, .85] }),
  imageminMozjpeg({ quality: 80 }),
  imagemin.gifsicle(),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo({
    plugins: [
      // viewBox属性を削除する（widthとheight属性がある場合）。
      // 表示が崩れる原因になるので削除しない。
      { removeViewBox: false },
      // <metadata>を削除する。
      // 追加したmetadataを削除する必要はない。
      { removeMetadata: false },
      // SVGの仕様に含まれていないタグや属性、id属性やversion属性を削除する。
      // 追加した要素を削除する必要はない。
      { removeUnknownsAndDefaults: false },
      // コードが短くなる場合だけ<path>に変換する。
      // アニメーションが動作しない可能性があるので変換しない。
      { convertShapeToPath: false },
      // 重複や不要な`<g>`タグを削除する。
      // アニメーションが動作しない可能性があるので変換しない。
      { collapseGroups: false },
      // SVG内に<style>や<script>がなければidを削除する。
      // idにアンカーが貼られていたら削除せずにid名を縮小する。
      // id属性は動作の起点となることがあるため削除しない。
      { cleanupIDs: false },
    ],
  })
];

gulp.task("imagemin", (done) => {
  return gulp
    .src(src.img)
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest(dist.img));
  done();
});

/**
 * 開発ローカルサーバー立ち上げ
 */
const browserSyncOption = {
  server: dist.root
};
gulp.task("serve", (done) => {
  browserSync.init(browserSyncOption);
  done();
})

/**
 * ファイルの監視
 */
gulp.task("watch", (done) => {
  const browserReload = (done) => {
    browserSync.reload();
    done();
  }
  gulp.watch([src.pug, "!" + src.root + "**/_*.pug"], gulp.series("pug"));
  gulp.watch(src.css, gulp.series("sass"));
  gulp.watch(src.js, gulp.series("js"));
  gulp.watch(src.img, gulp.series("imagemin"));
  gulp.watch(dist.root, browserReload);
  done();
})

gulp.task("default", gulp.series("serve", "watch"));
gulp.task("build", gulp.series("pug", "sass", "js", "imagemin"));