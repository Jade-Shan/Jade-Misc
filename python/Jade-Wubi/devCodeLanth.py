# coding=utf-8

# =======================
# 把有重码的项目与没有重码的条目分开
# =======================

words = open('chs.txt','r')
cl1 = open('output/cl1.txt','w')
cl2 = open('output/cl2.txt','w')
cl3 = open('output/cl3.txt','w')
cl4 = open('output/cl4.txt','w')

for line in words.readlines():
	r = line.rstrip().split('\t')
	codeLenth = len(r[0])
	if( codeLenth == 1 ):
		cl1.write(r[0] + '\t' + r[1] + '\n');
	elif( codeLenth == 2 ):
		cl2.write(r[0] + '\t' + r[1] + '\n');
	elif( codeLenth == 3 ):
		cl3.write(r[0] + '\t' + r[1] + '\n');
	elif( codeLenth == 4 ):
		cl4.write(r[0] + '\t' + r[1] + '\n');

words.close()
cl1.close()
cl2.close()
cl3.close()
cl4.close()
