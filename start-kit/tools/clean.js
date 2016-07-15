import del from 'del';
import lufs from './lib/lufs';
import path from 'path';
import _ from 'lodash';
import {
  BUILD_PATH,
  SRC_PATH,
  PROJECTNAME,
}
from './base.config';

async function clean() {
  let folderNamesArr = await lufs.readFolderNames(SRC_PATH);
  folderNamesArr = folderNamesArr.map(folderPath => BUILD_PATH + path.sep + PROJECTNAME + path.sep + folderPath);
  console.log('即将删除如下目录:\n', folderNamesArr);
  const delArr = _.union(folderNamesArr, ['.tmp', '!build/.git', 'build/']); // build path is relative from project path,don't run it in this folder
  const res = await del(delArr, {
    dot: true,
  });
  console.log(res);
}

export default clean;
