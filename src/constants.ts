export const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
export const JIRA_USER = process.env.JIRA_USER || 'search-service-user@risecodes.com';
export const JIRA_TOKEN = process.env.JIRA_TOKEN;
export const JIRA_PROJECT = process.env.JIRA_PROJECT || 'RIS';
export const JIRA_ISSUE_TYPE = process.env.JIRA_ISSUE_TYPE || 'Story';
export const IGNORE_FOLDERS = process.env.IGNORE_FOLDERS?.split(/\s+/) || ['node_modules'];
