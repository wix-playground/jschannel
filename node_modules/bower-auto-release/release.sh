#!/bin/bash
cd /tmp
rm -rf bower_component
git clone $GIT_REMOTE_URL bower_component
cd bower_component
git checkout bower-component
git checkout -b bower-component

shopt -s extglob dotglob
rm -rf !(.git)
cp -r $2/!(.git) .
grep -ve "^\(dist\|/.*\.js\)$" .gitignore > .gitignore.new
mv -f .gitignore.new .gitignore

git add --all .
git commit -m"bower version $1"
git tag $1 -a -m"bower version $1"
git push origin bower-component --follow-tags
