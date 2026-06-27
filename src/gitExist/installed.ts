import { isFalse } from '@vvi/is';
import { runOtherCode } from '@vvi/node';
import { gitError } from '../utils';
import { waiting } from '../waiting';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/**  git 是否安装 */
export async function gitInstalled() {
  const code = 'git -h';
  waiting.run('正在查看当前 git 情况');
  const result = await runOtherCode({ code, cwd, waiting });

  dog('当前 git 安装情况', code, result);

  //  输出为🈳，则有 失败
  if (isFalse(result.success)) {
    dog.error('git 未安装', result);
    // git 未安装，退出
    await gitError(result.error);
  }
  waiting.run(false);
}
