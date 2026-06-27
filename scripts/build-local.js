import { _p, isWindows, pathJoin, runOtherCode } from '@vvi/node';
import { copyTextToClipboard } from '@vvi/copy-text';
import { brightBlackPen, cyanPen, randomPen } from '@vvi/pen';

await runOtherCode('pnpm jja cls');

try {
  const deleteOldFile = await runOtherCode({
    code: 'pnpm jja rm dist *.tgz && npm run build',
    printLog: true,
  });
  if (!deleteOldFile.success) throw new Error();
} catch (error) {
  console.error(error);
  throw error;
}

_p(cyanPen('执行打包完毕'));
const pack = await runOtherCode({
  code: 'cd dist && npm pack',
  printLog: true,
});
const pwd = await runOtherCode({
  code: isWindows ? 'echo %cd%' : 'pwd',
  printLog: false,
});

const noLineBreak = str => str.replace(/\r?\n/g, '');
if (pack.success && pwd.success) {
  const result = pathJoin(
    noLineBreak(pwd.data),
    'dist',
    noLineBreak(pack.data),
  );
  _p(randomPen('npm install '), false);
  _p(randomPen(result));
  copyTextToClipboard(`npm install ${result}`);
  console.log(brightBlackPen('已复制到剪切板'));
}
