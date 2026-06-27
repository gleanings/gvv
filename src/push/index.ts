import { isFalse } from '@vvi/is';
import { _p, runOtherCode } from '@vvi/node';
import {
  brightCyanPen,
  brightGreenPen,
  cyanPen,
  greenPen,
  magentaPen,
} from '@vvi/pen';
import { gitInfo } from '../data-store/gitInfo';
import { removeExitEvent } from '../onExit';
import { checkIsSIGINT, markVoluntaryWithdrawal } from '../utils';
import { waiting } from '../waiting';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';
import { pushFail } from './pushFail';
/**
 * 推送代码到上游库
 */
export async function push() {
  const { alias, branch, localBranch, force, inputBranch } = gitInfo;
  /**  推送的实际分支  */
  const pushBrach = branch || inputBranch || localBranch;
  /**  执行的 shell 命令  */
  const code = `git push ${alias} ${localBranch}:${pushBrach} --tags ${force ? '--force' : ''}`;

  waiting.run(
    `正在将本地 ${greenPen(localBranch)} 推送到 ${magentaPen(alias)} 的 ${cyanPen(pushBrach)} `,
  );

  const result = await runOtherCode({
    code,
    waiting,
    cwd,
  });
  dog('执行推送的代码为：', code, result);
  await checkIsSIGINT(result);

  /// 推动出现错误
  if (isFalse(result.success)) {
    dog.error('执行推送出现了问题');

    return pushFail(result.error);
  }
  /// 当前与线上一致的情况下
  if (
    [result.error, result.data].some(e => e.startsWith('Everything up-to-date'))
  ) {
    /**
     * - 在设置上游分支名的时候，使用 `git push -u xxx xxx` 会导致该情况的发生
     */
    dog.error('显示没有可推送的文件。但是，不可能会走到这一步呀，在没有');
    await markVoluntaryWithdrawal('看起来所有更新都已经提交');
  }
  gitInfo.tagged = false;
  gitInfo.committed = false;

  _p(
    `已经本地的修改推送到 ${brightGreenPen(alias)}/${brightCyanPen(pushBrach)}`,
  );
  // 设定推送分支
  await checkIsSIGINT(
    await runOtherCode(`git push --set-upstream ${alias} ${pushBrach}`),
  );
  removeExitEvent();
}
