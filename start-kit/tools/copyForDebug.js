import path from 'path';
import Promise from 'bluebird';
import fs from 'fs';
import lufs from './lib/lufs';
import del from 'del';
import ncpo from 'ncp';

import {
  SRC_PATH,
  LUUI_PATH,
  LUBASE_PATH,
}
from './base.config';

async function exec(ncp) {
  const sourceNMLUUIFolder = `${LUUI_PATH}${path.sep}lib${path.sep}`;
  const sourceNMLUBaseLibFolder = `${LUBASE_PATH}${path.sep}lib${path.sep}public${path.sep}`;
  const sourceNMLUBaseDependenciesFolder = `${LUBASE_PATH}${path.sep}dependencies${path.sep}`;
  const targetSrcFolderPath = `${SRC_PATH}${path.sep}public${path.sep}`; // 为了避免Unhandled rejection Error: ENOENT,请使用${path.sep}代替/

  const ncps = [];
  console.log('开始处理luui(', sourceNMLUUIFolder, '):----------');
  console.log('开始处理lubase(', sourceNMLUBaseLibFolder, '):----------');
  console.log('开始 clean (', targetSrcFolderPath, '):----------');

  const res = await del(targetSrcFolderPath, {
    dot: true,
  });
  console.log(res);

  if (fs.existsSync(sourceNMLUUIFolder) && fs.existsSync(sourceNMLUBaseLibFolder)) {
    const stats = fs.statSync(sourceNMLUUIFolder);
    if (stats.isDirectory()) {
      if (!fs.existsSync(targetSrcFolderPath)) {
        lufs.mkdirpR(targetSrcFolderPath);
      }
      console.log(`开始复制文件夹:${sourceNMLUUIFolder}到--> ${targetSrcFolderPath}`);
      console.log(`开始复制文件夹:${sourceNMLUBaseLibFolder}到--> ${targetSrcFolderPath}`);
      ncps.push(ncp(`${sourceNMLUUIFolder}fonts`, `${targetSrcFolderPath}fonts`));
      ncps.push(ncp(`${sourceNMLUUIFolder}styles`, `${targetSrcFolderPath}styles`));
      ncps.push(ncp(`${sourceNMLUBaseLibFolder}styles${path.sep}lubase.css`, `${targetSrcFolderPath}styles${path.sep}lubase.css`));
      ncps.push(ncp(`${sourceNMLUBaseDependenciesFolder}`, `${targetSrcFolderPath}libs`));
    }
  } else {
    console.error('warning: luui and lubase is not build, please run npm run release for build it !');
  }

  await Promise.all(ncps);
}

/**
 * Copies static sourceNMLUUIFolder such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  const ncp = Promise.promisify(ncpo);
  // For just copy bo pages
  try {
    exec(ncp);
  } catch (e) {
    console.error('copy error!', e);
  }
}

export default copy;
