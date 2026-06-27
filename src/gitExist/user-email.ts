import { question } from '@vvi/command';
import { isEmptyString, isUndefined } from '@vvi/is';
import { runOtherCode } from '@vvi/node';
import { checkIsSIGINT, gitError, markVoluntaryWithdrawal } from '../utils';
import { cwd } from './../data-store/cwd';
import { dog } from './../dog';

/**
 * # git 的账户
 */
export async function gitUserEmail() {
  let code = 'git config user.email';
  /**  本地仓库的用户名  */
  const localUserEmail = await runOtherCode({ code, cwd });
  await checkIsSIGINT(localUserEmail);
  dog('本地仓库的名', code, localUserEmail);
  code = 'git config --global user.email';
  /**  全局的用户名  */
  const globalUserEmail = await runOtherCode({ code, cwd });
  await checkIsSIGINT(globalUserEmail);
  dog('全局仓库的邮箱', code, globalUserEmail);

  if ([localUserEmail.data, globalUserEmail.data].every(e => isEmptyString(e)))
    return await setUserEmail();

  dog('当前使用邮箱 📮 数据', localUserEmail, globalUserEmail);
}

/**
 * # 设置 git 的用户名
 */
export async function setUserEmail() {
  const email = await question({
    text: '请 🔧 配置您的 git 的用户 📮 邮箱',
    required: true,
  });

  if (isUndefined(email)) {
    return await markVoluntaryWithdrawal();
  }

  if (isEmptyString(email)) {
    await gitError('邮箱 📮 不能为🈳');
  } else {
    const code = `git config --global user.email "${email}"`;
    const result = await runOtherCode({ code, cwd });
    await checkIsSIGINT(result);
    dog('设置用户的名', email, code, result);
  }
}
