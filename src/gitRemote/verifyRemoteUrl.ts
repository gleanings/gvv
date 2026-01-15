import { runOtherCode } from 'a-node-tools';
import { isFalse } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { gitError } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/** 校验当前远程仓库地址的正确性 */
export async function verifyRemoteUrl() {
  const { gitInfo } = dataStore;
  const code = `git ls-remote --heads ${gitInfo.url}`;
  const result = await runOtherCode({ code, cwd });

  dog('校验当前远程仓库地址的正确性 ', code, result);

  if (isFalse(result.success)) {
    dog.error('校验当前远程仓库地址的正确性', result.error);
    return await gitError(result.error);
  }
}
