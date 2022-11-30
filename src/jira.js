const JiraApi = require('jira-client');
const {
  JIRA_USER,
  JIRA_PROJECT,
  JIRA_ISSUE_TYPE,
  JIRA_TOKEN,
  GITHUB_REPOSITORY,
} = require('./constants');

if (!GITHUB_REPOSITORY) {
  throw new Error('Empty repository name');
}

if (!JIRA_TOKEN) {
  throw new Error('Empty jira token');
}

const TICKET_SUMMARY = `Deps - ${GITHUB_REPOSITORY}`;

const jira = new JiraApi({
  protocol: 'https',
  host: 'risecodes.atlassian.net',
  username: JIRA_USER,
  password: JIRA_TOKEN,
  apiVersion: '2',
  strictSSL: true
});

const findIssue = async () => {
  const jql = `
    reporter = "${JIRA_USER}"
    and project = ${JIRA_PROJECT}
    and statuscategory != done
    and issuetype = ${JIRA_ISSUE_TYPE}
    and summary ~ "${TICKET_SUMMARY}"
  `
  const result = await jira.searchJira(jql);
  return result?.issues?.[0];
}

const createIssue = (description) => {
  return jira.addNewIssue({
    fields: {
      summary: TICKET_SUMMARY,
      description,
      project: { key: PROJECT },
      issuetype: { name: ISSUE_TYPE }
    }
  });
}

const updateIssue = (issueId, description) => {
  return jira.updateIssue(issueId, { description });
}

module.exports = {
  findIssue,
  createIssue,
  updateIssue
};
