import fs from 'fs';
import mkdirp from 'mkdirp';
import pathlib from 'path';

const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
});

const makeDir = (name) => new Promise((resolve, reject) => {
  mkdirp(name, err => (err ? reject(err) : resolve()));
});

const readFolderNames = (path) =>
  new Promise((rev, rej) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        rej(err);
      }
      const dirs = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          dirs.push(file);
        }
      }
      rev(dirs);
    });
  });

const readFolderNamesSync = (path) => {
  const files = fs.readdirSync(path);

  const dirs = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = `${path}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      dirs.push(file);
    }
  }
  return dirs;
};

const mkdirpR = (dir) => {
  const dirname = pathlib.dirname(dir);

  if (!fs.existsSync(dirname)) {
    mkdirp(dirname);
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

export default {
  writeFile,
  makeDir,
  readFolderNames,
  readFolderNamesSync,
  mkdirpR,
};
