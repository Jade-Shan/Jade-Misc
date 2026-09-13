# version: 0.0.1

# 制作简体五笔输入法
ibus-table-createdb -s jtwb.txt
sudo cp jtwb.db /usr/share/ibus-table/tables
sudo cp jtwb.svg /usr/share/ibus-table/icons
rm ~/.ibus/tables/jtwb-user.db

# 制作繁体五笔输入法
ibus-table-createdb -s ftwb.txt
sudo cp ftwb.db /usr/share/ibus-table/tables
sudo cp ftwb.svg /usr/share/ibus-table/icons
rm ~/.ibus/tables/ftwb-user.db
