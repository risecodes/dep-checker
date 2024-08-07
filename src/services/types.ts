interface IJiraFields {
  attachment: unknown;
  comment: unknown;
  description: string;
  issuelinks: unknown;
  project: unknown;
  sub: unknown;
  summary: string;
  timetracking: unknown;
  updated: unknown;
  watcher: unknown;
  worklog: unknown;
}

export interface IJiraIssue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Partial<IJiraFields>;
}

export interface IJiraSearchParams {
  jql: string;
  startAt?: number;
  maxResults?: number;
  fields?: string[];
  expand?: string[];
}

export interface IJiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: IJiraIssue[];
}

export interface IJiraCreateParams {
  fields: {
    summary: string;
    description: string;
    project: { key: string };
    issuetype: { name: string };
    parent?: { key: string };
  };
}

export interface IJiraCreateResponse {
  id: string;
  key: string;
  self: string;
  transition: {
    status: number;
    errorCollection: unknown;
  };
}

export interface IJiraUpdateParams {
  fields: Partial<IJiraFields>;
}
