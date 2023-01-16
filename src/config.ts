import * as core from '@actions/core';
import { SemverLevels, TSemverLevel } from './types';

export const JIRA_HOST = core.getInput('jira_host');
export const JIRA_USER = core.getInput('jira_user');
export const JIRA_TOKEN = core.getInput('jira_token');
export const JIRA_PROJECT = core.getInput('jira_project');
export const JIRA_ISSUE_TYPE = core.getInput('jira_issue_type');

export const LEVEL = core.getInput('level') as TSemverLevel;
export const IGNORE = core.getMultilineInput('ignore');

export const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
export const GITHUB_REF_NAME = process.env.GITHUB_REF_NAME;

if (!GITHUB_REPOSITORY) {
  throw new Error('GITHUB_REPOSITORY is empty');
}

if (!GITHUB_REF_NAME) {
  throw new Error('GITHUB_REF_NAME is empty');
}

if (!(LEVEL in SemverLevels)) {
  throw new Error(`Invalid level "${LEVEL}", valid values are: major,minor,patch`);
}
