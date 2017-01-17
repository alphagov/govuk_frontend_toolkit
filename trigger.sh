#!/bin/bash

PAYLOAD='{
"request": {
  "branch": "master"
}}'

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Travis-API-Version: 3" \
  -H "Authorization: token $TRAVIS_TOKEN" \
  -d "$PAYLOAD" \
  https://api.travis-ci.org/repo/alphagov%2Fgovuk_frontend_toolkit_gem/requests

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Travis-API-Version: 3" \
  -H "Authorization: token $TRAVIS_TOKEN" \
  -d "$PAYLOAD" \
  https://api.travis-ci.org/repo/alphagov%2Fgovuk_frontend_toolkit_npm/requests
