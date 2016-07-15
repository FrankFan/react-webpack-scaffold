import path from 'path';
import Promise from 'bluebird';
import fs from 'fs';
import lufs from './lib/lufs';
import ncpo from 'ncp';

import {
  BUILD_PATH,
  SRC_PATH,
  COPY_FOLDER_EXCLUDE,
}
from './base.config';

const fromSrcStaticFolderRoot = `${SRC_PATH}${path.sep}modules${path.sep}`;
const targetBuildStaticFolderRoot = `${BUILD_PATH}${path.sep}modules${path.sep}`;

async function exec(ncp, folderNames) {
  const ncps = [];
  for (const folder of folderNames) {
    console.log('开始处理业务模块(', folder, '):----------');
    const srcPagesIndexHTMLPath = `${fromSrcStaticFolderRoot}${folder}${path.sep}index.html`;
    const targetPagesFolderPath = `${targetBuildStaticFolderRoot}${folder}${path.sep}`;
    const targetPagesIndexHTMLPath = `${targetPagesFolderPath}index.html`;
    if (COPY_FOLDER_EXCLUDE.includes(folder)) {
      // exclude the public folder
      console.log(`exclude--- ${folder}`);
      continue;
    }

    if (!fs.existsSync(targetPagesFolderPath)) {
      lufs.makeDir(targetPagesFolderPath).then((arg) => {
        console.log(arg);
      });
    } else {
      console.log(`开始复制文件:${srcPagesIndexHTMLPath} 到--> ${targetPagesIndexHTMLPath}`);
      ncps.push(ncp(srcPagesIndexHTMLPath, targetPagesIndexHTMLPath));
    }
  }
  await Promise.all(ncps);
}

/**
 * Copies static folderNames such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  const ncp = Promise.promisify(ncpo);
  const folderNames = await lufs.readFolderNames(fromSrcStaticFolderRoot);
  // folderNames.push('');
  // For just copy bo pages
  try {
    exec(ncp, folderNames);
  } catch (e) {
    console.error('copy error!', e);
  }
}

export default copy;
