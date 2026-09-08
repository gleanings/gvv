# git velocity voyager (gvv 一键 git 提交)

[![version](<https://img.shields.io/npm/v/gvv.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/gvv) [![bug 🙋‍♂️ 提交](<https://img.shields.io/badge/☣️-bug_%20_提交-rgb(255,0,63)>)](https://github.com/gleanings/gvv/issues)

---

一键 git 提交，在根目录将执行 `git add . && git commit -m "commit message" && git push origin main`

原来是通过一段 `shell` 命令执行推送：

```bash
bash -c 'git add . && git commit -m \"deploy:   $(date +\"%Y-%m-%d %H:%M:%S\")${1:+ }$1\" && git push origin main' --
```

## 安装

```bash
npm install gvv --save-dev
```

## 使用

gvv 有两种创建模式：

### 勾子中携带类型模式创建

在 package.json 中添加 scripts 配置，然后使用 npm run 命令即可

```json
{
  "scripts": {
    "push:submit": "gvv",
    "push:version": "gvv"
  }
}
```

- 该模式需注意不要使用 `"push:kind" : "npx gvv"` 的形式，否则导致无法读取到附带的 `kind` 数据
- 但可以使用 `"push:kind" : "npx gvv -k kind"` 的形式，但需要手动指定 `kind` 数据

### 命令行自定义类型模式创建

```json
{
  "scripts": {
    "submit": "gvv kind submit",
    "version": "gvv -k version",
    "styles": "gvv -k styles -m '更新样式文件'"
  }
}
```

- `-k` 手动设置 `kind` 数据在理论上优先级要高于勾子中携带类型模式

```json
{
  "scripts": {
    "push:version": "gvv -k submit"
  }
}
```

上面的例子中，将获取 `kind` 数据为 `submit`

无论是使用勾子中携带类型模式 还是命令行自定义类型模式，都要注意安装在本地后

### 搭配上面的勾子使用

使用 `npm run xxx` 的模式调用执行，但是需要注意⚠️，后续若要跟参数命令行参数，则需要使用 `--` ，否则会导致 `npm` 自动解析命令而舍弃后面带 `-` 的参数

```bash
# 以勾子中携带类型模式为主
npm run push:version -- -m "新版本" "添加主要功能" -m "待完善上游配置"
# 以命令行自定义类型模式为主，自定义的 kind 数据优先级要高于勾子中携带类型模式
npm run push:version -- -k submit -m "新版本" "添加主要功能" -m "待完善上游库配置"
# 以命令行自定义类型模式为主
npm run version -- -k version -m "新版本" "添加主要功能" -m "待完善上游库配置"
```

### 命令行自定义类型使用

使用 `npx gvv` 的模式进行提交

```bash
# 默认简单提交
npx gvv
# 简单的提交版本更新而使用仅时间的信息
npx gvv -k version
# 使用默认提交类型 （两个 `-m` 不是必须的，仅是告诉你接受多同名参数）
npx gvv -m "新版本" "添加主要功能" -m "待完善上游库配置"
```

### 推荐类型

我个人仅使用了 "version" 和 "push"

- feat 新功能
- fix 修复
- docs 文档
- style 样式
- refactor 重构
- test 测试
- build 构建
- ci 持续集成
- perf 性能优化
- revert 回滚
- other 其他
- chore 构架/工具链优化（不影响）
- version 版本提交（我主要根据）

## 状态

此软件包是 `MrMudBean` 生态系统的一部分。
它使用严格的 TypeScript 编写，并通过 Rollup 构建进行验证。
虽然单元测试较少，但 API 稳定，并在生产环境中大量使用。
