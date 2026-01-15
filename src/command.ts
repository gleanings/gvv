import { Args } from 'a-command';
import { redPen } from 'color-pen';

/**
 * 终端命令
 */
const command = new Args<{
  alias: undefined;
  branch: undefined;
  force: undefined;
  init: undefined;
  kind: undefined;
  message: undefined;
  tag: undefined;
}>('gvv');

command.bind([
  'alias <-a> (别名，默认为 `origin`，可自定义)',
  'branch <-b> (分支名称，默认为当前分支 git branch --show-current)',
  `force <-f> (强制提交，默认为 \`false\` ${redPen('慎用')})`,
  `init <-i> (初始化 git 仓库，默认为 \`false\`。该命令仅初始化)`,
  'kind <-k> (提交的类型，缺省值值 `submit`)',
  'message <-m> (提交的信息，缺省时仅为 `type : time` 模式)',
  'tag <-t> (是否提交标签，在 kind 为 `version` 时默认携带)',
]);

// 运行命令，开始执行解析参数
command.run();

command.isEnd(true);

export { command };
