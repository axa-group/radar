# How to Contribute

## Reporting Issues

Should you run into issues with the project, please don't hesitate to let us know by
[filing an issue](https://github.com/AxaGuilDEv/radar/issues/new).

Pull requests containing only failing tests demonstrating the issue are welcomed
and this also helps ensure that your issue won't regress in the future once it's fixed.

## Pull Requests

We accept [pull requests](https://github.com/AxaGuilDEv/radar/pull/new/master)!

Generally we like to see pull requests that

- Maintain the existing code style
- Are focused on a single change (i.e. avoid large refactoring or style adjustments in untouched code if not the primary goal of the pull request)
- Have [good commit messages](https://chris.beams.io/posts/git-commit/)
- Have tests
- Don't decrease the current code coverage

## Running tests

### Frontend

Run frontend tests with `sh npm run test` in the src/RadarTechno/ClientApp folder.

### Backend

Run backend tests with `sh dotnet test`.
