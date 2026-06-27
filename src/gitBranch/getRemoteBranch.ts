import { isString, isFalse, isEmptyString } from '@vvi/is';
import { runOtherCode } from '@vvi/node';
import { dataStore } from '../data-store';
import { gitError } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/**
 * ## 获取上游分支
 *
 * 当前在使用的分支的设置的上游通过 `git push --set-upstream origin` 设置的上游分支名。
 *
 * 如果未获取，可以在
 */
export async function getRemoteBranch() {
  const { gitInfo } = dataStore;

  const code = 'git rev-parse --abbrev-ref --symbolic-full-name @{u}';
  /** 获取上游当前分支名的分支信息  */
  const result = await runOtherCode( { code, cwd } );
  dog( '获取上游当前分支的信息', code, result );
  /**  获取上游分支信息 失败  */
  if ( isFalse( result.success ) ) {
    dog.warn( '获取本地分支关联的上游分支出错', result );
    /**  未设置上游分支  */
    if (
      isString( result.error ) &&
      [ result.error, result.data ].some(
        e => {
          // 当前本地没有 main 分支，如果是如此的话，极有可能是本地尚未初始化
          return e.includes( 'fatal: no such branch:' ) ||
            // 当前分支尚未绑定上游分支
            e.includes( 'fatal: no upstream configured for branch' ) ||
            // 上游分支被破坏的时候，比如手动删除了上游而本地依旧有该分支
            e.includes(
              "fatal: ambiguous argument '@{u}': unknown revision or path not in the working tree",
            ) ||
            e.includes(
              "fatal: ambiguous argument '@{u}': unknown revision or path not in the working tree",
            )
        }
      )
    ) {
      // 未设置上游关联的分支时直接返回🈳字符串
      return;
    } else {
      // 获取上游分支时出错
      return await gitError( result.error );
    }
  }
  dog( '获取当前分支关联的上游分支', result );
  /**  获取上游分支信息 ✅  */
  const remoteBranch = result.data!.trim().replace( /\n/g, '' );
  /**  分割上游分支信息  */
  const tip = remoteBranch.indexOf( '/' );

  /**  配置上游库的别名，该值为🈳（用户未主动配置该值）时，则设置该值  */
  if ( isEmptyString( gitInfo.alias ) ) {
    gitInfo.alias = remoteBranch.slice( 0, tip );
  }
  /**  配置上游分支名，该值为🈳（用户未主动配置该值）时，则设置该值  */
  if ( isEmptyString( gitInfo.branch ) ) {
    gitInfo.branch = remoteBranch.slice( tip + 1 );
  }

  // return [remoteBranch.slice(0, tip), remoteBranch.slice(tip + 1)];

  // const remoteBranch = result.data.trim().split('/');

  // return [remoteBranch[0], remoteBranch.slice(1).join('/')];
}
