import JiraApi from 'jira-client';
import {
  JIRA_HOST,
  JIRA_USER,
  JIRA_TOKEN,
  JIRA_PROJECT,
  JIRA_ISSUE_TYPE,
  GITHUB_REPOSITORY,
} from './config';

const TICKET_SUMMARY = `Deps: ${GITHUB_REPOSITORY}`;

const jira = new JiraApi({
  protocol: 'https',
  host: JIRA_HOST,
  username: JIRA_USER,
  password: JIRA_TOKEN,
  apiVersion: '2',
  strictSSL: true
});

export const findIssue = async () => {
  const jql = `
    reporter = "${JIRA_USER}"
    and project = ${JIRA_PROJECT}
    and statuscategory != done
    and issuetype = ${JIRA_ISSUE_TYPE}
    and summary ~ "${TICKET_SUMMARY}"
  `;
  const result = await jira.searchJira(jql, { fields: ['description'] });
  return result?.issues?.[0];
};

export const createIssue = (description: string) => {
  return jira.addNewIssue({
    fields: {
      summary: TICKET_SUMMARY,
      description,
      project: { key: JIRA_PROJECT },
      issuetype: { name: JIRA_ISSUE_TYPE }
    }
  });
};

export const updateIssue = (issueId: string, description: string) => {
  return jira.updateIssue(issueId, { fields: { description } });
};
