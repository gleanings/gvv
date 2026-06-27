import { isUndefined } from '@vvi/is';
import { fileExist, getDirectoryBy, pathJoin } from '@vvi/node';
import { dog } from '../dog';
import { gitInfo } from './gitInfo';

/**  工作目录  */
export const cwd = (() => {
  /**  原工作目录  */
  const _cwd = process.cwd();
  /**  获取 .git 文件夹的位置  */
  const pwd = getDirectoryBy('.git', 'directory');
  ///  如果未获取到工作目录
  if (isUndefined(pwd)) {
    dog('未查找到 .git 说在目，返回执行命令之目录', _cwd);
    return _cwd;
  }
  /**  再次审视该目录  */
  const gitDirectoryPath = pathJoin(pwd, '.git');
  const gitFileExist = fileExist(gitDirectoryPath);
  /// 当获取或获取的值为 undefined 或为非文件夹
  if (isUndefined(gitFileExist) || !gitFileExist.isDirectory()) {
    dog('未查找到 .git 说在目，返回执行命令之目录', _cwd);
    return _cwd;
  }
  dog('执行命令的目录为', _cwd);
  dog('当前设定的工作目录为', pwd);
  /**  设置当前非根目录的标记  */
  if (pwd !== _cwd) gitInfo.isRoot = false;
  return pwd;
})();
