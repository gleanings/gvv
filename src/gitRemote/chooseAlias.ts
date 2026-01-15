import { selection } from 'a-command';
import { isEmptyString, isUndefined } from 'a-type-of-js';
import { dataStore } from '../data-store/index';
import { gitError } from '../utils';
import { dog } from './../dog';
import { setAlias } from './setAlias';

/**
 *
 * 选择一个远程库别名
 *
 */
export async function chooseAlias(remoteAliases: { [x: string]: string }) {
  //  存在多个远端代码库的别名且都不包含主动设置的值时采用问询的方式设置值

  const remoteList = Object.keys(remoteAliases);

  const result = await selection({
    info: '当前存在多个远程库配置',
    resultText: '本次推送选择的远程分支为',
    data: remoteList.map(e => ({
      label: e,
      value: e,
      tip: `${e} : ${remoteAliases[e]}`,
    })),
  });

  if (isUndefined(result)) {
    dataStore.voluntaryWIthdrawal = true;
    return await gitError('您选择了退出，正在做退出前的清理，请稍等');
  }

  dog('选择远程库别名', result);
  if (isEmptyString(result)) {
    dog.error('获取用户选择当前用户的远程分支名出错，但是这个错误不应当发生');
    return await gitError('远程分支的别名不能为 🈳');
  }
  return setAlias(result);
}
