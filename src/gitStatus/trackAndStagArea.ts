import { runOtherCode } from 'a-node-tools';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';
/****************************************************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName git-commit-hooks
 *  @FileName track.ts
 *  @CreateDate  周二  04/01/2025
 *  @Description git 文件列表
 *
 * - notTrack() 检测 git 已追踪的文件列表，仅关注是否
 * - trackFile() 已追踪的文件列表，不关注修改状态
 * - ignoreFileList() 忽略及未追踪的文件列表
 * - trackedButNotStaged() 已追踪且修改未添加到暂存区的文件列表
 * - trackedNotSubmitted() 已追踪且修改添加到暂存区未提交的列表
 ****************************************************************************/

/**
 *
 * 未追踪的文件
 *
 */
export async function unTrackedFiles() {
  const code = 'git ls-files --others --exclude-standard';
  const result = await runOtherCode({ code, cwd });
  dog('未追踪的文件列表', code, result);
  return result;
}
/**
 *
 * 已追踪的文件列表（不关心修改状态）
 *
 */
export async function trackFile() {
  const code = 'git ls-files';
  const result = await runOtherCode({ code, cwd });
  dog('已追踪的文件列表', code, result);
  return result;
}

/**
 *
 * 添加到 `.gitignore` 文件
 *
 *
 * 该文件中记录了不需要被追踪及尚未追踪的文件
 *
 * 譬如 node_modules/ 下的没一个文件、dist 下的打包文件、coverage 下的测试率文件
 */
export async function ignoreFileList() {
  const code = 'git ls-files --others';
  const result = await runOtherCode({ code, cwd });
  dog('添加到 .gitignore 的文件', code, result);
  return result;
}

/**
 *
 * 判断当前工作区是否有未添加到暂存区的已修改（仅关注已追踪）文件
 *
 */
export async function trackedButNotStaged() {
  const code = 'git diff --name-only';
  const result = await runOtherCode({ code, cwd });
  dog('判断当前是否有未添加到暂存区的已（追踪）修改文件', code, result);

  return result;
}

/**
 *
 * 判断当前工作区是否有已添加到暂存区未提交的（仅关注已追踪）文件
 *
 */
export async function trackedNotSubmitted() {
  const code = 'git diff --cached --name-only';
  const result = await runOtherCode({ code, cwd });

  dog('判断当前文件夹是否有已添加到暂存区的未提交的文件', code, result);
  return result;
}
