/****************************************************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName gvv
 *  @FileName index.ts
 *  @CreateDate  周日  04/13/2025
 *  @Description 查看并设置上游仓库
 *
 * - 没有上游库时则显示输入。并在获取输入后使用 `git remote add` 添加上游仓库
 * - 当上游仓库为一个时，则使用该仓库
 * - 当有两个以上的仓库存在，则显示选择
 *
 ****************************************************************************/
import { isEmptyString } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { getRemote } from './getRemote';
import { setRemote } from './setRemote';
import { verifyRemoteUrl } from './verifyRemoteUrl';
import { waitInputRemoteAlias } from './waitInputRemoteAlias';
import { waitInputRemoteUrl } from './waitInputRemoteUrl';

/**
 *
 * 是否存在关联上游的仓库
 *
 */
export async function hasRemote() {
  await getRemote();

  const { gitInfo } = dataStore;

  /**  未关联上游分支（或是本地为未设置任何上游库）  */
  if (isEmptyString(gitInfo.alias)) {
    await waitInputRemoteAlias(); // 设置上游分支的别名
    await waitInputRemoteUrl(); // 设置上游分支的 url
    await verifyRemoteUrl(); // 验证上游分支的 url 是否正确
    await setRemote(); // 设置上游分支
  }
}
