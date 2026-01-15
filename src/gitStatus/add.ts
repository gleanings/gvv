import { _p, runOtherCode } from 'a-node-tools';
import { isEmptyString } from 'a-type-of-js';
import { randomPen } from 'color-pen';
import { dataStore } from '../data-store';
import { cwd } from '../data-store/cwd';
import { dog, dun } from './../dog';
import { trackedButNotStaged } from './track-stag-area';

/**
 * 判断当前工作区是否有未添加到暂存区的已修改（仅关注已追踪）文件
 */
export async function add() {
  const { gitInfo } = dataStore;
  /**  查看 git 是否有未添加到暂存区的已修改文件  */
  const canAdd = await trackedButNotStaged();

  // 有文件修改或存在未追踪的文件，则添加到暂存区
  if (isEmptyString(canAdd.data)) {
    _p('工作区没有修改的已追踪的文件待添加到暂存区');
  } else {
    gitInfo.trackedChangedFiles = canAdd.data.split('\n').filter(Boolean);
    // 涉及到不必要的运算，所有这里使用 dun 拦截
    if (dun) {
      dog(
        '将工作区已追踪的修改文件添加到暂存区',
        gitInfo.trackedChangedFiles.map(e => `- ${randomPen(e)}`).join('\n'),
      );
    }
    const code = 'git add --update';
    // 将本地未添加追踪的文件添加追踪（将直接放置到暂存区中）
    const result = await runOtherCode({ code, cwd });
    dog('判断当前是否存在尚未添加到暂存区的已追踪的修改文件', code, result);
  }
}
