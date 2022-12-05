# Dep Checker Action

Check dependencies, then create a Jira ticket

## Usage
Copy `github-action-example.yml` into your repo `.github/workflows/` folder.

Optionally change the schedule event
```yaml
on:
  schedule:
  - cron: '0 0 * * 0' # Every Sunday at 00:00
```

And that's it!  

`dep-checker` will keep you'r repo dependencies up-to-date, by creating a Jira ticket whenever a MAJOR update is available.

## Development

`cd` to a folder where there is a `package.json` file

Then run
```bash
npx ts-node <path to dep-checker/src>
```
