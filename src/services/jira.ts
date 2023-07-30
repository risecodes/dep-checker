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
  IJiraCreateRequest,
  IJiraCreateResponse,
  IJiraSearchRequest,
  IJiraSearchResponse,
  IJiraUpdateInput
} from './types';

const TICKET_SUMMARY = `Deps: ${GITHUB_REPOSITORY}`;

const jiraRequest = async <D, R = unknown>(pathname: string, data: D) => {
  const resp = await axios<R>({
    method: 'POST',
    baseURL: `https://${JIRA_HOST}/rest/api/2`,
    url: pathname,
    auth: {
      username: JIRA_USER,
      password: JIRA_TOKEN,
    },
    data: data
  });
  return resp.data;
};

export const findIssue = async () => {
  const searchParams = {
    fields: ['description', 'summary'],
    jql: `
      reporter = "${JIRA_USER}"
      and project = ${JIRA_PROJECT}
      and statuscategory != done
      and issuetype = ${JIRA_ISSUE_TYPE}
      and summary ~ "${TICKET_SUMMARY}"
    `,
  };

  const result = await jiraRequest<IJiraSearchRequest, IJiraSearchResponse>('/search', searchParams);

  // Jira doesn't support exact matching on `summary` field, so do the match here
  // TODO: find a better way to manage issue by a very uniq id per project
  const issue = result.issues?.find((result) => result.fields.summary === TICKET_SUMMARY);
  return issue;
};

export const createIssue = (description: string) => {
  const issue: IJiraCreateRequest = {
    summary: TICKET_SUMMARY,
    description,
    project: { key: JIRA_PROJECT },
    issuetype: { name: JIRA_ISSUE_TYPE }
  };

  if (JIRA_EPIC_ID) issue.parent = { key: JIRA_EPIC_ID };

  return jiraRequest<IJiraCreateRequest, IJiraCreateResponse>('/issue', issue);
};

export const updateIssue = (issueId: string, description: string) => {
  return jiraRequest<IJiraUpdateInput>(`/issue/${issueId}`, { fields: { description } });
};
