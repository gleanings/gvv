import { sleep } from 'a-js-tools';
import {
  colorLine,
  cursorAfterClear,
  cursorShow,
  runOtherCode,
} from 'a-node-tools';
import { isEmptyArray, isFalse } from 'a-type-of-js';
import { command } from './command';
import { dataStore } from './data-store';
import { cwd } from './data-store/cwd';
import { gitInfo } from './data-store/gitInfo';
import { dog } from './dog';
import { execStashPop } from './pull/stash-pop-exec';
import { deleteTag } from './tag/deleteTag';
import { waiting } from './waiting';

/** 当前的时间 */
export function now(): string {
  return new Date().toLocaleString();
}

/**  公共处理  */
export function commonExit() {
  cursorAfterClear(true); // 清理冗余
  waiting.destroyed(); // 销毁等待
  cursorShow(); // 恢复光标位置
}

/**
 * ## 异常导致退出
 * 退出将自动重置工作区文件状态
 * @param error
 */
export async function gitError(...error: string[]): Promise<never> {
  const info = error.join('\n');
  /**  配置输出文本样式  */
  waiting.run({
    prefix: 2,
    info,
  });
  waiting.log(info);

  /**  都为空则显示 1s 的延迟  */
  if (
    [gitInfo.stashed, gitInfo.tagged, gitInfo.committed].every(e => isFalse(e))
  ) {
    await sleep(1259);
  }

  if (gitInfo.stashed) {
    waiting.run({ info: '正在恢复本地的更改' });
    await execStashPop();
    gitInfo.stashed = false;
    await sleep(2400);
  }
  if (gitInfo.tagged) {
    waiting.run({ info: '正在删除已添加的 tag 标签' });
    gitInfo.tagged = false;
    await deleteTag();
    await sleep(2400);
  }

  if (gitInfo.committed) {
    waiting.run({ info: '正在移除已添加的提交' });
    gitInfo.committed = false;
    await gitReset();
    await sleep(2400);
  }
  commonExit();

  colorLine('终结分割线', true);
  const { voluntaryWithdrawal } = dataStore;
  return voluntaryWithdrawal ? command.end() : command.error();
}

/**  当 commit 后出现（打 tag 或是 push 错误）错误后取消提交 */
export async function gitReset() {
  gitInfo.committed = false;
  const code = 'git reset --soft HEAD^';
  const result = await runOtherCode({ code, cwd });
  dog('重置已提交的代码', code, result);
  await gitRestore(gitInfo.untrackedFiles);
  await gitRestore(gitInfo.trackedChangedFiles);
}

/**
 * 将文件移除暂存区
 * @param fileList
 */
export async function gitRestore(fileList: string[]) {
  if (!isEmptyArray(fileList)) {
    const code = `git restore --staged ${fileList
      .filter(Boolean)
      .map(e => `"${e}"`)
      .join(' ')}`;
    const result = await runOtherCode({ code, cwd });

    dog('将文件移除暂存区', code, result);
  }
}
