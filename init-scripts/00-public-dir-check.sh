#!/bin/sh

# initialization script, that checks if the public directory exists

if [ ! -d "/public" ]; then
  echo "#############################################"
  echo "#                                           #"
  echo "#                 ERROR                     #"
  echo "#       /public directory is missing!       #"
  echo "#  You probably forgot to bind your files.  #"
  echo "#                                           #"
  echo "#############################################"
  exit 1
fi

