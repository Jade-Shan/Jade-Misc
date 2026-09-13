#!/bin/bash
# version: 0.0.1

python gentable.py

# cd output

# 制作简体五笔输入法
echo "creating table db for jtwb ..."
ibus-table-createdb -s output/jtwb.txt
echo "installing table db for jtwb ..."
sudo cp jtwb.db /usr/share/ibus-table/tables
sudo cp static/jtwb.svg /usr/share/ibus-table/icons
echo "clean cache for jtwb ..."
rm -rf output/*
rm ./jtwb.db
rm ~/.ibus/tables/jtwb-user.db
echo "done."

# 制作繁体五笔输入法
# echo "creating table db for jtwb ..."
# ibus-table-createdb -s ftwb.txt
# echo "installing table db for jtwb ..."
# sudo cp ftwb.db /usr/share/ibus-table/tables
# sudo cp ftwb.svg /usr/share/ibus-table/icons
# echo "clean cache for jtwb ..."
# rm ~/.ibus/tables/ftwb-user.db
# echo "done."
