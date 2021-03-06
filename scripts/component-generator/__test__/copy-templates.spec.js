const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const globby = require('globby');
const utils = require('../src/utils');
const logger = require('../src/logger');
const copyTemplates = require('../src/copy-templates');

// Extracted from
// https://github.com/wix/yoshi/blob/master/packages/create-yoshi-app/src/getFilesInDir.js
const getDirSnapshot = absoulteDirPath => {
  const filesPaths = globby.sync(['**/*', '!node_modules'], {
    cwd: absoulteDirPath,
    dot: true,
    gitignore: true,
  });

  const files = {};

  filesPaths.forEach(filePath => {
    const content = fs.readFileSync(
      path.join(absoulteDirPath, filePath),
      'utf-8',
    );

    files[filePath] = content;
  });

  return files;
};

describe('copyTemplates', () => {
  let getDestinationPathSpy;
  let succesSpy;
  let tempDir;

  beforeEach(() => {
    tempDir = tempy.directory();

    getDestinationPathSpy = jest
      .spyOn(utils, 'getDestinationPath')
      .mockImplementation(p => path.join(tempDir, p));

    // Silent logs
    succesSpy = jest.spyOn(logger, 'success').mockImplementation(() => {});
  });

  afterEach(() => {
    getDestinationPathSpy.mockRestore();
    succesSpy.mockRestore();
  });

  it('should work as expected when description is provided', async () => {
    const answers = {
      ComponentName: 'MyNewComponent',
      description: "This is a very cool component, ya'll",
    };

    await copyTemplates(answers);

    expect(getDirSnapshot(tempDir)).toMatchSnapshot();
  });

  it('should work as expected when description is not provided', async () => {
    const answers = {
      ComponentName: 'MyNewComponent',
      description: undefined,
    };

    await copyTemplates(answers);

    expect(getDirSnapshot(tempDir)).toMatchSnapshot();
  });

  it('should work for test component', async () => {
    const answers = {
      ComponentName: 'MyTestComponent',
      description: undefined,
      testComponent: true,
    };

    await copyTemplates(answers);

    expect(getDirSnapshot(tempDir)).toMatchSnapshot();
  });
});
