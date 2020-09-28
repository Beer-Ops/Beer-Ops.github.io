#!/usr/bin/env bash

# This script:
# - takes the name of the customer to demo for as first parameter
# - if provided a second parameter (issue number), goes in non-interactive mode

# In non-interactive mode:
# - comments on the provided issue how to create a pull request
# - resets master branch to refs/tags/baseline
# - closes all open issues
# - creates a new issue describing the development task


# In interactive mode:
# - disables branch protection on master if present
# - resets master branch to refs/tags/baseline
# - enables branch protection on master if it was present
# - closes all open issues

# Required environment variables (both modes)
# OCTO_ORG organization that holds the octocat generator repository
# OCTO_REPO octocat generator repo name
# GITHUB_COM_TOKEN PAT with write access to the OCTO_REPO
# OCTO_UX_TOKEN PAT with issue commenting access to the OCTO_REPO



if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <customer name> [<issue number that triggered this>]" >&2
  exit 1
fi
CUSTOMER=$1
INTERACTIVE=true

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/git-setup.sh

if [ "$#" -gt 1 ]; then
  INTERACTIVE=false
  TRIGGERED_ISSUE=$2
  git_setup
fi


# Fail if no token
: ${GITHUB_COM_TOKEN?"Please set environment variable GITHUB_COM_TOKEN to the GitHub access token"}
: ${OCTO_ORG?"Please set environment variable OCTO_ORG to your GitHub org"}
: ${OCTO_REPO?"Please set environment variable OCTO_REPO to your GitHub repo"}
: ${OCTO_UX_TOKEN?"Please set environment variable OCTO_UX_TOKEN to a GitHub access token"}

echo "OCTO-ORG : $OCTO_ORG"
echo "OCTO-REPO : $OCTO_REPO"

echo "Re-setting Demo"

# Actions token do not have the scope to change protected branches settings
# Only reset branch protection in interactive mode
if [ "$INTERACTIVE" = true ]; then
  # Check if master branch is protected
  BRANCHES_STATUS_CODE=$(curl -I -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/branches/master/protection -s -o /dev/null -w %{http_code})

  if [ $BRANCHES_STATUS_CODE -ne "404" ] ; then

      echo "Master is protected: disabling protection"

      # Read required status currently activated on master branch
      CONTEXTS=$(curl -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/branches/master/protection/required_status_checks/contexts)

      # Remove new lines from $CONTEXTS
      CONTEXTS=$(echo $CONTEXTS|tr -d '\n')

      # Disabling protected branches otherwise force push fails (when available in Enterprise)
      curl -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" -H "Content-type: application/json" -X DELETE https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/branches/master/protection

  else
    echo "Master is not protected"
  fi
fi

# Force push HEAD to baseline
echo "Reverting master to baseline tag"
git fetch origin --tags --force
git checkout master
git reset --hard baseline
git push origin baseline:master -f


if [ "$INTERACTIVE" = true ]; then
  if [ "$BRANCHES_STATUS_CODE" -ne 404 ] ; then

      echo "Re-enabling protected branches as before: $CONTEXTS"

      # Get the new JSON based on the protected.json template and run the re-enable API
      sed -e "s|CONTEXTS_PLACEHOLDER|$CONTEXTS|g" scripts/protected.json | curl -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" -H "Content-type: application/json" -X PUT https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/branches/master/protection -d @-
  fi
fi



function close_issue () {
  curl -s -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" -H "Content-type: application/json" -X PATCH -d '{"state": "closed"}' https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/issues/$1
}

echo "Closing existing issues"

for issue_number in $(curl -s -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" "https://api.github.com/search/issues?q=state:open+repo:$OCTO_ORG/$OCTO_REPO+type:issue&sort=created&order=asc" | jq -r '.items[].number')
do
  echo "Closing issue with number: $issue_number"
  close_issue $issue_number
done


echo "Opening template issue"

# Replace customer customer placeholder
sed -i.bak -e "s|CUSTOMER|$CUSTOMER|g" $DIR/issues/message1.json
rm $DIR/issues/message1.json.bak

RESPONSE=`curl -H "Authorization: Token $OCTO_UX_TOKEN" -H "Accept: application/json" -H "Content-type: application/json" -X POST -d @$DIR/issues/message1.json https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/issues`

ISSUE_NUMBER=$(echo $RESPONSE | jq .number)

if [[ "$ISSUE_NUMBER" == "null" ]]; then 
  echo -e "\033[1;31m ERROR CREATING ISSUE: $(echo $RESPONSE | jq .message) \033[0m"
else
  echo "Issue created. Number=$ISSUE_NUMBER"
fi

curl -s -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" -H "Content-type: application/json" -X POST -d @$DIR/issues/message2.json https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/issues/$ISSUE_NUMBER/comments

if [ "$INTERACTIVE" = false ]; then
  cat <<- EOF > $DIR/issues/demo-reset.json
  {
    "body": "Hey @${GITHUB_ACTOR}, we have reset your demo for customer $1 and created an issue #${ISSUE_NUMBER} with an idea what to do :tada:.\n
    If you like to follow the demo setup workflows, click [here](https://github.com/${OCTO_ORG}/${OCTO_REPO}/commit/${GITHUB_SHA}/checks) for progress on the builds, click [there](https://github.com/${OCTO_ORG}/${OCTO_REPO}/actions/)."
  }
EOF

  curl -s -H "Authorization: Token $GITHUB_COM_TOKEN" -H "Accept: application/json" -H "Content-type: application/json" -X POST -d @$DIR/issues/demo-reset.json https://api.github.com/repos/${OCTO_ORG}/${OCTO_REPO}/issues/$TRIGGERED_ISSUE/comments
fi
