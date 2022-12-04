const JiraApi = require('jira-client');
const {
  JIRA_USER,
  JIRA_PROJECT,
  JIRA_ISSUE_TYPE,
  JIRA_TOKEN,
  GITHUB_REPOSITORY,
} = require('./constants');

if (!GITHUB_REPOSITORY) {
  throw new Error('GITHUB_REPOSITORY is empty');
}

if (!JIRA_TOKEN) {
  throw new Error('JIRA_TOKEN is empty');
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
  // Add a star (*) to the `summary` condition, due to a bug in Jira API
  // See https://community.atlassian.com/t5/Jira-Software-questions/JQL-Query-for-summary/qaq-p/1431215
  const jql = `
    reporter = "${JIRA_USER}"
    and project = ${JIRA_PROJECT}
    and statuscategory != done
    and issuetype = ${JIRA_ISSUE_TYPE}
    and summary ~ "${TICKET_SUMMARY}*"
  `;
  const result = await jira.searchJira(jql, { fields: ['description'] });
  return result?.issues?.[0];
}

const createIssue = (description) => {
  return jira.addNewIssue({
    fields: {
      summary: TICKET_SUMMARY,
      description,
      project: { key: JIRA_PROJECT },
      issuetype: { name: JIRA_ISSUE_TYPE }
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
