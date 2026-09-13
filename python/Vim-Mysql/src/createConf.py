import pickle

out = open('conf.py','w')

conf = { 
	'b5mbeta'    : { 'host':"180.153.140.112", 'db':"b5m_develop", 'user':"b5m",  'passwd':"izene123", 'charset':'utf8'}, 
	'b5mstage'   : { 'host':"180.153.140.112", 'db':"b5m_stage",   'user':"b5m",  'passwd':"izene123", 'charset':'utf8'}, 
	'b5mb5m'   : { 'host':"180.153.140.112", 'db':"b5m_b5m",   'user':"b5m",  'passwd':"izene123", 'charset':'utf8'}, 
	'jadedungeon': { 'host':"localhost",       'db':"jadedungeon", 'user':"root", 'passwd':"p@ssw0rd", 'charset':'utf8'} 
}

pickle.dump(conf, out)

