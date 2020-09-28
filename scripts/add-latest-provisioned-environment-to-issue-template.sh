#!/usr/bin/env bash
# This script takes the following parameters:
#  cloud, customer, provisioned environment

# It will update/create a config.yml file as additional issue template
# linking to the latest provisioned environment

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/git-setup.sh
BRANCH=master

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <customer name> <cloud name> <provision url>" >&2
  exit 1
fi
CUSTOMER=$1
CLOUD=$2
URL=$3

git_setup

cp -rf $DIR/resources/.github/ISSUE_TEMPLATE/config.yml $DIR/../.github/ISSUE_TEMPLATE
# Add customer name to welcome sign
sed -i.bak -e "s|CUSTOMER|$CUSTOMER|g" .github/ISSUE_TEMPLATE/config.yml
sed -i.bak -e "s|URL|$URL|g" .github/ISSUE_TEMPLATE/config.yml
sed -i.bak -e "s|CLOUD|$CLOUD|g" .github/ISSUE_TEMPLATE/config.yml
rm .github/ISSUE_TEMPLATE/config.yml.bak

git add .github/ISSUE_TEMPLATE/config.yml
git commit -m "Last provisioned environment for $CUSTOMER"

git push origin HEAD:master
