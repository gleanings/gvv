import { runOtherCode } from 'a-node-tools';
import { isString, isFalse, isEmptyString } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { gitError } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/**
 * 获取远程分支
 *
 * 当前在使用时
 */
export async function getRemoteBranch() {
  const { gitInfo } = dataStore;

  const code = 'git rev-parse --abbrev-ref --symbolic-full-name @{u}';
  /**
   * 获取远程当前分支名的分支信息
   */
  const result = await runOtherCode({ code, cwd });

  dog('获取远程当前分支的信息', code, result);

  /**  获取远程分支信息 ❌  */
  if (isFalse(result.success)) {
    dog.warn('获取本地分支关联的远程分支出错', result);
    /**  未设置远程分支  */
    if (
      isString(result.error) &&
      [result.error, result.data].some(e =>
        e.includes('fatal: no upstream configured for branch'),
      )
    ) {
      // 未设置远程关联的分支时直接返回🈳字符串
      return;
    } else {
      return await gitError(result.error);
    }
  }
  dog('获取当前分支关联的远程分支', result);
  /**  获取远程分支信息 ✅  */
  const remoteBranch = result.data!.trim().replace(/\n/g, '');
  /**  分割远程分支信息  */
  const tip = remoteBranch.indexOf('/');

  /**  配置远程库的别名，该值为🈳（用户未主动配置该值）时，则设置该值  */
  if (isEmptyString(gitInfo.alias)) {
    gitInfo.alias = remoteBranch.slice(0, tip);
  }
  /**  配置远程分支名，该值为🈳（用户未主动配置该值）时，则设置该值  */
  if (isEmptyString(gitInfo.branch)) {
    gitInfo.branch = remoteBranch.slice(tip + 1);
  }

  // return [remoteBranch.slice(0, tip), remoteBranch.slice(tip + 1)];

  // const remoteBranch = result.data.trim().split('/');

  // return [remoteBranch[0], remoteBranch.slice(1).join('/')];
}
