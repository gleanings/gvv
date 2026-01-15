/**
 * @packageDocumentation
 * @module @gvv/index
 * @file index.ts
 * @description 拉取线上 git 数据
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2025-05-31 19:57
 * @version 1.0.0
 * @lastModified 2026-01-15 19:58
 */

import { gitInfo } from './../data-store/gitInfo';
import { dog } from './../dog';
import { execFetchBranch } from './fetch-branch-exec';
import { isForce } from './force-is';
import { beforeMerge } from './merge-before';
import { execMerge } from './merge-exec';

/**
 * 拉取线上文件
 */
export async function fetch() {
  if (await isForce()) {
    dog('强制推送跳过拉取');
    return;
  }
  await execFetchBranch(); // 拉取线上的分支详情
  // await execStash(); // 先暂存代码
  await beforeMerge(); // 合并代码之前
  await execMerge(); // 执行代码合并
  if (gitInfo.stashed) {
    dog('当前储存区有文件，正在执行取出');
    // await execStashPop(); // 弹出临时储存的
  } else {
    dog.warn('当前储存区没有文件存留，正常应当退出程序');
  }
}
