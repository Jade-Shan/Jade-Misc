# coding=utf-8

import os

'''
format of "mocp -i" is:
State: PLAY
File: /media/file_data/archived/music/film.ost/Danny.Elfman.-.2005.[Corpse.Bride]/flac/04.Into the Forest.flac
Title: 4 Danny Elfman - Into the Forest (Corpse Bride)
Artist: Danny Elfman
SongTitle: Into the Forest
Album: Corpse Bride
TotalTime: 04:35
TimeLeft: 00:40
TotalSec: 275
CurrentTime: 03:55
CurrentSec: 235
Bitrate: 644kbps
AvgBitrate: 705kbps
Rate: 44kHz
'''

def getPlayMOC() :
	info_dic = None
	try:
		info = os.popen("mocp -i").readlines()
		info_dic = dict(map(lambda x: x.replace("\n", "").split(": "), info))
	except:
		pass
	return info_dic

if __name__ == '__main__' :
	print getPlayMOC()


