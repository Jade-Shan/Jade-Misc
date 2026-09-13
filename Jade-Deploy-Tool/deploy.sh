#!/bin/bash

prgname='deploy.sh'
username='deploy'

uploadDir=/var/myapp/upload/patch
backupDir=$uploadDir/backup-$(date +%y-%m-%d_%H:%M:%S)
deployDir=/var/myapp/libs

help_msg=" MyApp FAT DEV Deploy Util          \n\n" 
help_msg="$help_msg\033[37;41m                                    \033[0m\n"
help_msg="$help_msg\033[37;41m *** WARNING: For DEV Env Only ***  \033[0m\n"
help_msg="$help_msg\033[37;41m                                    \033[0m\n"

declare -A module_names=(
	['a']='myapp-framework-itf.jar'
	['b']='myapp-framework-impl.jar'
	['c']='myapp-business-itf.jar'
	['d']='myapp-business-impl.jar')

# ========================================
#
# ========================================

declare -a module_deploy;

if [[ $# < 1 ]]; then
	echo "Usage: $prgname -h "
	exit 0;
fi

# delete old file before 30 days
# sudo su - $username -c "find $uploadDir -mtime +30 -name "*" -exec rm -Rf {} \;"

while getopts 'm:h' OPT; do
	case $OPT in
		m)
			echo "Selecting modules: "
			for i in `seq ${#OPTARG}`; do
				c="${OPTARG:$i-1:1}"
				m="${module_names[$c]}"
				if test "$m" == ""; then
					echo -e "\033[37;41m                                \033[0m";
					echo -e "\033[37;41m  ERROR: unknow module code: $c  \033[0m";
				else
					echo "    - mark for deploy : $c - $m";
					module_deploy=(${module_deploy[@]} "$m")
				fi
			done
			;;
		h)
			echo "==================================="
			echo -e "$help_msg"
			echo "==================================="
			echo "Select module to deploy: "
			echo "-----+--------------------------------------------"
			echo " key |             module                         "
			echo "-----+--------------------------------------------"
			for module_code in "${!module_names[@]}"; do
				echo "  $module_code  | ${module_names[$module_code]}";
			done
			echo "-----+--------------------------------------------"
			echo ""
			echo "Useage:"
			echo "    bash ./$prgname -m <key1>[<key2>...]"
			echo ""
			echo "Example:"
			echo "    bash ./$prgname -m abcd"
			exit 0;
			;;
		?)
			echo "Usage: bash ./$prgname -h "
			exit 0;
			;;
	esac
done

echo ""
echo "Stoping tomcat..."
# sudo service tomcat stop
echo "tomcat stoped"
echo ""

# sudo su - $username -c "mkdir -p $backupDir"
for jarName in ${module_deploy[@]};do
	echo " -- deploying module: $jarName "
	echo "    sudo su - $username -c \" mv $deployDir/$jarName $backupDir \""
	# sudo su - $username -c " mv $deployDir/$jarName $backupDir "
	echo "    sudo su - $username -c \" cp $uploadDir/$jarName $deployDir/$jarName \""
	# sudo su - $username -c " cp $uploadDir/$jarName $deployDir/$jarName "
done

echo ""
echo "starting tomcat..."
# sudo service tomcat start
echo "tomcat started"
echo ""

