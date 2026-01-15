import { question } from 'a-command';
import { _p, runOtherCode } from 'a-node-tools';
import { isFalse, isUndefined } from 'a-type-of-js';
import { bluePen, cyanPen, greenPen, magentaPen } from 'color-pen';
import { dataStore } from '../data-store/index';
import { dog } from '../dog';
import { checkIsSIGINT, gitError } from '../utils';
import { waiting } from '../waiting';
/**  合并之前  */
export async function beforeMerge() {
  const { branch, alias, localBranch } = dataStore.gitInfo;

  /// 判定输出是否有冲突，有冲突工作则为 false ，否则 true
  const code = `git merge-tree --write-tree HEAD ${alias}/${branch || localBranch}`;
  /// 返回具体的执行冲突文件及部位 ,判定 <<<<<<< 或 >>>>>>> 来确定有冲突
  // const code = `git merge-tree --write-tree \`git merge-base HEAD ${alias}/${branch}\` HEAD ${alias}/${branch}`;
  waiting.run('正在执行' + cyanPen(code));
  const result = await runOtherCode({ code, waiting });
  dog('冲突判断', result);
  await checkIsSIGINT(result);
  if (isFalse(result.success)) {
    const tip = ['继续合并', '直接退出'];
    _p(
      `当前本地提交与线上的提交有${magentaPen`冲突`}，您可以${greenPen`继续合并`}，然后手动处理冲突，或者，直接${bluePen`退出`}\n\n`,
    );
    const askForConflict = await question({
      text: '继续或退出',
      tip,
    });
    if (isUndefined(askForConflict) || askForConflict === tip[1])
      return await gitError('检测到当前代码与线上有冲突，本次提交请手动修改');
  }
}
