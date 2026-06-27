import { isUndefined } from '@vvi/is';
import {
  getDirectoryBy,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
} from '@vvi/node';
import { dataStore } from '../data-store';
import { cwd } from '../data-store/cwd';
import { gitError } from '../utils';
import { dog } from './../dog';

/**
 *
 * 获取当前执行的版本的信息
 *
 * @param [test=false]  是否为测试环境
 *
 */
export async function getVersion(test: boolean = false) {
  const { pkg, gitInfo, commandParameters } = dataStore;

  const packageJsonDir = getDirectoryBy('package.json', 'file');

  if (isUndefined(packageJsonDir)) {
    dog.error('查找 package.json 文件出错');
    return await gitError('未找到 package.json 文件');
  }

  const path = (pkg.path = pathJoin(packageJsonDir, 'package.json'));

  const packageJson = readFileToJsonSync<PackageJson>(path);

  const version = packageJson?.version || '';
  dog(`获取到的版本号为 <${version}>`);

  dog(`当前 package 的目录和 根目录 `, packageJsonDir, cwd);

  pkg.version = version;
  if (!test) {
    dataStore.tag =
      commandParameters.tag =
      gitInfo.tag =
        packageJsonDir === cwd
          ? `v${version}`
          : (packageJson?.name ?? 'core')
              .replace(/[-/@]/gm, '_')
              .concat(version);
  }
}
