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

## Special Action Envs
| Name | Description | Default |
| --- | --- | --- |
| `GITHUB_REPOSITORY` | Internal GH Action env | `${owner}/${repository}` |
| `JIRA_USER` | User email used to login | `search-service-user@risecodes.com` |
| `JIRA_TOKEN` | User token | - |
| `JIRA_PROJECT` | Project to create tickets | `RIS` |
| `JIRA_ISSUE_TYPE` | Ticket type | `Story` |
| `IGNORE_FOLDERS` | Folders to be ignored | `node_modules` |
| `VERSION` | `dep-checker` version | `main` |

## Development

`cd` to a folder where there is a `package.json` file

Then run
```bash
GITHUB_REPOSITORY=<online-applications/repo> JIRA_TOKEN=<token> npx ts-node <path/to/dep-checker/src>
```
