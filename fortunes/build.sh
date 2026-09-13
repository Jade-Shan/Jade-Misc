#!/bin/bash
rm -rf out
cp -r src out
rename 's/\.txt$//' out/*.txt
find out/* -exec strfile {} \;
# sudo cp out/*.dat /usr/share/games/fortunes 
cp -r out/* $HOME/.local/share/fontunes/
