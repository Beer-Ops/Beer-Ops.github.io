#!/usr/bin/env bash

# This script
# - updates the demo to the baseline repository again
# - lets you catch up your demo with the latest features from baseline
# - only supports non-issue/action triggered mode
#   as GITHUB_TOKEN PATs provided by Actions cannot access other repositories
# - if you are using the actions driven demo mode, recreate your demo repo
#   in case you like to benefit from the latest features


if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <customer name>" >&2
  exit 1
fi
CUSTOMER=$1

# Getting the original content
git remote add baseline git@github.com:octodemo/octodemo.github.io.git
git fetch baseline

# Resting our HEAD to golden repository
git checkout master
git reset --hard baseline/master

# Updating master and our baseline to revert to later on
git push origin master:refs/tags/baseline -f
git push origin master -f

bash ./scripts/reset-demo.sh $CUSTOMER
