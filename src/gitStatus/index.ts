import { runOtherCode } from '@vvi/node';
import { checkIsSIGINT } from '../utils';
import { add } from './add';
import { stagingArea } from './commit';
import { gitInitialized } from './init';
import { manageUntrackedFile } from './manageUntrackedFile';

/**
 *
 * 上来先检测 git 的状态
 *
 *
 * `git add .` 没有副作用，在检测完毕后执行 `git add .`
 *
 * 保证修改而未添加到暂存区
 *
 */
export async function gitStatus(): Promise<void> {
  // 检测当前工作区是否 git 初始化
  await gitInitialized();
  // 将中文文件名输出为中文，防止因为文件路径包含中文而导致的错误
  await checkIsSIGINT(
    await runOtherCode('git config --global core.quotepath false'),
  );
  // 将已追踪修改的文件添加到暂存区
  await add();
  // 检测 git 是否有未追踪的文件
  await manageUntrackedFile();
  // 查看暂存区是否有文件（上面的步骤已经将文件添加到了 暂存区）
  await stagingArea();
}
