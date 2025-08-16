2D几何工具
=================

三角函数备忘图
-----------------

![circ.angle](images/geo/circ.angle.03.png "sample image")

计算点到图形的切线
-----------------

### 点到圆的切线

圆外一点`P(x,y)`到圆的切线`PQ1`与`PQ2`

```javascript
Circle2D.getVertexesFrom(x: number, y: number): Array<Point2D>;
```
![sample-img](images/geo/circ_cut_01.plt.png "sample image")

1. 计算线段`dx`与`dy`的长度分别为`C.x - P.x`与`C.y - P.y`。
	（结果出错，要改成`P.x - C.x`与`P.y - X.y`才对，为什么？）
2. 计算线段`CP`的长度`sqrt(dx^2 + dy^2)`。
3. 计算线段`CP`的角度`arctan(dy, dx)`。
4. 角`PCQ`等于`arcsin(CQ / PC)`等于`arcsin(r / CP)`。
	（结果出错，要改成`pi/2 - arcsin(r / PC)`才对，为什么？）
5. `PQ1`与`PQ2`的角度分别为`PC + QPC`与`PC - QPC`
6. `Q1.x`等于`C.x + CP * cos(PQ1)`
6. `Q1.y`等于`C.y + CP * sin(PQ1)`
6. `Q2.x`等于`C.x + CP * cos(PQ2)`
6. `Q2.y`等于`C.y + CP * sin(PQ2)`

### 点到图形的扇面

```javascript
genVertexRaysFrom(
	x: number, y: number, shape: GeoShape2D, length?: number
): Array<{ vertex: Point2D, ray: Ray2D }>
```

![sample-img](images/geo/rote_ray_01.plt.png "sample image")