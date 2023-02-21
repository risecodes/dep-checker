import JiraApi from 'jira-client';
import {
  JIRA_HOST,
  JIRA_USER,
  JIRA_TOKEN,
  JIRA_PROJECT,
  JIRA_ISSUE_TYPE,
  JIRA_EPIC_ID,
  GITHUB_REPOSITORY,
} from '../config';
import { IJiraTicket, IJiraTicketFields } from '../types';

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
  const result = await jira.searchJira(jql, { fields: ['description', 'summary'] });

  // Jira doesn't support exact matching on `summary` field, so do the match here
  const issue = result?.issues?.find((result: IJiraTicket) => result.fields.summary === TICKET_SUMMARY);
  return issue;
};

export const createIssue = (description: string) => {
  const fields: IJiraTicketFields = {
    summary: TICKET_SUMMARY,
    description,
    project: { key: JIRA_PROJECT },
    issuetype: { name: JIRA_ISSUE_TYPE }
  };

  if (JIRA_EPIC_ID) fields.parent = { key: JIRA_EPIC_ID };

  return jira.addNewIssue({ fields });
};

export const updateIssue = (issueId: string, description: string) => {
  return jira.updateIssue(issueId, { fields: { description } });
};
