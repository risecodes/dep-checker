import * as core from '@actions/core';
import { findIssue, createIssue, updateIssue } from '../services/jira';
import { GITHUB_REF_NAME, GITHUB_REPOSITORY } from '../config';
import { IModuleUpdate, IPackageUpdates } from '../types';


const getGithubLink = (packagePath: string) => {
  return `https://github.com/${GITHUB_REPOSITORY}/blob/${GITHUB_REF_NAME}/${packagePath}`;
};

const getModuleDescription = (modules: IModuleUpdate[]) => {
  return modules.map(({ name, wanted, latest }) => {
    return `- Bump {{${name}}} from *${wanted}* to *${latest}*`;
  }).join('\n');
};

const getReportDescription = (updates: IPackageUpdates[]) => {
  return updates.map(({ packagePath, modules }) => {
    const link = getGithubLink(packagePath);
    const list = getModuleDescription(modules);
    return `{{${packagePath}}} ([link|${link}])\n${list}`;
  }).join('\n\n');
};

const sendReport = async (updates: IPackageUpdates[]) => {
  const reportDescription = getReportDescription(updates);
  const existingIssue = await findIssue();
  if (!existingIssue) {
    const result = await createIssue(reportDescription);
    core.info(`Ticket ${result.key} created successfully`);
  } else {
    if (existingIssue.fields.description !== reportDescription) {
      core.info('Updating description ...');
      await updateIssue(existingIssue.id, reportDescription);
      core.info(`Ticket ${existingIssue.key} updated successfully`);
    } else {
      core.info(`Leaving Jira ticket ${existingIssue.key} unchanged`);
    }
  }
};

export default sendReport;
