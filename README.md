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

`cd` to a folder which contains package management file, like `package.json` / `go.mod`

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

## Deployment

### CI/CD
There is no any CI/CD in the project, as the build version, which is created on every commit (via `precommit` hook) is included in git

### Versioning
Projects using dep-checker refer a specific version by it's git tag.  
For example
```yaml
online-applications/dep-checker@v1.0.8 # Refers to version v1.0.8
```

We also support a `latest` tag by putting just the major version.  
For example
```yaml
online-applications/dep-checker@v1 # Refers to the latest v1.x version
```

So, each time you increase a minor/patch version, the major git tag should be overriden to refer the latest version

> Note:  
> There is no any auto update for those tags, so you MUST update/create the git tag by yourself

### Git Tag
Befoer push to `master` branch, create a new tag for your version
```bash
git tag <new version>

# Example:
git tag v1.0.8
```

Override the major tag
```bash
git tag -f <major>

# Example:
git tag -f v1
```

Push your new tags along with commits
```bash
git push
git push --tags
```
