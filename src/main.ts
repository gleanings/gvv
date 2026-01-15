/**
 * @packageDocumentation
 * @module gvv
 * @file main.ts
 * @description 设定用户的信息
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-15 11:09
 * @version 1.0.0
 * @lastModified 2026-01-15 11:11
 */
import { isFalse } from 'a-type-of-js';
import { command } from './command';
import { dataStore } from './data-store';
import { dog } from './dog';
import { gitBranch } from './gitBranch';
import { gitExist } from './gitExist';
import { gitStatus } from './gitStatus';
import { gitInit } from './gitStatus/init';
import { onExit } from './onExit';
import { parseArgs } from './parseArgs';
import { fetch } from './pull';
import { execFetchTag } from './pull/execFetchTag';
import { push } from './push';
import { tag } from './tag';
import { checkTags } from './tag/checkTags';

/**
 * 主程序入口
 */
export async function main(): Promise<void> {
  onExit();
  // 在一开始的时候，使用的 `a-node-tools` 为 0.1.1 版本
  // 在该版本的 `runOtherCode` 未移除 process.on('exit') 监听，导致需要该配置，现在可移除
  process.setMaxListeners(20); // 设置最大监听事件
  parseArgs(); // 解析命令行参数
  // 查看是否是 `init` 命令进入，是的话仅进行 git 初始化

  const { commandParameters } = dataStore;

  if (dataStore.init) {
    dog('当前执行为（仅）初始化 git');
    await gitExist();
    dog.warn('是否安装 git 应用检测完毕');
    await gitInit();
    dog.warn('git 初始化完毕');
    command.end(); // 结束命令行
  }
  await gitExist(); // 判断当前项目是否是 git 项目
  dog.warn('是否安装 git 应用检测完毕');
  await gitBranch(); // 获取当前的分支情况
  dog.warn('当前分支情况判断完毕');
  await execFetchTag();
  if (!isFalse(commandParameters.tag)) {
    dog('设置当前提交的 tag');
    await checkTags();
  }

  dog.warn('检测本地 tag 完毕');
  await gitStatus(); // 获取 git 状态并进行提交
  dog.warn('文件修改状态检测完毕');
  await fetch(); // 拉取分支并合并
  dog.warn('拉取线上分支完毕');
  // 用户主动使用 `-t` 或 `tag` 标签时或未传入该值而 `kind` 为 `version` 值时，为本次提交进行打标签
  if (!isFalse(commandParameters.tag)) await tag(); // 打标签
  dog.warn('害怕不害怕');
  await push();
}
