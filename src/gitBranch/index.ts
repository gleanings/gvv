import { isEmptyString } from '@vvi/is';
import { dataStore } from '../data-store';
import { hasRemote } from '../gitRemote';
import { getLocalBranch } from './getLocalBranch';
import { getRemoteBranch } from './getRemoteBranch';

/**
 * ## git 分支分析
 * 仅检测是否配置了对应上游分支
 * ```bash
 *  # 下面的命令仅会对当前分支有影响 'git branch --show-current'
 *  git push --set-upstream origin xxx
 *  # 或者使用
 *  git push -u  origin xxx
 * ```
 */
export async function gitBranch(): Promise<void> {
  await getLocalBranch(); // 获取本地分支信息
  await getRemoteBranch(); // 获取上游分支信息
  const { gitInfo } = dataStore;
  // 当两者中的任一个没有值，说明未设置默认推送关联分支
  // 两个值同时在  `getRemoteBranch` 中 配置，没有值意味着并没有配置默认推送的
  if ([gitInfo.alias, gitInfo.branch].some(e => isEmptyString(e)))
    await hasRemote(); // 验证上游库是否配置
}
