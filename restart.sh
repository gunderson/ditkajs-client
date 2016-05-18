#!/bin/sh

wait 1s
kill $1
echo Killed $1
echo Attempting to restart
npm start
