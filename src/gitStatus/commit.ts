import { runOtherCode } from 'a-node-tools';
import { isFalse } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { checkIsSIGINT, gitError, markVoluntaryWithdrawal } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

import { getMessage } from './getMessage';
import { trackedNotSubmitted } from './track-stag-area';

/**
 *
 *  git 暂存区文件的
 *
 *
 * 如果暂存区没有文件则直接退出
 */
export async function stagingArea() {
  /**
   *  检测 git 暂存区的状态
   */
  const canCommit = await trackedNotSubmitted();

  if (isFalse(canCommit.success)) {
    return await gitError('暂存区异常');
  } else if (/^\n?\r?$/.test(canCommit.data)) {
    await markVoluntaryWithdrawal('暂存区没有未提交的文件'); // 主动退出，非错误执行
  }

  return await commit(); // 标记代码为一个提交
}

/**
 *
 * 提交代码
 *
 */
export async function commit() {
  const { gitInfo } = dataStore;
  /**  构建提交的代码  */
  const code = `git commit -m "${getMessage(true)}"`;

  const result = await runOtherCode({ code, cwd });
  await checkIsSIGINT(result);
  dog('提交代码', code, result);

  if (isFalse(result.success)) {
    if (
      [result.data, result.error].some(e =>
        e.includes('fatal: not a valid object name:'),
      )
    ) {
      await checkIsSIGINT(await runOtherCode(`git branch main`));
    }

    dog.error('暂存区文件提交异常', result.error);
    return await gitError('提交代码失败');
  }

  gitInfo.committed = true;
}
