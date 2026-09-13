#!/bin/bash
cd /home/jade/workspace/study/notes
jade-uml.sh code/xmpp-paper wiki_html/images/xmpp.paper png 1000x1000
cd /home/jade/workspace/scala/Jade-doc-tool
./build.sh -a
cd /home/jade/workspace/study/xmpp-paper
cp /home/jade/workspace/study/notes/wiki_html/images/xmpp.paper/* img
ant
