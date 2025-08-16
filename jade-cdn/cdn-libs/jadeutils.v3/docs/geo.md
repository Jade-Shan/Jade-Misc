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

1. 计算线段`PC`的长度。
2. 计算线段`PC`与X轴的夹角。

### 点到图形的扇面

```javascript
genVertexRaysFrom(
	x: number, y: number, shape: GeoShape2D, length?: number
): Array<{ vertex: Point2D, ray: Ray2D }>
```

![sample-img](images/geo/rote_ray_01.plt.png "sample image")