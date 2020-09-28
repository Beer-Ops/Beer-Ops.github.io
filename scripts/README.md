# Octodemo Generator scripts

This folder contains several useful scripts. Please refer to the source code of each individual file to find out more about their usage.

First step is to fork this repository to an organization or personal repository. Once that's done, please visit that fork and ensure that issues are enabled. Next, run the following scripts

```bash
./scripts/update-demo.sh <customer name>
./scripts/code-feature.sh <customer name>
```

## Requirements

The following environment variables need to be exported for the scripts to work:

```
export GITHUB_COM_TOKEN="..."
export OCTO_UX_TOKEN="..."
export OCTO_ORG="PizzaHub"
export OCTO_REPO="pizzahub.github.io"
```

Create the personal access token for `GITHUB_COM_TOKEN` and `OCTO_UX_TOKEN` from your [developer settings](https://github.com/settings/tokens). If you dont want to set these every time, they can be set in your `.bash_profile` and loaded into your shell by opening a brand new terminal window.

Also make sure you have `jq` installed for nicer output on the CLI (e.g. `brew install jq` on macOS).
