#!/bin/bash

# build doc images
function gnuplotImage() {
		echo " gnuplot \"$1\" > \"$1.png\" "
		gnuplot "$1" > "$1.png"
}
function gnuplotDocImages() {
	# for pltFile in ./docs/images/*.plt;     do gnuplotImage "$pltFile"; done;
	for pltFile in ./docs/images/*/*.plt;   do gnuplotImage "$pltFile"; done;
	for pltFile in ./docs/images/*/*/*.plt; do gnuplotImage "$pltFile"; done;
}


echo '--- Starting build : jadeutils.v3 ---'
mkdir -p webroot  ../../webroot/jadeutils.v3
node ./node_modules/gulp-cli/bin/gulp.js
rm -rf ../../webroot/jadeutils.v3/*
cp -r webroot/* ../../webroot/jadeutils.v3

# build doc images
rm -rf ./docs/img-plt/**/*.png
gnuplotDocImages
cp -r doc/ ../../webroot/jadeutils.v3

cd ../../
tar czf jadeutils.v3.tar.gz webroot/jadeutils.v3/
echo '--- finish build : jadeutils.v3 ---'


# build doc images
rm -rf ./docs/img-plt/**/*.png
gnuplotDocImages