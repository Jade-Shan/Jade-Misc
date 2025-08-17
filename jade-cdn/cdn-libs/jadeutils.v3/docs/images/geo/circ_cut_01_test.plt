set term pngcairo         # 定义图像格式 输出PNG到标准输出
unset border              # 不显示外框
set key off               # 不显示图例
set zeroaxis lt -1 lw 2   # 画出X轴与Y轴
set xrange [-5 : 55]
set yrange [-5 : 55]
set xtics 5
set ytics 5
# unset xtics
# unset ytics
set grid
set size ratio -1 # 去掉比率的变化，不然圆在Y轴上会变形

array P[2]
P[1]=5
P[2]=5
array C[3]
C[1]=30
C[2]=30
C[3]=20

array Q1[2]
Q1[1]=33.66
Q1[2]=10.34

array Q2[2]
Q2[1]=10.34
Q2[2]=33.66

dx=C[1]-P[1]
dy=C[2]-P[2]

set arrow 1 from   -5,  5 to 60, 5 nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow 2 from    5, -5 to  5,60 nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1

set label 1 at  P[1], P[2] point pt 7 ps 1.5 lc rgb "#F87217"
set label 2 at  C[1], C[2] point pt 7 ps 1.5 lc rgb "#0000FF"
set label 3 at Q1[1],Q1[2] point pt 7 ps 1.5 lc rgb "#FF0000"
set label 4 at Q2[1],Q2[2] point pt 7 ps 1.5 lc rgb "#00FF00"
set label 5 at  C[1], P[2] point pt 7 ps 1.5 lc rgb "#AAAAAA"
set label 6 at  P[1], C[2] point pt 7 ps 1.5 lc rgb "#AAAAAA"

set label  9 "P"  at   2,  7
set label 10 "C"  at  31, 31 
set label 11 "Q1" at   7, 36
set label 12 "Q2" at  35,  9
set label 13 "dx" at  30,  3
set label 14 "dy" at   1, 30

set arrow 3 from P[1], P[2] to  C[1], C[2] nofilled size 8,0,0 lc rgb "#0000FF" lw 1
set arrow 4 from P[1], P[2] to Q1[1],Q1[2] nofilled size 8,0,0 lc rgb "#FF0000" lw 1
set arrow 5 from P[1], P[2] to Q2[1],Q2[2] nofilled size 8,0,0 lc rgb "#00FF00" lw 1
set arrow 6 from C[1], C[2] to Q1[1],Q1[2] nofilled size 8,0,0 lc rgb "#FF0000" lw 1
set arrow 7 from C[1], C[2] to Q2[1],Q2[2] nofilled size 8,0,0 lc rgb "#00FF00" lw 1
set arrow 8 from C[1], C[2] to  C[1], P[2] nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow 9 from C[1], C[2] to  P[1], C[2] nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1

set object 1 circle at C[1],C[2] size C[3] fc rgb "#0000FF" lw 2

plot 1/0 