import { gitError, commonExit } from './utils';

/**  退出处理  */
function exit() {
  commonExit();
}

/**  退出前处理  */
async function beforeExit() {
  await gitError();
}

/**  注册意外退出前的操作  */
export function onExit() {
  process.on('beforeExit', beforeExit);
  process.on('exit', exit);
  process.on('SIGINT', beforeExit);
  process.on('SIGTERM', beforeExit);
}

/**  正常退出移除监听事件  */
export function removeExitEvent() {
  commonExit();
  process.removeListener('beforeExit', beforeExit);
  process.removeListener('exit', exit);
  process.removeListener('SIGINT', beforeExit);
  process.removeListener('SIGTERM', beforeExit);
}
