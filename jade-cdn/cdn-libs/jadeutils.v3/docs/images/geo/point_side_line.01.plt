set term pngcairo         # 定义图像格式 输出PNG到标准输出
unset border              # 不显示外框
set key off               # 不显示图例
# set zeroaxis lt -1 lw 2   # 画出X轴与Y轴
unset xtics
unset ytics
set xrange [-5 : 65]
set yrange [-5 : 65]
# set grid
set size ratio -1 # 去掉比率的变化，不然圆在Y轴上会变形

array P[2]
P[1]=5
P[2]=5

array A[2]
A[1]=60
A[2]=20

array B[2]
B[1]=15
B[2]=50


set arrow  1 from   -5,  0 to 65, 0 nofilled size 3,5,5 lc rgb "#000000" lw 2
set arrow  2 from    0, -5 to  0,65 nofilled size 3,5,5 lc rgb "#000000" lw 2
set arrow  3 from A[1], A[2] to B[1],B[2] nofilled size 8,0,0 lc rgb "#0000FF" lw 3
set arrow  4 from P[1], P[2] to A[1],A[2] nofilled size 8,0,0 lc rgb "#FF0000" lw 1
set arrow  5 from P[1], P[2] to B[1],B[2] nofilled size 8,0,0 lc rgb "#00FF00" lw 1
set arrow  6 from    0, P[2] to A[1],P[2] nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow  7 from    0, P[2] to A[1],P[2] nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow  8 from B[1], B[2] to B[1],0    nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow  9 from A[1], A[2] to A[1],0    nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow 10 from P[1], B[2] to P[1],0    nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow 11 from B[1], B[2] to    0,B[2] nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1
set arrow 12 from A[1], A[2] to    0,A[2] nofilled size 8,0,0 lc rgb "#AAAAAA" lw 1

set label 1 at P[1],P[2] point pt 7 ps 1.5 lc rgb "#F87217"
set label 2 at A[1],A[2] point pt 7 ps 1.5 lc rgb "#FF0000"
set label 3 at B[1],B[2] point pt 7 ps 1.5 lc rgb "#00FF00"
set label 4 at A[1],P[2] point pt 7 ps 1.5 lc rgb "#AAAAAA"
set label 5 at B[1],P[2] point pt 7 ps 1.5 lc rgb "#AAAAAA"
set label 6 at P[1],A[2] point pt 7 ps 1.5 lc rgb "#AAAAAA"
set label 7 at P[1],B[2] point pt 7 ps 1.5 lc rgb "#AAAAAA"

set label  9 "P"    at P[1]-3,P[2]+2
set label 11 "A"    at A[1]  ,A[2]+3
set label 12 "B"    at B[1]  ,B[2]+3
set label 13 "B.dx" at B[1]  ,P[2]-2
set label 14 "A.dx" at A[1]  ,P[2]-2
set label 15 "B.dy" at P[1]-3,B[2]+2 
set label 16 "A.dy" at P[1]-3,A[2]+2 

plot 1/0