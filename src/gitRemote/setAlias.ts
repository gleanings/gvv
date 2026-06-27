import { isTrue } from '@vvi/is';
import { _p } from '@vvi/node';
import { italicPen, pen } from '@vvi/pen';

import { dataStore } from '../data-store';
import { commandParameters } from '../data-store/commandParameters';

/**
 * # 设置一个上游库别名
 * @param currentAlias 当前的上游库别名
 * @param [cover=false]  是否覆盖式设置值，用于打印信息不同判定的依据
 */
export function setAlias(currentAlias: string, cover: boolean = false) {
  const { gitInfo } = dataStore;
  if (isTrue(cover)) {
    const message = (
      gitInfo.alias
        ? `未找到上游库别名为 ${commandParameters.alias} 的上游库，`
        : '当前'
    ).concat(
      `已自动选择第一个上游库别名为 ${pen.reversed(currentAlias)} 的上游库`,
    );
    _p(italicPen(message));
  }
  gitInfo.alias = currentAlias;
}
