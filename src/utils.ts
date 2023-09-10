import { AxiosError } from 'axios';
import * as core from '@actions/core';

export const printAxiosError = (error: AxiosError) => {
  const { method, url, baseURL, data } = error.response?.config || {};
  const responseData = error.response?.data;
  const errorObj = { url: `${baseURL}/${url}`, method, requestData: data, responseData };
  core.warning(JSON.stringify(errorObj, null, 2));
};
