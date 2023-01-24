import DepChecker from '..';

const fakeModule = {
  name: 'fake',
  wanted: '0.0.0',
  latest: '1.0.0'
};


const mockGetUpdates = jest.fn(() => ([fakeModule]));

describe('DepChecker', () => {
  const testChecker = new DepChecker({
    packageFile: 'package',
  }, mockGetUpdates);

  describe('getAvailableUpdates', () => {
    it('Returning value', () => {
      const updates = testChecker.getAvailableUpdates();
      expect(updates[0].modules[0]).toEqual(fakeModule);
    });
  });
});
