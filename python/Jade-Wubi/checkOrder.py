# coding=utf-8

# =======================
# 把有重码的项目与没有重码的条目分开
# =======================

words = open('chs.txt','r')

prk = ''
lno = 0
for line in words.readlines():
	prk
	lno = lno +1
 	r = line.rstrip().split('\t')
 	if( len(r[0]) == len(prk) ):
		if( r[0] < prk ):
			print '%d : %s <--> %s' % (lno, prk, r[0])
	prk = r[0]

words.close()
