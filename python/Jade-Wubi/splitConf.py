# coding=utf-8

# =======================
# 把有重码的项目与没有重码的条目分开
# =======================

words = open('chs.txt','r')
cft = open('output/part_conflict.txt','w')
out = open('output/part_sig.txt','w')

cacheList = []

def codeChange(rec) :
	global cacheList
	if len(cacheList) > 1 :
		for r in cacheList :
			cft.write(r[0] + '\t' + r[1] + '\n');
		cacheList = []
		cacheList.append(rec)
	else :
		for r in cacheList :
			out.write(r[0] + '\t' + r[1] + '\n');
		cacheList = []
		cacheList.append(rec)

for line in words.readlines():
	rec = line.rstrip().split('\t')
	if(len(cacheList) == 0 or rec[0] == cacheList[0][0]):
		cacheList.append(rec)
	else:
		codeChange(rec)

codeChange(['',''])

words.close()
cft.close()
out.close()
