# Dep Checker Action

Check dependencies, then create a Jira ticket

## Usage
Copy `github-action-example.yml` into your repo `.github/workflows/` folder.

Set the desired schedule time
```yaml
on:
  schedule:
  - cron: '0 0 * * 0' # Every Sunday at 00:00
```

Set all the action parameters
```yaml
# Required parameters
jira_host: your-domain.atlassian.net # Jira site domain
jira_user: example@your-domain.com # Jira user email
jira_token: ${{ secrets.jira_token }} # Jira service token
jira_project: PRJ # Project name
jira_issue_type: Story # One of Story, Bug etc.
jira_epic_id: EPC-123 # Epic ID

# Optional parameters
level: major # Semver level to consider as an update. Value maybe one of major|minor|patch, default: "major"
npmrc: "@private-scope:registry=https://private.registry.com/" # Special config for npm package system, default: ""
ignore: | # Folders to ignore, default: ""
  public/**
  vendor/**
```

`dep-checker` will help you keep you'r dependencies up-to-date, by creating a Jira ticket whenever an update is available.

## Supported package systems

- **npm** - `package.json`
- **golang** - `go.mod`

## Development

`cd` to a folder which contains package management file, like `package.json`/`go.mod`

Then run
```sh
GITHUB_REPOSITORY=<github-org/github-repo> \
INPUT_JIRA_HOST=<jira_host> \
INPUT_JIRA_USER=<jira_user> \
INPUT_JIRA_TOKEN=<jira_token> \
INPUT_JIRA_PROJECT=<jira_project> \
INPUT_JIRA_ISSUE_TYPE=<jira_issue_type> \
INPUT_JIRA_EPIC_ID=<jira_epic_id> \
INPUT_LEVEL=<level> \
npx ts-node <path/to/dep-checker/src>
```
