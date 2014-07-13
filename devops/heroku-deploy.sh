#!/usr/bin/env bash

git checkout master

cd ../

#sh devops/deploy.sh heroku -v

git subtree push --prefix app origin heroku

echo -n "\nforcing a push to heroku"

git push heroku +heroku:master

git symbolic-ref HEAD refs/heads/master && git reset --mixed