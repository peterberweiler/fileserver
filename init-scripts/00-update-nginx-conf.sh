#!/bin/sh

# run indexserver initialization function
# updates nginx conf

node /app/main.js --init

if [ $? -ne 0 ]; then
  echo "#############################################"
  echo "#                                           #"
  echo "#                 ERROR                     #"
  echo "#        updating nginx conf failed         #" 
  echo "#                                           #"
  echo "#############################################"
  exit 1
fi

