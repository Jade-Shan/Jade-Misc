#!/bin/bash

# package 3rd-cdn
echo $PWD
echo "package 3rd-lib : start"
mkdir -p ./webroot/3rd/ 
rm   -rf ./webroot/3rd/*   
cp -r cdn-libs/3rd/* ./webroot/3rd
tar czf 3rd.tar.gz webroot/3rd/
echo "package 3rd-lib : end"
echo $PWD

# package jade-utils
cd cdn-libs/jadeutils.v2/
bash ./build.sh
echo $PWD
cd ../..
