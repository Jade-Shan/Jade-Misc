# coding=utf-8

head = open('static/chs-head.txt','r')
words = open('chs.txt','r')
out = open('output/jtwb.txt','w')

for line in head.readlines():
	# line.rstrip()
	out.write(line)

count = 90000
for line in words.readlines():
	# line.rstrip()
	out.write(line.rstrip() + '\t' + str(count)  +'\n' )
	count = count -1

out.write('END_TABLE\n')

head.close() 
words.close() 
out .close()

head = open('static/cht-head.txt','r')
words = open('cht.txt','r')
out = open('output/ftwb.txt','w')

for line in head.readlines():
	# line.rstrip()
	out.write(line)

count = 90000
for line in words.readlines():
	# line.rstrip()
	out.write(line.rstrip() + '\t' + str(count)  +'\n' )
	count = count -1

out.write('END_TABLE\n')

head.close() 
words.close() 
out .close()

