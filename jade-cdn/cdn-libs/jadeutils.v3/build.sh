#!/bin/bash
echo '--- Starting build : jadeutils.v3 ---'
mkdir -p webroot  ../../webroot/jadeutils.v3
node ./node_modules/gulp-cli/bin/gulp.js
rm -rf ../../webroot/jadeutils.v3/*
cp -r webroot/* ../../webroot/jadeutils.v3
cd ../../
tar czf jadeutils.v3.tar.gz webroot/jadeutils.v3/
echo '--- finish build : jadeutils.v3 ---'

