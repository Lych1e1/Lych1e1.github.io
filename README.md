# Lych1e

基于 [Hugo](https://gohugo.io/) 构建的个人笔记站点，使用自定义布局与样式，并通过 GitHub Actions 自动发布到 GitHub Pages。

- 站点地址：<https://lych1e1.github.io/>
- 内容语言：简体中文
- 文章地址格式：`/notes/<文章文件名>/`

## 环境要求

- [Git](https://git-scm.com/)
- [Hugo Extended](https://gohugo.io/installation/) `0.153.3` 或兼容版本
- 可选：[GitHub CLI](https://cli.github.com/)，用于在终端查看部署状态

确认本地环境：

```powershell
git --version
hugo version
```

## 项目结构

```text
.
|-- .github/
|   `-- workflows/
|       `-- hugo.yml              # GitHub Pages 构建与部署工作流
|-- archetypes/
|   `-- default.md                # hugo new 使用的文章 Front Matter 模板
|-- assets/
|   |-- css/main.css              # 站点与文章排版样式
|   `-- js/main.js                # 页面交互逻辑
|-- content/
|   `-- posts/                    # Markdown 文章源文件
|-- layouts/
|   |-- _partials/head.html       # head、资源加载及站点元信息
|   |-- baseof.html               # 页面基础骨架
|   |-- home.html                 # 首页
|   |-- list.html                 # 列表页
|   |-- single.html               # 文章页
|   `-- 404.html                  # 404 页面
|-- static/
|   |-- images/                   # 图片等静态资源，构建时复制到站点根目录
|   `-- favicon.svg               # 站点图标
|-- hugo.toml                     # Hugo 站点配置与永久链接规则
`-- README.md                     # 项目说明
```

以下目录由 Hugo 保留或生成：

- `data/`、`i18n/`、`themes/`：为后续数据、多语言和主题扩展预留。
- `public/`：本地构建产物，已被 Git 忽略，不需要提交。
- `resources/_gen/`：Hugo 资源处理缓存，已被 Git 忽略。

## 发布新文章

### 1. 同步主分支

开始写作前先同步远端，避免在旧版本上修改：

```powershell
git switch main
git pull --ff-only origin main
```

### 2. 创建草稿

文件名使用简短的英文小写单词，并用连字符分隔。文件名会成为最终 URL 的一部分。

```powershell
hugo new content posts/my-new-note.md
```

命令会根据 `archetypes/default.md` 创建 `content/posts/my-new-note.md`。此时线上地址将是：

```text
https://lych1e1.github.io/notes/my-new-note/
```

### 3. 编辑文章信息与正文

推荐的 Front Matter：

```yaml
---
title: "文章标题"
date: 2026-09-03T14:00:00+08:00
draft: true
description: "用于首页摘要和页面描述的一句话。"
tags:
  - 标签一
  - 标签二
---
```

在 Front Matter 下方使用 Markdown 编写正文。需要手动控制首页摘要截断位置时，插入：

```html
<!--more-->
```

文章图片放入 `static/images/`，正文中使用站点根路径引用：

```markdown
![图片说明](/images/example.webp)
```

### 4. 本地预览草稿

```powershell
hugo server --buildDrafts
```

打开 <http://localhost:1313/> 检查首页摘要、文章正文、代码块、图片以及手机端排版。修改 Markdown 或样式后，Hugo 会自动刷新页面。预览结束后按 `Ctrl+C` 停止服务。

### 5. 标记为正式发布

确认内容无误后，将文章 Front Matter 中的：

```yaml
draft: true
```

改为：

```yaml
draft: false
```

草稿不会出现在正式构建中。若 `date` 晚于构建时间，Hugo 默认也不会发布该文章。

### 6. 执行正式构建

```powershell
hugo --gc --minify
```

构建成功后会生成 `public/`。该目录只用于本地检查，GitHub Actions 会在云端重新生成，因此不要使用 `git add -f` 提交它。

### 7. 检查并提交文章

```powershell
git status --short
git diff -- content/posts/my-new-note.md
git add content/posts/my-new-note.md
git commit -m "Publish my new note"
git push origin main
```

如果文章同时新增了图片，需要一并暂存：

```powershell
git add content/posts/my-new-note.md static/images/example.webp
```

### 8. 确认自动部署

推送到 `main` 后，`.github/workflows/hugo.yml` 会依次执行 Hugo 构建、上传站点产物并部署到 GitHub Pages。可以在仓库的 **Actions** 页面查看进度，也可以使用 GitHub CLI：

```powershell
gh run list --workflow hugo.yml --limit 1
gh run watch <run-id> --exit-status
```

工作流成功后，访问文章地址并强制刷新浏览器，确认正文、图片和样式均已更新：

```text
https://lych1e1.github.io/notes/my-new-note/
```

## 常用命令

```powershell
# 预览草稿
hugo server --buildDrafts

# 只预览正式文章
hugo server

# 正式构建
hugo --gc --minify

# 检查工作区状态
git status --short --branch
```
