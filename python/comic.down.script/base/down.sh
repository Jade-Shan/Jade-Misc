#!/bin/bash

for ((f=1;f<=100;f+=1)); 
do 
	mkdir `printf "%03d" $f`; 
	cp `printf "index.htm %03d" $f`; 
		for ((p=1;p<=50;p+=1)); 
		do 
			wget `printf "http://pic.tuku.cc:8899/300/天龙八部/卷%d/%03d.jpg -O %03d/%03d.jpg" $f $p $f $p`
		done
done
