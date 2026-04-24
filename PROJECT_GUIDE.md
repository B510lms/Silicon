# Vue3 中后台管理项目搭建指南

> 基于本项目配置总结的前端工程化搭建手册，可用于快速复刻相同技术栈的新项目。

---

## 一、核心技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 3.5.24 | 组合式 API + `<script setup>` |
| 语言 | TypeScript | ~5.9.3 | 严格模式 |
| 构建工具 | Vite | 7.2.4 | 开发服务器 + 生产打包 |
| UI 组件库 | Element Plus | 2.13.0 | 含图标库 @element-plus/icons-vue |
| 状态管理 | Pinia | 3.0.4 | 替代 Vuex |
| 路由 | Vue Router | 5.0.4 | Hash 模式 |
| HTTP 请求 | Axios | 1.13.2 | 拦截器封装 |
| 图表 | ECharts | 6.0.0 | 含 liquidfill 水球图 |
| CSS 预处理 | Sass/SCSS | 1.97.1 | 全局变量配置 |
| 进度条 | NProgress | 0.2.0 | 路由切换进度 |
| 日期处理 | Moment | 2.30.1 | — |

---

## 二、工程化工具链

| 工具 | 版本 | 用途 |
|------|------|------|
| ESLint | 10.0.0 | JS/TS/Vue 代码检查 |
| Prettier | 3.7.4 | 代码格式化 |
| Stylelint | 16.26.1 | CSS/SCSS/Vue 样式检查 |
| Husky | 8.0.0 | Git Hooks 管理 |
| Commitlint | 20.3.0 | 提交信息规范校验 |
| vue-tsc | 3.1.4 | Vue 文件 TypeScript 类型检查 |

---

## 三、Vite 核心配置 (vite.config.ts)

### 3.1 插件配置

```ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: './',
    plugins: [
      vue(),
      // SVG 图标精灵：将 src/assets/icons 下的 SVG 合并为 symbol
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // Mock 服务：仅在开发环境启用
      viteMockServe({
        enable: command === 'serve',
      }),
    ],
    // ...
  }
})
```

### 3.2 路径别名

```ts
resolve: {
  alias: {
    "@": path.resolve("./src")
  }
}
```

配合 `tsconfig.app.json` 中的 `paths`：

```json
"paths": {
  "@/*": ["./src/*"]
}
```

### 3.3 SCSS 全局变量注入

```ts
css: {
  preprocessorOptions: {
    scss: {
      javascriptEnabled: true,
      additionalData: '@use "@/styles/variable.scss" as *;',
    },
  },
}
```

> **关键**：使用 `@use ... as *` 而非 `@import`，避免 Sass 弃用警告。

### 3.4 代理跨域

```ts
server: {
  proxy: {
    [env.VITE_APP_BASE_API]: {
      target: env.VITE_SERVE,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
}
```

---

## 四、多环境变量配置

### 4.1 文件结构

```
.env.development   # 开发环境
.env.test          # 测试环境
.env.production    # 生产环境
```

### 4.2 变量定义规范

```env
NODE_ENV = 'development'
VITE_APP_TITLE = '项目标题'
VITE_APP_BASE_API = '/api'
VITE_SERVE = 'http://后端地址:端口'
```

> 自定义变量必须以 `VITE_` 开头，才能在客户端代码中通过 `import.meta.env.VITE_XXX` 访问。

### 4.3 环境变量类型声明

在 `src/vite-env.d.ts` 中扩展：

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_SERVE: string
}
```

---

## 五、TypeScript 配置要点

### 5.1 项目引用 (Project References)

```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- `tsconfig.app.json`：应用代码配置（DOM 类型、Vue 文件）
- `tsconfig.node.json`：Node 环境配置（Vite 配置等）

### 5.2 应用配置关键项

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "preserve",
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

---

## 六、ESLint 配置 (.eslintrc.cjs)

### 6.1 核心配置

```js
module.exports = {
  env: { browser: true, es2021: true, node: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    ecmaFeatures: { jsx: true },
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-var': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/script-setup-uses-vars': 'error',
  },
}
```

---

## 七、Prettier 配置 (.prettierrc.json)

```json
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto",
  "trailingComma": "all",
  "tabWidth": 2
}
```

---

## 八、Stylelint 配置 (.stylelintrc.cjs)

```js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/vue',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recess-order',   // CSS 属性自动排序
    'stylelint-config-prettier',       // 与 Prettier 兼容
  ],
  overrides: [
    { files: ['**/*.(scss|css|vue|html)'], customSyntax: 'postcss-scss' },
    { files: ['**/*.(html|vue)'], customSyntax: 'postcss-html' },
  ],
  rules: {
    'value-keyword-case': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'v-deep', 'deep'] },
    ],
  },
}
```

---

## 九、Git 提交规范

### 9.1 Commitlint (commitlint.config.cjs)

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2, 'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build']
    ],
  },
}
```

### 9.2 Husky Hooks

- **pre-commit**：自动执行 `pnpm run format`
- **commit-msg**：校验提交信息格式

### 9.3 强制使用 pnpm (scripts/preinstall.js)

```js
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn('必须使用 pnpm 作为包管理器')
  process.exit(1)
}
```

---

## 十、项目目录结构

```
.
├── public/                    # 静态资源（不经过 Vite 处理）
├── mock/                      # Mock 数据接口
│   └── user.ts
├── src/
│   ├── api/                   # API 接口管理
│   │   └── [模块]/
│   │       ├── index.ts       # 接口请求函数
│   │       └── type.ts        # TS 类型定义
│   ├── assets/                # 静态资源（图片、SVG 图标）
│   │   └── icons/             # SVG 图标目录
│   ├── components/            # 全局组件
│   │   ├── SvgIcon/           # SVG 图标组件
│   │   ├── Pagination/        # 分页组件
│   │   ├── Category/          # 分类选择组件
│   │   └── index.ts           # 统一注册全局组件
│   ├── directive/             # 自定义指令
│   │   └── has.ts             # 按钮权限指令 v-has
│   ├── layout/                # 布局组件
│   │   ├── index.vue          # 主布局（菜单+内容区）
│   │   ├── logo/              # Logo 组件
│   │   ├── menu/              # 递归菜单组件
│   │   ├── main/              # 内容展示区
│   │   └── tabbar/            # 顶部导航栏
│   ├── router/                # 路由配置
│   │   ├── index.ts           # 路由实例
│   │   └── routes.ts          # 路由表（常量/异步/任意）
│   ├── store/                 # Pinia 状态管理
│   │   ├── index.ts           # Pinia 实例
│   │   └── modules/           # 各模块 Store
│   ├── styles/                # 全局样式
│   │   ├── index.scss         # 入口（滚动条等）
│   │   ├── reset.scss         # CSS Reset
│   │   └── variable.scss      # SCSS 全局变量
│   ├── utils/                 # 工具函数
│   │   ├── request.ts         # Axios 封装
│   │   ├── token.ts           # Token 本地存储
│   │   └── time.ts            # 时间相关工具
│   ├── views/                 # 页面视图
│   ├── App.vue                # 根组件
│   ├── main.ts                # 应用入口
│   ├── permisstion.ts         # 路由鉴权逻辑
│   ├── setting.ts             # 项目配置（标题/Logo）
│   └── vite-env.d.ts          # Vite 环境类型声明
├── .env.*                     # 环境变量文件
├── index.html                 # HTML 模板
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TS 项目引用配置
├── tsconfig.app.json          # 应用 TS 配置
├── tsconfig.node.json         # Node TS 配置
├── package.json               # 依赖与脚本
└── ...                        # 各类配置文件
```

---

## 十一、Axios 请求封装 (src/utils/request.ts)

### 11.1 封装要点

```ts
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 请求拦截器：注入 Token
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

// 响应拦截器：统一错误处理
request.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200) {
      ElMessage({ type: 'error', message: response.data.message })
      return Promise.reject(new Error(response.data.message))
    }
    return response.data
  },
  (error) => {
    const status = error.response?.status
    // 401/403/404/500 等状态码处理
    return Promise.reject(error)
  }
)
```

### 11.2 API 接口统一管理

```ts
// src/api/user/index.ts
import request from '@/utils/request'
import type { loginFormData, loginResponseData } from './type'

enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
```

---

## 十二、路由与权限设计

### 12.1 路由分类

| 类型 | 说明 | 示例 |
|------|------|------|
| 常量路由 | 所有用户可见 | 登录页、首页、404 |
| 异步路由 | 根据权限动态添加 | 权限管理、商品管理 |
| 任意路由 | 匹配所有未定义路径 | 重定向到 404 |

### 12.2 路由守卫 (src/permisstion.ts)

```ts
import router from '@/router'
import nprogress from 'nprogress'
import useUserStore from './store/modules/user'

router.beforeEach(async (to, from, next) => {
  nprogress.start()
  const token = userStore.token
  const username = userStore.username

  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next({ ...to }) // 防止异步路由未加载完出现空白
        } catch {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    to.path === '/login' ? next() : next({ path: '/login', query: { redirect: to.path } })
  }
})

router.afterEach(() => {
  nprogress.done()
})
```

### 12.3 动态路由过滤

```ts
function filterAsyncRoute(asyncRoute, routes) {
  return asyncRoute.filter((item) => {
    if (routes.includes(item.name)) {
      if (item.children?.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 在获取用户信息后动态添加路由
userAsyncRoute.forEach((route) => router.addRoute(route))
```

### 12.4 按钮级权限 (自定义指令)

```ts
// src/directive/has.ts
export const isHasButton = (app) => {
  app.directive('has', {
    mounted(el, options) {
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
```

使用：`<el-button v-has="'btn.user.add'">新增</el-button>`

---

## 十三、Pinia 状态管理

### 13.1 大仓库 (src/store/index.ts)

```ts
import { createPinia } from 'pinia'
export default createPinia()
```

### 13.2 用户仓库 (src/store/modules/user.ts)

```ts
import { defineStore } from 'pinia'

const useUserStore = defineStore('User', {
  state: (): UserState => ({
    token: GET_TOKEN(),
    menuRoutes: constantRoute,
    username: '',
    avatar: '',
    buttons: [],
  }),
  actions: {
    async userLogin(data) { /* ... */ },
    async userInfo() { /* ... */ },
    async userLogout() { /* ... */ },
  },
})
```

---

## 十四、全局组件注册

```ts
// src/components/index.ts
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
  install(app) {
    app.component('SvgIcon', SvgIcon)
    app.component('Pagination', Pagination)
    // 注册所有 Element Plus 图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
```

在 `main.ts` 中使用：

```ts
import globalComponent from './components'
app.use(globalComponent)
```

---

## 十五、SVG 图标使用

### 15.1 组件封装 (SvgIcon)

```vue
<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>
```

### 15.2 使用方式

```vue
<svg-icon name="welcome" width="600px" height="300px" color="red" />
```

### 15.3 入口注册

```ts
// main.ts
import 'virtual:svg-icons-register'
```

---

## 十六、数据大屏适配方案

基于 `transform: scale()` 的等比例缩放方案：

```ts
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
```

配合固定宽高容器（1920x1080）和 `transform-origin: left top`，实现大屏自适应。

---

## 十七、package.json Scripts

```json
{
  "scripts": {
    "dev": "vite --open",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint src",
    "fix": "eslint src --fix",
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
    "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
    "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix",
    "prepare": "husky install",
    "commitlint": "commitlint --config commitlint.config.cjs -e -V",
    "preinstall": "node ./scripts/preinstall.js"
  }
}
```

---

## 十八、新项目搭建步骤

### Step 1：创建 Vite 项目

```bash
pnpm create vite@latest my-project --template vue-ts
```

### Step 2：安装核心依赖

```bash
pnpm add vue-router@next pinia axios element-plus @element-plus/icons-vue nprogress echarts echarts-liquidfill moment
```

### Step 3：安装开发依赖

```bash
pnpm add -D sass sass-loader @vitejs/plugin-vue vite-plugin-mock vite-plugin-svg-icons mockjs @types/node @types/nprogress
```

### Step 4：安装代码规范工具

```bash
pnpm add -D eslint prettier stylelint husky @commitlint/cli @commitlint/config-conventional
pnpm add -D eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript-eslint
pnpm add -D eslint-config-prettier eslint-plugin-prettier
pnpm add -D stylelint-config-standard stylelint-config-standard-scss stylelint-config-standard-vue
pnpm add -D stylelint-config-recess-order stylelint-config-prettier stylelint-order stylelint-scss
pnpm add -D postcss postcss-scss postcss-html
```

### Step 5：复制配置文件

将本项目的以下配置文件复制到新项目：

- `vite.config.ts`
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`
- `.eslintrc.cjs`
- `.prettierrc.json`
- `.stylelintrc.cjs`
- `.eslintignore` / `.prettierignore` / `.stylelintignore`
- `commitlint.config.cjs`
- `.env.development` / `.env.test` / `.env.production`
- `.gitignore`
- `index.html`

### Step 6：初始化 Husky

```bash
npx husky install
npx husky add .husky/pre-commit "pnpm run format"
npx husky add .husky/commit-msg "pnpm commitlint"
```

### Step 7：按目录结构搭建业务代码

---

## 十九、常见问题

### Q1：Sass `@import` 被弃用

使用 `@use` 替代：

```scss
// 变量文件 variable.scss
$base-menu-width: 260px;

// 使用文件
@use '@/styles/variable.scss' as *;
```

### Q2：开发时代理不生效

确保 `.env.development` 中变量以 `VITE_` 开头，且 Vite 配置中正确读取：

```ts
const env = loadEnv(mode, process.cwd())
```

### Q3：Element Plus 图标不显示

在全局组件注册文件中引入并注册：

```ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

### Q4：Mock 接口 404

检查 `vite-plugin-mock` 的 `enable` 配置：

```ts
viteMockServe({ enable: command === 'serve' })
```

Mock 文件需放在 `mock/` 目录下，使用默认导出数组格式。
