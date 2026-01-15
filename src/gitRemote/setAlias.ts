import { _p } from 'a-node-tools';
import { isTrue } from 'a-type-of-js';
import { italicPen, pen } from 'color-pen';

import { dataStore } from '../data-store';
import { commandParameters } from '../data-store/commandParameters';

/**
 *
 * 设置一个远程库别名
 *
 * @param currentAlias 当前的远程库别名
 * @param [cover=false]  是否覆盖式设置值，用于打印信息不同判定的依据
 *
 */
export function setAlias(currentAlias: string, cover: boolean = false) {
  const { gitInfo } = dataStore;
  if (isTrue(cover)) {
    const message = (
      gitInfo.alias
        ? `未找到远程库别名为 ${commandParameters.alias} 的远程库，`
        : '当前'
    ).concat(
      `已自动选择第一个远程库别名为 ${pen.reversed(currentAlias)} 的远程库`,
    );
    _p(italicPen(message));
  }
  gitInfo.alias = currentAlias;
}
