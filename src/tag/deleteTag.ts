import { runOtherCode } from 'a-node-tools';
import { isTrue } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { checkIsSIGINT } from '../utils';
import { cwd } from './../data-store/cwd';
import { gitInfo } from './../data-store/gitInfo';
import { dog } from './../dog';

/**
 *
 * 删除已打好的 tag
 *
 */
export async function deleteTag() {
  const { pkg, tag } = dataStore;
  gitInfo.tagged = false;
  /**  标签  */
  const _tag = isTrue(tag) ? 'v'.concat(pkg.version) : tag;
  const code = `git tag -d ${_tag}`;
  const result = await runOtherCode({ code, cwd });
  await checkIsSIGINT(result);
  dog('删除已打好的标签', code, result);
}
