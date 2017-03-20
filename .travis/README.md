# Travis encrypted files

This directory contains a public/private keypair generated just for this repository.

The public key is a deploy key which has been added to the GitHub repo for push access.

The private key is encrypted using `travis encrypt-file` and then committed to this repo.

The decrypt commands are in `.travis.yml`. We only decrypt these files on the master
branch because people who have forked the repo don't have access to the
`$encrypted` environment variables.

## Trigger script

In `/trigger.sh` we use `$TRAVIS_TOKEN` to trigger downstream jobs - this
is the only way we can find that Travis can trigger another job.

In this case, the downstream jobs publish the frontend toolkit to npm
and RubyGems.

The [Travis settings](https://travis-ci.org/alphagov/govuk_frontend_toolkit/settings)
contains a Travis token that belongs to
[@alexmuller](https://github.com/alexmuller) - as far as we
can tell there's no way to generate one of these that isn't related to
a specific user. This token could be replaced with a generic bot account
if we created one.
