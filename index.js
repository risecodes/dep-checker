const getUpdates = require('./src/npm');
const { findIssue, createIssue, updateIssue } = require('./src/jira');


(async () => {

  // Check updates
  console.log('Checking NPM dependencies ...');
  const updates = await getUpdates();
  if (!updates.length) {
    console.log('Everything up to date!');
    return;
  }
  console.log(`Found updates: ${JSON.stringify(updates, null, 2)}`);

  // Constants
  const description = updates.map(({ package, deps }) => {
    const list = deps.map(({ name, wanted, latest }) => {
      return `- Bump ${name} from ${wanted} to ${latest}`;
    }).join('\n');
    return `*${package}*\n${list}`;
  }).join('\n\n');

  // Jira
  console.log('Searching for existing Jira ticket ...');
  const issue = await findIssue();
  if (issue) {
    console.log(`Found Jira ticket ${issue.key}!`);
    console.log('Ticket description:\n');
    console.log(`\t${issue.fields?.description?.replace(/\n/g, '\n\t')}\n`);
    console.log('End ticket description');
    if (issue.fields.description != description) {
      console.log('Updating description ...');
      await updateIssue(issue.id, description);
      console.log(`Ticket ${issue.key} updated successfully`)
    } else {
      console.log(`Leaving Jira ticket ${issue.key} unchanged`);
    }
  } else {
    console.log('No existing Jira ticket, creating a new one ...')
    const result = await createIssue(description);
    console.log(`Ticket ${result.key} created successfully`);
  }

})();
