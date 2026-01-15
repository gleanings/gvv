import { _p } from 'a-node-tools';
import { brightRedPen, cyanPen, yellowPen } from 'color-pen';
import { markVoluntaryWithdrawal } from '../utils';
/**
 * 推送出现错误
 * @param error
 */
export async function pushFail(error: string) {
  if (
    error.includes(
      'Updates were rejected because the tip of your current branch is behind',
    )
  ) {
    _p();
    _p(
      brightRedPen`看起来你的代码要落后于远程分支\n\r请尝试先使用 ${cyanPen`git fetch + git merge`} \n\r当然，在这之中可能还要解决${yellowPen`冲突的`}问题`,
    );
    _p();
  }

  await markVoluntaryWithdrawal(error);
}
