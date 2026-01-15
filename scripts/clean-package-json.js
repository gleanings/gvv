import { pathJoin, writeJsonFileSync, getPackageJsonSync } from 'a-node-tools';
import { isNull } from 'a-type-of-js';
import { dirname } from 'node:path';

const packageJsonResponse = getPackageJsonSync();

if (isNull(packageJsonResponse)) {
  throw new RangeError('未能识别配置文件 package.json');
}

let packageJson = packageJsonResponse.content;

[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
].forEach(key => delete packageJson[key]);

packageJson = {
  ...packageJson,
  author: {
    name: '泥豆君',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://earthnut.dev',
  },
  description: 'git add ➞ git commit ➞ git push',
  license: 'MIT',
  files: ['bin.js', 'LICENSE', 'README.md', 'THIRD-PARTY-LICENSES.txt'],
  keywords: ['gvv', 'git', 'push', 'commit', 'add', 'tag'],
  homepage: 'https://earthnut.dev/npm/gvv',
  bugs: {
    url: 'https://github.com/MrMudBean/gvv/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/MrMudBean/gvv.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  bin: {
    gvv: './bin.js',
  },
  engines: {
    // 新增：声明 Node.js 兼容版本
    node: '>=18.0.0',
  },
};

// 写入 dist/package.json
{
  writeJsonFileSync(
    pathJoin(dirname(packageJsonResponse.path), './dist/package.json'),
    packageJson,
  );
}
