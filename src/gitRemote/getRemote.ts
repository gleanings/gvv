import { isBusinessEmptyString, isZero } from '@vvi/is';
import { _p, runOtherCode } from '@vvi/node';
import { magentaPen } from '@vvi/pen';
import { commandParameters } from '../data-store/commandParameters';
import { gitInfo } from '../data-store/gitInfo';
import { checkIsSIGINT, gitError } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';
import { chooseAlias } from './chooseAlias';
import { parseRemoteAlias } from './parseRemoteAlias';
import { setAlias } from './setAlias';

/**
 * # 获取上游库信息
 */
export async function getRemote() {
  const code = 'git remote -v';
  /**  获取上游仓库信息  */
  const result = await runOtherCode({ code, cwd });
  await checkIsSIGINT(result);
  dog('获取上游的库信息', code, result);
  // 获取上游仓库信息 失败
  if (!result.success) {
    dog.error('未获取上游仓库', result);
    await gitError(result.error);
  }

  /**  获取上游仓库信息 ✅  */
  const remoteAliases = parseRemoteAlias(result.data!);
  /**  设置的上游的列表  */
  const remoteList = Object.keys(remoteAliases);
  /**  上游的设定数量  */
  const remoteNumber: number = remoteList.length;

  dog('获取当前配置的上游', remoteAliases);

  // 获取上游仓库信息 ✅  判断是否为🈳
  // 本地的上游库设置为🈳时则清🈳配置
  // 清🈳配置而 commandParameters.alias 不为🈳
  if (isZero(remoteNumber)) {
    gitInfo.alias = '';
    gitInfo.url = '';
    return;
  }

  const { alias } = commandParameters;

  // 主动配置了上游库别名且别名在本地的组中
  // 本地配置的 alias 与主动设置的一样，则直接返回
  if (alias && remoteAliases[alias]) {
    gitInfo.alias = alias;
    return setAlias(alias, false);
  } else {
    if (!isBusinessEmptyString(alias))
      _p(`您提供的上游别名${magentaPen(alias)}不存在于本地`);

    if (remoteNumber === 1) {
      // 如果只有一个上游库，则直接设置别名
      return setAlias(remoteList[0], true);
    } else {
      return await chooseAlias(remoteAliases);
    }
  }
}
