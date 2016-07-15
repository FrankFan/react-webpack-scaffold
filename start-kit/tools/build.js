import run from './run';
import clean from './clean';
import bundle from './bundle';
import copyForRelease from './copyForRelease';

async function build() {
  await run(clean);
  await run(bundle);
  await run(copyForRelease);
}

export default build;
