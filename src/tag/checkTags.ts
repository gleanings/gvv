import { _p, runOtherCode } from 'a-node-tools';
import { isFalse, isTrue } from 'a-type-of-js';
import { cyanPen, hexPen, randomPen } from 'color-pen';
import { dataStore } from '../data-store';
import { gitError } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';
import { getVersion } from './getVersion';

/**
 *
 * 获取本地的标签
 *
 */
export async function checkTags() {
  // 当未使用 tag 或者主动给 tag 赋值 true 时意味着使用 当前的版本作为 tag 值
  if (isTrue(dataStore.tag)) {
    await getVersion();
  }
  const { pkg, gitInfo, tag } = dataStore;

  const code = 'git tag --list';
  // 获取本地的 tag 值列表
  const result = await runOtherCode({ code, cwd });

  dog('获取本地的标签', code, result);

  // 获取本地 tag 列表出错
  if (isFalse(result.success)) {
    return await gitError(
      `使用 ${hexPen('0x666')`git tag --list`} 命令出现错误`,
    );
  }

  const tagList = result.data
    .split('\n')
    .map(e => e.trim())
    .filter(e => e);

  //
  gitInfo.tags = tagList;

  dog('已有的 tag 列表', tagList.slice(0, 100));

  // tag 值在上面 getVersion 时触发了更改，这里需要重新给值

  dog('当前的 tag 值为', tag);

  if (tagList.includes(isTrue(tag) ? `v${pkg.version}` : tag.toString())) {
    dog.error('已存在该 tag 值');
    _p(cyanPen`已经存在的 tag 值为：`);

    tagList.forEach(e => _p(`${randomPen`-`}  ${e}`));

    return await gitError(`tag 值 "${tag}" 已经存在于本地`);
  }
}
