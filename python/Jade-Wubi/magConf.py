# coding=utf-8

# =======================
# 把有重码的项目与没有重码的条目分开
# =======================

fa = open('output/part_conflict.txt','r')
fb = open('output/part_sig.txt','r')
out = open('chs.txt','w')

a = fa.readline()
b = fb.readline()

while (a != '') or (b != ''):
	if a == '' :
		out.write(b)
		b = fb.readline()
	elif b == '' :
		out.write(a)
		a = fa.readline()
	else:
		ra = a.rstrip().split('\t')
		rb = b.rstrip().split('\t')
		if ra[0] < rb[0] :
			out.write(a)
			a = fa.readline()
		else:
			out.write(b)
			b = fb.readline()

fa.close()
fb.close()
out.close()
