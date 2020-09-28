# This script bootstrap the myoctocat-generator (OCTO) project
# It removes the related workflow afterwards

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/git-setup.sh
git_setup

git rm $DIR/../.github/workflows/bootstrap.yml
git commit -m "Removing bootstrapping workflow after bootstrap"

# This is the only bootstrapping action so far - setting the baseline tag
git push origin HEAD:refs/tags/baseline -f

git push origin HEAD:master
