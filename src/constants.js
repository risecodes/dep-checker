module.exports = {
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
  JIRA_USER: process.env.JIRA_USER || 'search-service-user@risecodes.com',
  JIRA_TOKEN: process.env.JIRA_TOKEN,
  JIRA_PROJECT: process.env.JIRA_PROJECT || 'RIS',
  JIRA_ISSUE_TYPE: process.env.JIRA_ISSUE_TYPE || 'Story',
  IGNORE_FOLDERS: process.env.IGNORE_FOLDERS?.split(/\s+/) || [],
};
