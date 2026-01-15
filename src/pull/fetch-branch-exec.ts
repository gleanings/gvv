import { question, SUCCESS } from 'a-command';
import { _p, runOtherCode } from 'a-node-tools';
import { isFalse, isUndefined } from 'a-type-of-js';
import { dataStore } from '../data-store';
import { cwd } from '../data-store/cwd';
import { dog } from '../dog';
import { checkIsSIGINT, gitError, markVoluntaryWithdrawal } from '../utils';
import { waiting } from '../waiting';

/**
 * ## 执行请求
 * 线上分支情况，该方法在测试同名分支或默认推送分支成功后永远返回 `true`
 * 在即没有默认推送分支也没有线上同名分支时永远返回 `false` 或退出程序
 */
export async function execFetchBranch(): Promise<boolean> {
  const { gitInfo } = dataStore;
  const { localBranch, branch, alias } = gitInfo;
  const fetchBranch = branch || localBranch; // 拉取的分支
  const isHaveRemoteBranch = await checkRemoteBranch(alias, fetchBranch);

  if (isFalse(isHaveRemoteBranch)) {
    // 未找到同名分支（其实 branch 存在时可以跳过检测）
    return await chooseForceOr();
  } else if (!branch) {
    SUCCESS(`未设置默认远程分支，但是检测到远程存在同名分支
      `);
  }
  return true;
}

/**
 * ## 在没有找到同名远程分支（此时肯定没有远程分支设定）
 * @returns 返回 false ，无论是设定远程分支还是推送到同名分支，都跳过 merge
 */
export async function chooseForceOr(): Promise<boolean> {
  const tip = ['推送到同名分支', '设定其他远程分支名', '直接退出'];
  const result = await question({
    text: '当前未设定远程默认推送分支（也未找到同名分支）',
    tip,
    private: true,
  });
  dog('让用户选择', result);
  if (isUndefined(result) || result === tip[2])
    // 主动退出
    return await markVoluntaryWithdrawal();
  if (result === tip[0]) return false; // 推送到同名分支
  await inputOtherBranchName();
  return false;
}

/**
 * ## 等待用户输入其他分支名
 */
async function inputOtherBranchName() {
  const result = await question({
    text: '请输入您要设定的分支名',
  });
  const { gitInfo } = dataStore;
  const { alias } = gitInfo;
  if (isUndefined(result)) return await markVoluntaryWithdrawal(); // 用户退出
  dog('用户输入的其他分支名: ', alias, result);
  // dataStore.gitInfo.force = true;
  const isHaveRemoteBranch = await checkRemoteBranch(alias, result);
  if (isHaveRemoteBranch) {
    return await duplicateNamesNotAllowed();
  }

  await checkIsSIGINT(
    await runOtherCode(`git push --set-upstream ${alias} ${result}`),
  );

  dataStore.gitInfo.branch = result; // 设置新的分支
}

/**
 * ## 禁止同名
 */
async function duplicateNamesNotAllowed(): Promise<any> {
  const tip = ['更改', '退出'];
  const response = await question({
    text: '远端存在同名分支，更改还是退出？',
    tip,
    private: true,
  });
  if (isUndefined(response) || response === tip[1])
    return await markVoluntaryWithdrawal();
  await checkIsSIGINT(await runOtherCode('git remote -v'));
  _p(`当前远程分支情况为（尽量不使用已存在的远端分支名）：`);
  if (response === tip[0]) return inputOtherBranchName();
}

/**
 * 校验远程是否存在同名分支
 * @param alias 远程别名
 * @param branch 远程分支名
 */
async function checkRemoteBranch(
  alias: string,
  branch: string,
): Promise<boolean> {
  // 》〉》〉》
  // 仅拉取当前分支的设定默认绑定远程分支（不存在时则拉取同名的分支）
  // const code = 'git fetch --all';
  const code = `git fetch ${alias}  ${branch}`;
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
  await checkIsSIGINT(result);
  dog('请求线上代码', code, result);
  if (isFalse(result.success)) {
    if (
      [result.data, result.error].some(e =>
        new RegExp(`^fatal:?\\s*couldn't\\s+find\\s+remote\\s+ref`, 'ig').test(
          e,
        ),
      )
    ) {
      return false; // 未找到远程同名分支
    }
    const message = '拉取 <' + branch + '> 出错';
    dog.error(message, result);
    _p(result.error);
    return await gitError(message);
  }
  return true;
}
