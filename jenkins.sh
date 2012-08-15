#!/bin/sh
set -e
rm -f Gemfile.lock
bundle install --path "${HOME}/bundles/${JOB_NAME}"
bundle exec rake
bundle exec rake publish_gem
