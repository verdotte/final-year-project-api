import getDirFiles from '../../helpers/getDirFiles';

jest.mock('fs', () => ({
  readdirSync: jest.fn(() => ['getDirFiles']),
}));

describe('getDirFiles()', () => {
  afterAll(() => {
    jest.clearAll();
  });

  test('should return a string', () => {
    const files = getDirFiles('current', 'getDirFiles');
    expect(files).toBeDefined();
  });
});
