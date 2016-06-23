#!/bin/bash
set -e

bundle install --path "${HOME}/bundles/${JOB_NAME}"
npm install
npm test

# Create a new tag if the version file has been updated and a tag for that
# version doesn't already exist

# Are we on master branch, we shouldn't push tags for version bump branches
MASTER_SHA=`git rev-parse origin/master`
HEAD_SHA=`git rev-parse HEAD`
if [ "$MASTER_SHA" == "$HEAD_SHA" ]; then
  # get the version from the version file
  VERSION_TAG="v`cat VERSION.txt`"

  # check to make sure the tag doesn't already exist
  if ! git rev-parse $VERSION_TAG >/dev/null 2>&1; then
    echo "Creating new tag: $VERSION_TAG"
    git tag $VERSION_TAG
    git push origin $VERSION_TAG

    # Alias branch for the most recently released tag, for easier diffing
    git push -f origin master:latest-release
  fi
fi
