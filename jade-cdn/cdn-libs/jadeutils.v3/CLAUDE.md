# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

jadeutils.v3 是一个个人前端工具库，作为 CDN 静态资源部署到 nginx。包含 TypeScript 通用工具库、HTML5 Canvas 2D 几何库、桌面式窗口 UI 系统、TRPG 沙盘，以及博客/Wiki 页面框架。CSS 主题使用 Less 编写。

## 构建命令

```bash
# 使用 .nvmrc 指定的 Node 版本 (v22.22.2)
nvm use

# 完整构建（编译 TS + Less，输出到 webroot/，再拷贝到 nginx 目录并打包 tar.gz）
bash build.sh

# 仅编译 TypeScript + 压缩，并部署到 nginx
bash deploy-test.sh

# 仅编译 TypeScript（含类型声明 .d.ts）
npx gulp process-typescript

# 编译并压缩 TypeScript（.min.js）
npx gulp compress-typescript

# 编译所有主题的 Less → CSS
npx gulp

# 单独编译 window-ui 主题
npx gulp process-style-window-ui
```

## 源码架构

TypeScript 源文件按依赖顺序排列（gulpfile.js 中的编译顺序即依赖顺序）：

### 基础层（无内部依赖）
- `src/scripts/ts/resource.ts` — Base64 内嵌图标、默认图片资源（DefaultIconGroup, IconGroup）
- `src/scripts/ts/basic.ts` — 基础工具：NumUtil（数字格式化）、StrUtil、TimeUtil、ColorRGB
- `src/scripts/ts/dataStructure.ts` — 数据结构：SimpleMap（顺序保留的 Map 实现）

### 几何与图形层
- `src/scripts/ts/geo2d.ts` — 2D 几何库：Point2D, Line2D, Rectangle2D, Circle2D, Polygon2D, Ray2D。定义 IGeo2D / GeoShape2D 接口，提供碰撞检测、最近点计算
- `src/scripts/ts/canvas.ts` — Canvas 2D 绘图抽象：ICanvas2D 接口、CanvasShape2D 基类、ImageClip 图片裁剪，依赖 geo2d

### Web 工具层
- `src/scripts/ts/web.ts` — HTTP 请求（WebUtil.ajax）、Base64 图片类型定义（IBase64Img, Base64ImgType）、自定义 HTML 元素 EscapeUnicode，依赖 basic 和 dataStructure
- `src/scripts/ts/webHtmlPage.ts` — 通用 HTML 页面框架：PageConfig, WebHtmlPage 类（导航栏、侧栏、页脚、搜索渲染），依赖 web
- `src/scripts/ts/3rdLibTool.ts` — 第三方库封装：SyntaxHighlighterHelper, MathJaxHelper, BootStrapHelper, DataTableHelper, ShowdownUtils

### 业务应用层
- `src/scripts/ts/wiki.ts` — Wiki 页面，依赖 webHtmlPage 和 3rdLibTool
- `src/scripts/ts/blog.ts` — 博客页面（用户信息、推荐文章列表、评论系统），依赖 webHtmlPage 和 web
- `src/scripts/ts/UIWindow.ts` — 桌面式窗口 UI 系统：可拖拽/缩放的窗口、Dock 任务栏、Z-index 管理、桌面配置
- `src/scripts/ts/sandtable.ts` — TRPG 战棋沙盘：Token 管理、视野/可见性（glimmer/dark）、Canvas 战争迷雾

### 测试/Demo（编译但不互相依赖）
- `src/scripts/ts/testJadeTRPG.ts`, `testJadeUtils.ts`, `testJadeUI.ts` — 手动测试页面脚本

### TypeScript 声明引用
- `src/scripts/include/refTypes.d.ts` — 外部类型声明（目前为空，曾被用于 jQuery 声明）

## 编译输出

- TypeScript 编译为 ES6 模块（`target: "es6"`, `module: "es6"`），输出 `.js` 和 `.d.ts` 到 `webroot/scripts/ts/`
- 严格模式：`noImplicitAny: true`, `strict: true`
- Less 主题编译为合并后的 `all.css` 和 `all.min.css`，输出到 `webroot/themes/<theme>/styles/`

## 目录结构

| 目录 | 用途 |
|------|------|
| `src/scripts/ts/` | TypeScript 源码 |
| `src/scripts/include/` | 外部类型声明 |
| `src/themes/` | Less 源文件（hobbit, lo-fi, paper-print, window-ui, trpg）+ 图片资源 |
| `src/html/` | HTML 测试页面 |
| `webroot/` | 构建产物输出目录 |
| `docs/` | 文档（geo.md, gnuplot 数学图表, plantuml UML 图） |

## 主题系统

主题定义在 `gulpfile.js` 顶部的 `themes` 数组中。每个主题在 `src/themes/<theme>/` 下拥有独立的 `images/` 和 `styles/` 目录。Less 编译时会将 `src/themes/comm.less` 作为公共样式与各主题样式合并。
