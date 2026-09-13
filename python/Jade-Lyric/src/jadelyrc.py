# coding=utf-8

import re
import os
import time

import playmoc



lyrcFileFolder= '/media/file_data/archived/music/lyrics/'
lyrcFileNameFmt = '%s%s - %s.lrc'



oldSong = None
oldLyrc = None
oldTime = None

songLyrc = None



def loadLyrcFile(info_dic) :
	lyrcLines = None
	fileName = lyrcFileNameFmt % (lyrcFileFolder, info_dic['Artist'], info_dic['SongTitle'])
	if os.path.exists(fileName):
		lyrcFile = open(fileName,'r')
		try:
			lyrcLines = lyrcFile.readlines()
			tmp = list(map(lambda x: x.replace("\r", ""), lyrcLines))
			lyrcLines = list(map(lambda x: x.replace("\n", ""), tmp))
		except:
			pass
		finally:
			lyrcFile.close()
	return lyrcLines


def loadLines(currTime, songLyrc) :
#	reStr = r'\['+ currTime +r'.*\](\[.*\])*(.*)'
#	p = re.compile(reStr)
	lines = []
	for line in songLyrc:
		if line.find(currTime) > -1 :
			line = line.split("]")[-1]
			lines.append(line)
#		result = p.findall(line)
#		if len(result) > 0 and len(result[0]) >2 :
#			print result[0][1]
	if len(lines) > 0 :
		return '\n'.join(lines)
	else :
		return None



'''
	load the lyric for current song
'''
def loadLyric() :
	global oldSong
	global oldLyrc
	global oldTime
	global songLyrc
	info_dic = playmoc.getPlayMOC()
	if None == info_dic \
			or None == info_dic['CurrentTime'] \
			or None == info_dic['Artist'] \
			or None == info_dic['SongTitle'] :
		print 'play state not found'
	else :
		# if change to new song
		currSong = info_dic['Artist'] + '.-.' + info_dic['SongTitle']
		if currSong == oldSong and oldLyrc == oldSong :
			pass # already the last lyric
		else : # load new lyric
			oldSong = currSong
			oldLyrc = currSong
			print '\n=====\nNow playing：' + currSong
			songLyrc = loadLyrcFile (info_dic)
		# if reach new lines
		currTime = info_dic['CurrentTime']
		if oldTime != currTime and None != songLyrc:
			oldTime = currTime
			currLyrcLines = loadLines(currTime, songLyrc)
			if None != currLyrcLines :
				print currLyrcLines

if __name__ == "__main__" :
	while True :
		try:
			loadLyric()
		except:
			pass
		time.sleep(0.1)
