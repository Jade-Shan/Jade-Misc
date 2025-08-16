set term pngcairo         # 定义图像格式 输出PNG到标准输出
unset border              # 不显示外框
set key off               # 不显示图例
set zeroaxis lt -1 lw 2   # 画出X轴与Y轴
set xrange [-6 : 60]
set yrange [-6 : 60]
# set xtics 5
# set ytics 5
unset xtics
unset ytics
set grid

set arrow 1 from   -5,  5 to 60, 5 nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow 2 from    5, -5 to  5,60 nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1

set label 1 at   5,  5 point pt 7 ps 1.5 lc rgb "#F87217"
set label 2 at  30, 30 point pt 7 ps 1.5 lc rgb "#0000FF"
set label 3 at  10, 34 point pt 7 ps 1.5 lc rgb "#FF0000"
set label 4 at  34, 10 point pt 7 ps 1.5 lc rgb "#00FF00"

set label  9 "P"  at   2,  7
set label 10 "C"  at  31, 31 
set label 11 "Q1" at   7, 36
set label 12 "Q2" at  35,  9

set arrow 3 from    5,  5 to 30,30 nofilled size 8,0,0 lc rgb "#0000FF" lw 1
set arrow 4 from    5,  5 to 10,34 nofilled size 8,0,0 lc rgb "#FF0000" lw 1
set arrow 5 from    5,  5 to 34,10 nofilled size 8,0,0 lc rgb "#00FF00" lw 1
set arrow 6 from   30, 30 to 10,34 nofilled size 8,0,0 lc rgb "#FF0000" lw 1
set arrow 7 from   30, 30 to 34,10 nofilled size 8,0,0 lc rgb "#00FF00" lw 1

set size ratio -1 # 去掉比率的变化，不然圆在Y轴上会变形
set object 1 circle at 30,30 size 20 fc rgb "#0000FF" lw 2

plot 1/0 