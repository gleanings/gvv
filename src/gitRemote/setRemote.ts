import { runOtherCode } from 'a-node-tools';
import { isFalse } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { dog } from '../dog';
import { checkIsSIGINT, gitError } from '../utils';
import { cwd } from './../data-store/cwd';

/**
 *  ## 配置远程库
 *  在通过 `question` 获取到远程仓库信息后，进行配置
 */
export async function setRemote() {
  const { gitInfo } = dataStore;
  const code = `git remote add ${gitInfo.alias} ${gitInfo.url}`;
  const result = await runOtherCode({ code, cwd });
  await checkIsSIGINT(result);
  dog('配置远程库', code, result);

  if (isFalse(result.success)) {
    return await gitError('配置远程库故障', result.error);
  }
}
