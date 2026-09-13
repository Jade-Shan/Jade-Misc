# coding=utf-8

import unicodedata

otherDoubleWidthList = \
	'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ' + \
	'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ' + \
	'０１２３４５６７８９' + \
	'［］（）｛｝＇＂￢｀' + \
	'＋＜＝＞～＾＠＃％＆＊＿－￣＼｜￤／' + \
	'' + \
	'' + \
	'' + \
	'' + \
	'' + \
	'￠＄￥￡' + \
	'，．：；？！'
otherDoubleWidthList = otherDoubleWidthList.decode('utf-8')



def countStrWidthCJK(str, ambiwidth=2):

	'''计算字符串显示长度，能够处理CJK字符宽度
	ambiwidth: 宽度不定的字符算几个，取值为 1, 2'''

	if ambiwidth == 2:
		doubleWidth = ('W', 'A')
	elif ambiwidth == 1:
		doubleWidth = ('W',)
	else:
		raise ValueError('param ambiwidth must 1 or 2')

	count = 0
	unicodeStr = str.decode('utf-8')
	for i in unicodeStr:
		if (unicodedata.east_asian_width(i) in doubleWidth \
				or i in otherDoubleWidthList):
			count += 2
			continue
		count += 1
	
	return count


def filterMissDoubleWidthStr(str):

	'''检查有哪些宽字符被错判断为半字符'''

	for c in tmpStr.decode('utf-8'):
		if countStrWidthCJK(c.encode('utf-8')) == 1 :
			print c, '=', countStrWidthCJK(c.encode('utf-8'))



def justCJK(str, width, type='l', fillChar=' '):

	'''对齐字符串，能够处理CJK字符宽度'''

	fillWidth = width - countStrWidthCJK(str)
	if fillWidth < 0:
		fillWidth = 0

	if('l' == type):
		return str + fillChar * fillWidth
	elif('r' == type):
		return fillChar * fillWidth + str
	else:
		mt = fillWidth % 2
		si = fillWidth / 2
		return fillChar * si + str + fillChar * (si+mt)
