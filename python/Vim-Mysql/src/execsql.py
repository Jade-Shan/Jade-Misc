# encoding=utf-8

import vim
import MySQLdb
import time
import sys
import pickle

import StringUtils


reload(sys)
exec("sys.setdefaultencoding('utf-8')");

def showResultRows(buf, titles, recs, isShowDetail=True):
	rows = []      # result rows
	maxcSize = []  # cume width for every rows 
	recIdx = 0     # index of rows

	# title row
	tl = []          # title row
	rows.append(tl)
	tl.append('RowNum')    # col of row num of title row
	maxcSize.append(6) # init width of row num
	for tit in titles:
		tl.append(str(tit[0]))
		currwidth = len(str(tit[0]))
		maxcSize.append(currwidth)

	# recoard rows
	for rec in recs:
		ccount = len(rec)
		row = []
		rowNum = str(recIdx+1)
		row.append(rowNum)
		mx = maxcSize[0]
		currwidth = len(rowNum)
		if(mx < currwidth):
			maxcSize[0] = currwidth
		for c in range(len(rec)):
			col = str(rec[c])
			col = col.replace('\t','\\t')
			col = col.replace('\n','\\n')

			# only show init 30 char of the field when need not detail
			if (isShowDetail == False) and (len(col)>30) :
				col = col[0:27]+"..."
			row.append(col)

			# countrow size
			currwidth = len(str(col))
			mx = maxcSize[c+1]
			if(mx < currwidth):
				maxcSize[c+1] = currwidth
		if(len(row)>0):
			rows.append(row)
		recIdx += 1

	# format rows to strings
	for row in rows:
		line = "| "
		for c in range(len(row)):
			line = line + StringUtils.justCJK(row[c],maxcSize[c],'l')  + ' | '
		buf.append(line)



def queryMysql(connCfg, sqlstr):
	try:
		conn = MySQLdb.connect(
				host    = connCfg['host'],
				db      = connCfg['db'],
				user    = connCfg['user'],
				passwd  = connCfg['passwd'],
				charset = connCfg['charset'] 
		)
		cursor = conn.cursor()
		cursor.execute(sqlstr)
		titl = cursor.description
		recs = cursor.fetchall()
		conn.commit()
		cursor.close()
		conn.close()

		# open new window
		if (recs!= None) and (len(recs)>0): 
			vim.command("split query-recs-"+str(time.time()))
			vim.current.buffer.append("return %d rows record. " % cursor.rowcount)
			vim.current.buffer.append(" --------------------------------------- ")
			outLines = []
			showResultRows(outLines, titl, recs)
			vim.current.buffer.append(outLines)
		else:
			updateResult = "update %d rows" % (cursor.rowcount)
#			print updateResult
	except MySQLdb.Error, e:
		errMessage = ("Error %d: %s" % (e.args[0], e.args[1]))
#		print errMessage



# load buffer text as sql query string
def loadSqlString():
	lines = [];
	for line in vim.current.buffer:
		lines.append(line)
	return "\n".join(lines)



# isShowDetail = False
#isShowDetail = vim.eval("0 > 0")
isShowDetail = vim.eval("g:sqldetail")

# database to connection
#connName = "jadedungeon"
connName = vim.eval("g:sqlconn")

# load dbconnection
connCfg= pickle.load(open('/opt/morganstudio/lib-python/vim-mysql/conf.py'))

sqlstr= loadSqlString()
queryMysql(connCfg[connName], sqlstr)

