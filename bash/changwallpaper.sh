#!/bin/bash
if [ -x /usr/bin/feh ] && [ -x /usr/bin/shuf ] && [ -d $HOME/Pictures/wallpaper ]; then
	# while true; do
	find $HOME/Pictures/wallpaper -type f -name '*' -print0 | shuf -n1 -z | xargs -0 feh --bg-scale
	#	sleep 20m
	# done
fi
