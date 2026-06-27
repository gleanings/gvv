import { question } from '@vvi/command';
import { isEmptyString, isUndefined } from '@vvi/is';
import { _p } from '@vvi/node';
import { dataStore } from '../data-store';
import { gitError, markVoluntaryWithdrawal } from '../utils';

/** ## 配置上游库的地址 */
export async function waitInputRemoteUrl() {
  _p('当前未配置 🛠️ 上游库');

  const result = await question({
    text: '请 🔧 配置上游分支的链接',
    resultText: '设置上游分支的链接为',
    tip: 'git@',
    private: false,
  });

  if (isUndefined(result)) {
    return await markVoluntaryWithdrawal();
  }

  if ([isEmptyString, isUndefined].some(e => e(result))) {
    return await gitError('上游分支的链接不能为🈳');
  }

  dataStore.gitInfo.url = result;
}
