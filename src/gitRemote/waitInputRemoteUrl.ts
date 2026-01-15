import { question } from 'a-command';
import { _p } from 'a-node-tools';
import { isEmptyString, isUndefined } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { gitError, markVoluntaryWithdrawal } from '../utils';

/** ## 配置远程库的地址 */
export async function waitInputRemoteUrl() {
  _p('当前未配置 🛠️ 远程库');

  const result = await question({
    text: '请 🔧 配置远程分支的链接',
    resultText: '设置远程分支的链接为',
    tip: 'git@',
    private: false,
  });

  if (isUndefined(result)) {
    return await markVoluntaryWithdrawal();
  }

  if ([isEmptyString, isUndefined].some(e => e(result))) {
    return await gitError('远程分支的链接不能为🈳');
  }

  dataStore.gitInfo.url = result;
}
