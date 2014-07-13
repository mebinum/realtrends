#!/usr/bin/env bash

git checkout master

cd ../

cd devops

sh deploy.sh heroku -v

echo -n "\nforcing a push to heroku"

git push heroku +heroku:master

git symbolic-ref HEAD refs/heads/master && git reset --mixed