import { isFalse, isUndefined } from '@vvi/is';
import { command } from './command';
import { dataStore } from './data-store';
import { dog, dun } from './dog';
import { getMessage } from './gitStatus/getMessage';
import { getVersion } from './tag/getVersion';

/**
 * # 解析参数
 */
export function parseArgs(): void {
  const { commandParameters } = dataStore;
  /**
   * 用户输入实际的参数
   */
  const args = command.args;

  /**  使用参数的 map 形式  */
  const argsMap = args.$map;

  const kind = argsMap.kind;

  /**
   * 获取用户输入的 kind 参数
   *
   * 在 kind 参数中，默认为提交代码，即 kind = submit
   *
   * 在 kind 值为 version 时，自动添加 tag 参数
   */
  if (!isUndefined(kind)) {
    commandParameters.kind = dataStore.kind =
      (kind.value && kind.value[0].toString()) || 'submit';
  }
  // 当用户没有 kind 参数时，尝试从 npm_lifecycle_event 获取生命周期
  else {
    /**  获取生命周期  */
    const lifeCycle = process.env.npm_lifecycle_event || '';
    /**  获取生命周期转换列表  */
    const list = lifeCycle.split(':');

    if (list.length === 2 && list[0] === 'push') {
      commandParameters.kind = dataStore.kind = list[1];
    }
    // 不符合 `push:xxx` 规则的默认为 submit
    else {
      commandParameters.kind = dataStore.kind = 'submit';
    }
  }

  const tag = argsMap.tag;
  // 获取用户输入的 tag 参数
  if (tag) {
    commandParameters.tag = dataStore.tag =
      (tag.value && tag.value[0]) || dataStore.kind === 'version';
  }

  const message = argsMap.message;
  // 获取用户输入的 message 参数
  if (message && message.value && message.value.length > 0) {
    dataStore.message = [...args.$nomatch, ...message.value];
    commandParameters.message = [...dataStore.message];
  } else {
    dataStore.message = [...args.$nomatch];
    commandParameters.message = [...dataStore.message];
  }

  const force = argsMap.force;
  // 是否为强制推送
  if (force && force.value && !isFalse(force.value[0])) {
    commandParameters.force = dataStore.gitInfo.force = true;
  }

  // 获取用户输入的 init 参数
  // 实际在包含 init 参数时，会自动执行 git init 操作，且丢弃其他数据
  if (argsMap['init']) {
    commandParameters.init = dataStore.init = true;
  }

  const alias = argsMap['alias'];
  if (alias && alias.value) {
    commandParameters.alias = alias.value[0].toString();
  }

  const branch = argsMap.branch;
  if (branch && branch.value) {
    commandParameters.branch = branch.value[0].toString();
  }

  if (dun) {
    getVersion(true);
    dog('参数解析完毕', dataStore);
    dog('tag 使用消息', getMessage());
    dog('推送使用消息', getMessage(true));
    // command.error();
  }
}
