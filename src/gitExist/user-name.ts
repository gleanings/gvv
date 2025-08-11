import { cwd } from './../data-store/cwd';
import { dog } from './../dog';
import { runOtherCode } from 'a-node-tools';
import { command } from '../command';
import { gitError } from '../utils';
import {
  isEmptyString,
  isUndefined,
  isBusinessEmptyString,
} from 'a-type-of-js';
import { dataStore } from 'src/data-store';

/**
 * git 的账户
 */
export async function gitUser() {
  let code = 'git config user.name';
  /**  本地仓库的用户名  */
  const localUserName = await runOtherCode({ code, cwd });
  dog('本地仓库的用户名', code, localUserName);

  code = 'git config --global user.name';
  /**  全局的用户名  */
  const globalUserName = await runOtherCode({ code, cwd });
  dog('全局配置的用户名', code, globalUserName);

  if (
    [localUserName.data, globalUserName.data].every(e =>
      isBusinessEmptyString(e),
    )
  )
    return await setUserName();

  dog('获取到本地个人信息', localUserName, globalUserName);
}

/**
 *
 *  设置 git 的用户名
 *
 */
export async function setUserName() {
  const username = await command.question({
    text: '请 🔧 配置您的 git 的用户名',
    tip: 'user.name',
    resultText: '您配置的 git 用户名是',
  });

  if (isUndefined(username)) {
    dataStore.voluntaryWIthdrawal = true;
    return await gitError('您选择了退出，请稍等，正在清理');
  }

  if (isEmptyString(username)) {
    await gitError('用户名 🍀 不能为🈳');
  } else {
    const code = `git config --global user.name "${username}"`;
    const result = await runOtherCode({ code, cwd });
    dog('配置全局的用户名', username, code, result);
  }
}
