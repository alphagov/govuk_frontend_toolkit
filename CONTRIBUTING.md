# Contribution Guidelines

We welcome patches to the toolkit, as long as you follow these
guidelines:

## Indentation and whitespace

2-space, soft-tabs only. No trailing whitespace.

## Versioning

We use [Semantic Versioning](http://semver.org/).

## Releasing a new version 

1. Create a branch that proposes a new [version number](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/VERSION.txt) and update the [`CHANGELOG`](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/CHANGELOG.md). To see the commits to be summarised in the changelog since the last release, [compare the latest-release branch with master](https://github.com/alphagov/govuk_frontend_toolkit/compare/latest-release...master).
2. Open a Pull Request - here is a [good example](https://github.com/alphagov/govuk_frontend_toolkit/pull/396).
3. Once merged into master a new version will be built and [downstream jobs triggered by Travis CI](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/.travis.yml) for [govuk_frontend_toolkit_gem](https://github.com/alphagov/govuk_frontend_toolkit_gem) and [govuk_frontend_toolkit_npm](https://github.com/alphagov/govuk_frontend_toolkit_npm).

## Commit hygiene

Please see our [git style guide](https://github.com/alphagov/styleguides/blob/master/git.md)
which describes how we prefer git history and commit messages to read.
