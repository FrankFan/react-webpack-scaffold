import path from 'path';

const PROJECTNAME = 'commonbusiness';
const SRC_PAGES_PATH = path.resolve(__dirname, '../src/pages');
const BUILD_PATH = path.resolve(__dirname, '../build');
const SRC_PATH = path.resolve(__dirname, '../src');
const NM_PATH = path.resolve(__dirname, '../node_modules');
const LUUI_PATH = path.resolve(__dirname, '../../luui');
const LUBASE_PATH = path.resolve(__dirname, '../../lubase');
const COPY_FOLDER_EXCLUDE = ['static', 'public'];

export {
  BUILD_PATH,
  SRC_PAGES_PATH,
  SRC_PATH,
  NM_PATH,
  LUUI_PATH,
  LUBASE_PATH,
  PROJECTNAME,
  COPY_FOLDER_EXCLUDE,
};
