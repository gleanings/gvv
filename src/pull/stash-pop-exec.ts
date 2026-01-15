import { _p, runOtherCode } from 'a-node-tools';
import { isFalse } from 'a-type-of-js';
import { cwd } from '../data-store/cwd';
import { gitInfo } from '../data-store/gitInfo';
import { dog } from '../dog';
import { checkIsSIGINT, gitError, markVoluntaryWithdrawal } from '../utils';

/**
 *  执行弹出储存的
 */
export async function execStashPop() {
  /**  正常不会执行到  */
  if (isFalse(gitInfo.stashed)) {
    return _p('当前储存区没有本次执行的内容');
  }
  const code = 'git stash pop';
  const result = await runOtherCode({ code, cwd });
  await checkIsSIGINT(result);
  dog('将储存区的文件取出', code, result);
  if (isFalse(result.success)) {
    if (
      [result.data, result.error].some(e =>
        /The stash entry is kept in case you need it again/gi.test(e),
      )
    ) {
      gitInfo.stashed = false; // 释放状态
      await markVoluntaryWithdrawal('当前存在冲突，请先处理完冲突再继续');
    }

    dog.error('取出暂存文件失败');
    return await gitError('执行取出暂存文件失败', result.error);
  }

  gitInfo.stashed = false; // 释放状态
}
