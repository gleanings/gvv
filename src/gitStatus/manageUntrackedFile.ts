import { selection, SUCCESS } from '@vvi/command';
import { isEmptyString, isFalse, isUndefined } from '@vvi/is';
import { runOtherCode } from '@vvi/node';
import { dataStore } from '../data-store/index';
import { dog } from '../dog';
import { checkIsSIGINT, gitError } from '../utils';
import { cwd } from './../data-store/cwd';
import { unTrackedFiles } from './track-stag-area';

/**
 *
 * 检测 git 是否存在未追踪的文件
 *
 */
export async function manageUntrackedFile() {
  const { gitInfo } = dataStore;
  /**  查看 git 是否存在未追踪的文件  */
  const result = await unTrackedFiles();

  dog(result, result.data);
  if (isFalse(result.success)) {
    dog.error('查看当前工作区是否存在文件时出错', result);
    return await gitError('查看当前工作区是否有文件出错');
  }

  if (result.success && !isEmptyString(result.data)) {
    const untrackedFileList = (gitInfo.untrackedFiles = result.data
      .replace(/\n$/, '')
      .split('\n'));

    // 打印
    await addTrack(untrackedFileList);
  }
}

/**
 *
 * 是否将未追踪的文件添加到追踪区
 *
 * @param untrackedFileList
 */
async function addTrack(untrackedFileList: string[]) {
  const data = untrackedFileList.map(e => ({
    value: e,
    label: e,
    checked: true,
  }));

  const result = await selection({
    data,
    info: '请使用 enter 确认，空格切换文件是否提交。ctrl + a 全选，ctrl + z 取消全选，ctrl + r 切换所有状态',
    kind: 'check',
  });

  if (isUndefined(result)) {
    return;
  }
  const code = `git add "${result.join('" "')}"`;
  const response = await runOtherCode({ code, cwd });
  await checkIsSIGINT(response);
  dog('是否将未追踪的文件添加到追踪区', result, code, response);
  if (isFalse(response.success)) {
    return await gitError('执行', response.error || response.data);
  }
  SUCCESS(`已将 ${result.length} 个文件添加追踪`);
  /**  已添加到  */
}
