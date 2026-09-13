#!/bin/bash

# jade-uml.sh code/xmpp-paper wiki_html/images/xmpp.paper/ png 1200x1200

if [ $1 ]; then
	src="$1/"
else
	src="./"
fi

if [ $2 ]; then
	des="$2/"
else
	des="./"
fi

if [ $3 ]; then
	filetype=$3
else
	filetype=png
fi

if [ $4 ]; then
	size=" --bitmap-size $size$4 "
else
	size=" "
fi

for i in $src/*.java
do
	if [ -f "$i" ]; then
		file=$i
		echo $file
		item=${file##*/}
		item=${item%.*}
		rm $des$item.$filetype
		java -classpath "$UMLGRAPH_HOME/lib/UmlGraph.jar:$JAVA_HOME/lib/tools.jar" \
		org.umlgraph.doclet.UmlGraph -private -output - $file |
		dot -T$filetype -o$des$item.$filetype
	fi
done

cp $UMLGRAPH_HOME/lib/sequence.pic .
for i in $src/*.pic
do
	if [ -f "$i" ]; then
		file=$i
		echo $file
		item=${file##*/}
		item=${item%.*}
		if [ $item = "sequence" ]; then
			echo $item
		else
			rm $des$item.$filetype
			pic2plot $size  -T$filetype $file > $des$item.$filetype
		fi
	fi
done
rm sequence.pic
