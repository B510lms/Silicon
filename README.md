# Silicon Valley Selection / 硅谷甄选运营平台

> 基于 Vue3 + TypeScript + Vite 构建的中后台管理系统，集成数据大屏、权限管理、商品管理等功能模块。

---

## 技术栈

- **核心框架**：Vue 3.5 + TypeScript 5.9 + Vite 7
- **UI 组件库**：Element Plus 2.13
- **状态管理**：Pinia 3.0
- **路由**：Vue Router 5.0 (Hash 模式)
- **HTTP 请求**：Axios（拦截器封装）
- **数据可视化**：ECharts 6 + echarts-liquidfill
- **CSS 预处理**：SCSS / Sass
- **代码规范**：ESLint + Prettier + Stylelint + Husky + Commitlint

---

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm（强制使用，npm/yarn 会被拦截）

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建

```bash
# 测试环境
pnpm build:test

# 生产环境
pnpm build:pro
```

### 代码检查与格式化

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm fix

# Prettier 格式化全部文件
pnpm format

# Stylelint 检查样式
pnpm lint:style
```

---

## 功能模块

| 模块 | 说明 |
|------|------|
| 登录认证 | 账号密码登录、Token 持久化、路由守卫鉴权 |
| 权限管理 | 动态路由（菜单级权限）、按钮级权限指令 `v-has` |
| 首页 | 用户信息展示、时间问候语 |
| 数据大屏 | ECharts 多图表、1920x1080 自适应缩放 |
| 商品管理 | 品牌 / 属性 / SPU / SKU 管理 |
| 系统管理 | 用户 / 角色 / 菜单管理 |

---

## 项目配置

### 环境变量

| 文件 | 环境 |
|------|------|
| `.env.development` | 开发环境 |
| `.env.test` | 测试环境 |
| `.env.production` | 生产环境 |

可配置的变量：

```env
VITE_APP_TITLE=项目标题
VITE_APP_BASE_API=/api
VITE_SERVE=http://后端服务地址:端口
```

### 代理配置

开发环境下，Vite 自动代理 `/api` 开头的请求到后端服务，解决跨域问题。详见 `vite.config.ts` 中的 `server.proxy` 配置。

### Mock 数据

开发环境下自动启用 Mock 服务，Mock 文件位于 `mock/` 目录。详见 `vite-plugin-mock` 配置。

---

## 项目结构

```
├── mock/              # Mock 接口
├── public/            # 静态资源
├── src/
│   ├── api/           # 接口请求（按模块划分）
│   ├── assets/        # 静态资源（含 SVG 图标）
│   ├── components/    # 全局组件
│   ├── directive/     # 自定义指令
│   ├── layout/        # 页面布局（侧边栏 + 顶部栏 + 内容区）
│   ├── router/        # 路由配置
│   ├── store/         # Pinia 状态管理
│   ├── styles/        # 全局样式（SCSS 变量 + Reset + 滚动条）
│   ├── utils/         # 工具函数（请求封装、Token、时间）
│   └── views/         # 页面视图
├── .env.*             # 环境变量
├── vite.config.ts     # Vite 构建配置
└── ...                # 各类配置文件
```

> 更详细的技术总结和搭建指南，请参阅 [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)。

---

## Git 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

提交类型：

- `feat`：新功能
- `fix`：Bug 修复
- `docs`：文档更新
- `style`：代码格式（不影响功能）
- `refactor`：重构
- `perf`：性能优化
- `test`：测试相关
- `chore`：构建/工具相关
- `build`：构建系统或依赖变更
- `revert`：回滚提交

示例：

```bash
git commit -m "feat: 新增用户管理模块"
git commit -m "fix: 修复登录页表单校验失效问题"
```

---

## 默认账号

| 账号 | 密码 |
|------|------|
| admin | 111111 |
| system | 111111 |

---

## 开发注意事项

1. **必须使用 pnpm**：项目通过 `preinstall` 脚本强制校验，使用 npm/yarn 会被拦截。
2. **代码提交前自动格式化**：Husky `pre-commit` 钩子会自动运行 Prettier 格式化。
3. **TypeScript 严格模式**：开启 `noUnusedLocals` 和 `noUnusedParameters`，未使用的变量会报错。
4. **SVG 图标**：将 `.svg` 文件放入 `src/assets/icons/` 目录，通过 `<svg-icon name="xxx" />` 使用。
5. **SCSS 全局变量**：`src/styles/variable.scss` 中的变量无需手动引入，Vite 已配置自动注入。
