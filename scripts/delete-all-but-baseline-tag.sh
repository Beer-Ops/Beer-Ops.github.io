#!/bin/bash

# Script to delete all tags of the repository but the baseline tag
#

GITHUB_TOKEN=$GPR_PAT
REPO_OWNER=$1
REPO_NAME=$2

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <REPO_OWNER> <REPO_NAME>" >&2
  exit 1
fi

graphqlJson() {
  local query="$1"; shift
  curl -s -H "Authorization: bearer $GITHUB_TOKEN" -X POST -H "Accept: application/vnd.github.v3+json" -d '{"query":"'"$query"'"}' 'https://api.github.com/graphql'
}

graphqlDelete() {
    local query="$1"; shift

    curl -s -H "Accept: application/vnd.github.package-deletes-preview+json" -H "Authorization: bearer $GITHUB_TOKEN" -X POST -d '{"query":"'"$query"'"}' 'https://api.github.com/graphql'
}

deleteTag() {
    TAG_ID="$1"
    local query="$(cat <<EOF | sed 's/"/\\"/g' | tr '\n\r' '  '
mutation {
    deleteRef(
      input:{refId:"$TAG_ID"}
    )
    { clientMutationId }
}

EOF
)"

  RESPONSE=$(graphqlDelete "$query")
  echo "$RESPONSE"
}

baselineTag () {
  local query="$(cat <<EOF | sed 's/"/\\"/g' | tr '\n\r' '  '
  query {
    repository(name: "$REPO_NAME", owner: "$REPO_OWNER") {
      id
      name
      ref(qualifiedName:"refs/tags/baseline") {
        id
        name
      }
    }
  }

EOF
)"
  BASELINE_TAG_ID=$(graphqlJson "$query" | jq -r '.data.repository.ref.id')
}

listTags() {

  local query="$(cat <<EOF | sed 's/"/\\"/g' | tr '\n\r' '  '
  query {
    repository(name: "$REPO_NAME", owner: "$REPO_OWNER") {
      id
      name
      refs(first: 100, refPrefix:"refs/tags/") {
        nodes {
          id
          name
        }
      }
    }
  }

EOF
)"
  ID_LIST=$(graphqlJson "$query" | jq -r '.data.repository.refs.nodes[].id')
}

purgeTags() {
  for ID in $ID_LIST
  do
    if [ "$BASELINE_TAG_ID" != "$ID" ]; then
      echo -e "Purging tag with ID: '$ID' ..."
      deleteTag $ID;
    fi
  done
}

baselineTag
listTags
purgeTags
