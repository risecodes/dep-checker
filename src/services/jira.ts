import axios from 'axios';
import {
  JIRA_HOST,
  JIRA_USER,
  JIRA_TOKEN,
  JIRA_PROJECT,
  JIRA_ISSUE_TYPE,
  JIRA_EPIC_ID,
  GITHUB_REPOSITORY,
} from '../config';
import {
  IJiraCreateParams,
  IJiraCreateResponse,
  IJiraIssue,
  IJiraSearchParams,
  IJiraSearchResponse,
  IJiraUpdateParams
} from './types';

const TICKET_SUMMARY = `Deps: ${GITHUB_REPOSITORY}`;

const jiraClient = axios.create({
  baseURL: `https://${JIRA_HOST}/rest/api/2`,
  auth: {
    username: JIRA_USER,
    password: JIRA_TOKEN,
  },
});

export const findIssue = async (): Promise<IJiraIssue | undefined> => {
  const searchParams: IJiraSearchParams = {
    fields: ['description', 'summary'],
    jql: `
      reporter = "${JIRA_USER}"
      and project = ${JIRA_PROJECT}
      and statuscategory != done
      and issuetype = ${JIRA_ISSUE_TYPE}
      and summary ~ "${TICKET_SUMMARY}"
    `,
  };

  const { data } = await jiraClient<IJiraSearchResponse>({
    method: 'POST',
    url: '/search',
    data: searchParams,
  });

  // Jira doesn't support exact matching on `summary` field, so do the match here
  // TODO: find a better way to manage issue by a very uniq id per project
  const issue = data.issues?.find((result) => result.fields.summary === TICKET_SUMMARY);
  return issue;
};

export const createIssue = async (description: string): Promise<IJiraCreateResponse> => {
  const issue: IJiraCreateParams = {
    summary: TICKET_SUMMARY,
    description,
    project: { key: JIRA_PROJECT },
    issuetype: { name: JIRA_ISSUE_TYPE }
  };

  if (JIRA_EPIC_ID) issue.parent = { key: JIRA_EPIC_ID };

  const { data } = await jiraClient<IJiraCreateResponse>({
    method: 'POST',
    url: '/issue',
    data: issue
  });
  return data;
};

export const updateIssue = (issueId: string, description: string) => {
  const updateParams: IJiraUpdateParams = {
    fields: { description }
  };

  return jiraClient({
    method: 'PUT',
    url: `/issue/${issueId}`,
    data: updateParams
  });
};
