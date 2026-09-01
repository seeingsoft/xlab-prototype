# xlab 后台管理系统完整交互原型 GitHub Pages 部署记录 v1.0

- 记录时间：2026-09-01（Asia/Shanghai）
- 触发原因：原公开试用链接 `https://xlab-prototype-acceptance-map.lemony-jam-3603.chatgpt.site`（ChatGPT Code Runner 托管，project `appgprj_6a79bb56c1b0819194010f2bf283f80e`）于 2026-09-01 实测全路径 HTTP 403，DNS 正常、托管边缘仍在响应但拒绝非授权访问（`cache-control: private, no-store` + `server: cloudflare`）。原托管依赖平台访问策略，无法保证持续访问。
- 决策：经江确认，改用 GitHub Pages 持续托管（2026-09-01）。

## 新公开链接

- 首页：https://seeingsoft.github.io/xlab-prototype/
- 运营管理 Web：https://seeingsoft.github.io/xlab-prototype/admin/
- 运营管理 H5：https://seeingsoft.github.io/xlab-prototype/ops/
- 验收地图：https://seeingsoft.github.io/xlab-prototype/acceptance-map.html

## 发布方式

- 构建：`npm run build`（tsc -b && vite build && node scripts/build-sites.mjs），产物为 dist/。
- 部署目录：仅发布静态产物（index.html、acceptance-map.html、assets/*），并按 `/admin`、`/ops` 路径复制 index.html 为 `admin/index.html`、`ops/index.html`（应用以 `window.location.pathname.startsWith("/admin"|"/ops")` 路由，静态目录结构兼容）。不含 dist/server（该 Worker 仅用于 chatgpt.site 托管）。
- 仓库：https://github.com/seeingsoft/xlab-prototype （public；gh-pages 分支为发布产物，main 分支仅有 README；不包含源码与内部证据文档）
- 因本机 github.com:443 直连被网络阻断，经 GitHub Git Data API（api.github.com）上传并创建 gh-pages 分支；Pages 构建状态 `built`。

## 验证结果（2026-09-01）

| 路径 | 状态 |
|---|---|
| `/` | 200 |
| `/admin` → `/admin/` | 301 → 200 |
| `/ops` → `/ops/` | 301 → 200 |
| `/acceptance-map.html` | 200 |
| `/assets/*`（JS/CSS/PNG） | 200 |

页面 `<title>` 正确渲染；页面仍为纯合成数据原型，不连接数据库、AI Provider、通知渠道或身份系统。

## 边界

- 本记录不改变原安全门证据（v1.0/v1.1）的历史结论；原 chatgpt.site 链接状态以实测为准。
- 原型仍非正式产品，不代表 E0-A、S200 或任何业务代码验收。

## 修订 v1.1（2026-09-01）：修复子路径部署缺陷

首次部署后实测发现：三个入口页面只显示"跳到主要内容"（React 未挂载），验收地图按钮点击 404。

根因：Vite 默认 `base: '/'`，构建产物资源引用为根绝对路径（`/assets/...`），而 GitHub Pages 项目站点实际位于 `/xlab-prototype/` 子路径，浏览器请求 `/assets/...` 404 导致 JS 未加载；验收地图写死的 `/admin`、`/ops` 链接同样落到域名根 404；另 `pathname.startsWith("/admin")` 路由在 `/xlab-prototype/admin/` 前缀下不匹配。

修复（原型源码，已重建并重新发布 gh-pages 分支 commit `c25e7d9`）：

1. `vite.config.ts`：`base: "/xlab-prototype/"`，产物资源引用变为 `/xlab-prototype/assets/...`。
2. `src/App.tsx`：路由改为按路径段匹配（`pathname.split("/").includes("admin"|"ops")`），兼容任意前缀。
3. `src/App.tsx`、`src/AdminPrototype.tsx`：验收地图入口与 companion 图片改用 `import.meta.env.BASE_URL` 拼接。
4. `index.html`：icon 用 Vite 的 `%BASE_URL%` 占位符。
5. `public/acceptance-map.html`：链接改为相对路径 `./admin/`、`./ops/`。

验证（Playwright + 系统 Chrome 实测，2026-09-01）：

| 检查 | 结果 |
|---|---|
| `/`、`/admin/`、`/ops/` React 实际渲染（#root 挂载，非空壳） | PASS，无 JS 错误 |
| 验收地图 → 点击"电脑：管理台" → `/admin/` | PASS，跳转且渲染 |
| 家庭端 → 点击"验收地图"入口 → `/acceptance-map.html` | PASS |
| 资源 `/xlab-prototype/assets/*` | 全部 200 |

`npm test`：2 个测试文件、29 个测试通过。

## 修订 v1.2（2026-09-01）：三端嵌入"使用说明"帮助 tab

按江确认的《xlab原型使用说明-面向家长与运营-v0.1》内容，以 tab 形式嵌入三个端（gh-pages commit `5af4336`）：

| 端 | 入口位置 | 显示内容 |
|---|---|---|
| 家庭端 `/` | 底部导航第 4 个 tab"帮助" | 三入口表 + 家长和小朋友章节 + FAQ + 总结 |
| 运营 Web `/admin/` | 左侧导航新增"使用说明"项 | 三入口表 + 管理运营人员章节（6 步）+ FAQ + 总结 |
| 运营 H5 `/ops/` | 底部导航新增"帮助"tab | 三入口表 + 现场运营人员章节（4 步）+ FAQ + 总结 |

实现：新增共享组件 `src/HelpPanel.tsx`（按 scope 渲染对应章节），样式 `.help-*` 同时加入 `styles.css` 与 `admin.css`；运营 H5 底部导航 active 高亮由写死改为按当前 screen 判断。

验证（Playwright + Chrome，本地 preview 与线上 GitHub Pages 双测）：三端 help 均正常渲染、导航高亮正确、无 JS 错误；手机端表格单列无横向滚动；`npm test` 29 个测试通过。

## 修订 v1.3（2026-09-01）：入口移至顶栏并统一更名为"使用说明"

按江确认：三端入口从底部/侧边导航移至顶栏，"帮助"更名为"使用说明"（gh-pages commit `40340ec`）：

| 端 | 入口位置 |
|---|---|
| 家庭端 `/` | 顶栏（xlab logo 右侧），点击进入帮助页；底部导航恢复 3 个 tab |
| 运营 Web `/admin/` | 顶栏（验收地图旁、新建课程前），点击进入帮助页；侧边导航恢复 12 项 |
| 运营 H5 `/ops/` | 顶栏（"验收地图"旁），点击进入帮助页；底部导航恢复 4 个 tab |

实现：`Header`（家庭端）新增"使用说明"按钮；`AdminHeader`（运营 Web）新增 onHelp 按钮；`MobileHeader`（运营 H5）新增可选 onHelp 按钮与右侧 action 容器；文案统一为"使用说明"。

验证（本地 + 线上 GitHub Pages 实测）：三端顶栏入口均正常进入帮助页、旧位置无残留入口、无 JS 错误；`npm test` 29 个测试通过。
