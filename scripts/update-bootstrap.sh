#!/bin/sh

GIST_ID=3e1f4ddb0adda0b12a6ea213840b58fd

echo "Step 1: Publishing configuration to Gist"
gist --update $GIST_ID --filename config.json .bootstrap.json
echo

echo "Step 2: Opening configuration on http://getbootstrap.com/customize/"
echo "Please, press any key when you are ready to download Bootstrap."
echo "After you'll download Bootstrap, please, return to your terminal."
read -n 1
open http://getbootstrap.com/customize/?id=$GIST_ID#download
echo

echo "Step 3: Extracting archive"
echo "Please, press any key when you are ready."
read -n 1
ARCHIVE_FILE=~/Downloads/bootstrap.zip
unzip $ARCHIVE_FILE -d public/bootstrap
rm -f $ARCHIVE_FILE
