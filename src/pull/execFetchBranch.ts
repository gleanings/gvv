import { _p, runOtherCode } from 'a-node-tools';
import { isFalse } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { gitError } from '../utils';
import { waiting } from '../waiting';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/**
 *
 * 执行请求
 *
 */
export async function execFetchBranch() {
  const { gitInfo } = dataStore;

  const { localBranch, branch } = gitInfo;
  const fetchBrach = branch || localBranch;
  const code = 'git fetch --all';
  waiting.run({
    info: '请稍等，正在同步线上数据',
    prefix: 0,
  });
  const result = await runOtherCode({
    // code: `git fetch ${alias}  ${fetchBrach}`,
    code,
    cwd,
    waiting,
  });

  if (result.isSIGINT) {
    dataStore.voluntaryWIthdrawal = true;
    return await gitError();
  }

  dog('请求线上代码', code, result);
  if (isFalse(result)) {
    const message = '拉取 <' + fetchBrach + '> 出错';
    dog.error(message, result);
    _p(result.error);
    return await gitError(message);
  }
}
