import { PACKAGE_FILE } from './const';

jest.mock('@actions/core', () => {
  const original = jest.requireActual('@actions/core');
  return {
    ...original,
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  };
});

jest.mock('glob', () => {
  const original = jest.requireActual('glob');
  return {
    ...original,
    glob: {
      ...original.glob,
      sync: jest.fn(() => [PACKAGE_FILE])
    }
  };
});

process.env.GITHUB_REPOSITORY = 'fake-owner/fake-repo';
process.env.GITHUB_REF_NAME = 'test';
process.env.INPUT_LEVEL = 'patch';
