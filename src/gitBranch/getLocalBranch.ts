/**
 * @packageDocumentation
 * @module @gvv/getLocalBranch
 * @file getLocalBranch.ts
 * @description 获取当前的 git 分支
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-14 23:43
 * @version 0.1.8
 * @lastModified 2026-01-15 21:30
 *
 * 原使用 `git branch` 获取当前所有的分支，并通过换行符分割提取。
 *
 * ```ts
 * //  分支列表
 *  const branchList = result.data.split('\n').map(e => e.trim());
 * //  当前分支
 * const branch = branchList.find(e => e.startsWith('*'));
 * ```
 * 现使用 `git branch --show-current` （在分离头指针状态返回为空） 或 `git rev-parse --abbrev-ref HEAD` （在分离头指针状态返回值为 "HEAD" ）
 */
import { runOtherCode } from 'a-node-tools';
import { isFalse } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { cwd } from '../data-store/cwd';
import { gitError } from '../utils';
import { dog } from './../dog';

/**  解析分支信息 */
export async function getLocalBranch() {
  // 或者 git rev-parse --abbrev-ref HEAD
  const code = 'git branch --show-current';
  /**  获取本地的分支信息  */
  const result = await runOtherCode({ code, cwd });
  dog('获取分支信息', code, result);
  if (isFalse(result.success)) {
    dog.error('获取当前 git 分支出错', result);
    return await gitError(result.error);
  }
  // 获取本地分支，没有获取默认为主分支 'main'
  dataStore.gitInfo.localBranch =
    result.data?.trim().replace(/\n/g, '') || 'main';
}
