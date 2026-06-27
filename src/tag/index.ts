import { isFalse, isTrue } from '@vvi/is';
import { runOtherCode } from '@vvi/node';
import { dataStore } from '../data-store';
import { getMessage } from '../gitStatus/getMessage';
import { checkIsSIGINT, gitError, gitReset } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/**
 *
 * 打标签
 *
 */
export async function tag() {
  const { tag, pkg, gitInfo } = dataStore;
  // 在 main 调用时已经做了判断，这里。。。
  if (isFalse(tag)) {
    return await gitError('未指定 tag 参数');
  }
  dog('开始执行 tag: ', tag, ':');

  let code: string;
  const message = getMessage();
  if (isTrue(tag)) {
    const { version } = pkg;
    code = `git tag -a v${version} -m "${message}" `;
  } else {
    code = `git tag -a ${tag} -m "${message}" `;
  }

  const result = await runOtherCode({ code, cwd });
  await checkIsSIGINT(result);
  dog('执行打标签的代码为 <', code, result);
  if (isFalse(result.success)) {
    dog.error('为本次提交打标签出错', result);
    await gitReset(); /// 取消本次的提交（承诺）
    return await gitError(result.error);
  }
  gitInfo.tagged = true;
}
