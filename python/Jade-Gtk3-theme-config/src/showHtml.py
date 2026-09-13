# coding=utf-8

import re

reRec = re.compile(r'^@define-color\s(\w+)\s(.+);.*$', re.IGNORECASE)

htmlHead = '''
<html>
	<head>
		<title>color table</title>
	</head>
	<body>
		<table border='1'>
'''

htmlTail = '''
		</table>
	</body>
</html>
'''

fileCss = open('gtk.css','r')
fileHtm = open('tmp.htm','w')

fileHtm.write(htmlHead)
for line in fileCss.readlines():
	m = reRec.match(line)
	if None != m :
		rec = reRec.findall(line)
		row = r"<tr><td>%s</td><td>%s</td><td bgcolor='%s'>&nbsp;&nbsp;</td></tr>" \
			% (rec[0][0], rec[0][1], rec[0][1])
		fileHtm.write(row)
fileHtm.write(htmlTail)


fileCss.close()
fileHtm.close()


