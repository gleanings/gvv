import { question, SUCCESS } from 'a-command';
import { _p, runOtherCode } from 'a-node-tools';
import { isFalse, isTrue } from 'a-type-of-js';
import { dataStore, markVoluntaryWithdrawal } from '../data-store';
import { cwd } from '../data-store/cwd';
import { dog, dun } from '../dog';
import { gitError } from '../utils';
import { waiting } from '../waiting';

/**
 * ## 执行请求
 * 线上分支情况
 */
export async function execFetchBranch() {
  const { gitInfo } = dataStore;
  const { localBranch, branch, alias } = gitInfo;
  const fetchBrach = branch || localBranch; // 拉取的分支
  // 》〉》〉》
  // 仅拉取当前分支的设定默认绑定远程分支（不存在时则拉取同名的分支）
  // const code = 'git fetch --all';
  const code = `git fetch ${alias}  ${fetchBrach}`;
  // 《〈《〈《
  waiting.run({
    info: '请稍等，正在同步线上数据',
    prefix: 0,
  });
  const result = await runOtherCode({
    code,
    cwd,
    waiting,
  });
  if (result.isSIGINT) {
    markVoluntaryWithdrawal();
    return await gitError('好的，即将退出');
  }
  dog('请求线上代码', code, result);
  if (isFalse(result.success)) {
    if (
      [result.data, result.error].some(e =>
        new RegExp(`^fatal:?\\s*couldn't\\s+find\\s++remote\\s+ref`, 'ig').test(
          e,
        ),
      )
    ) {
      // 未找到同名分支（其实 branch 存在时可以跳过检测）
      return await chooseForceOr();
    }
    const message = '拉取 <' + fetchBrach + '> 出错';
    dog.error(message, result);
    _p(result.error);
    return await gitError(message);
  } else if (
    isTrue(result.success) &&
    [result.data, result.error].some(e =>
      new RegExp(`^from.*branch\\s*${fetchBrach}`, 'ig').test(e),
    )
  ) {
    if (!branch) {
      SUCCESS(`未设置默认远程分支，但是检测到远程存在同名分支
        `);
    }
  }
}

/**
 * ## 在没有找到同名远程分支（此时肯定没有远程分支设定）
 */
async function chooseForceOr() {
  const tip = ['强制推送', '设定远程', '直接退出'];
  const result = question({
    text: '当前未设定远程默认推送分支（也未找到同名分支）',
    tip,
  });
  dog('让用户选择', result);

  if (dun) {
    await gitError('测试退出');
  }
}
