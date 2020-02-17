import fs from 'fs';
import path from 'path';

const getDirFiles = (dirname, filename) => {
  const basename = path.basename(filename);
  const files = {};
  fs.readdirSync(dirname)
    .filter(
      file =>
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js',
    )
    .forEach(fileName => {
      const file = require(path.join(dirname, fileName));
      files[fileName.slice(0, -3)] = file.default || file;
    });

  return files;
};

export default getDirFiles;
