# 四语日课

每天自动生成一则韩语原文，并展示日语、巴西葡语、西班牙语和粤语的自然表达、发音与重点词。

## 发布到 GitHub

1. 在 GitHub 新建一个仓库，例如 `daily-four-language-site`。
2. 把此目录的所有文件推送到仓库的 `main` 分支。
3. 在仓库的 **Settings → Secrets and variables → Actions** 新建 `OPENAI_API_KEY`。不要把密钥提交到文件中。
4. 在 **Settings → Pages** 将 Source 设为 **GitHub Actions**。
5. 打开 **Actions → Generate daily lesson → Run workflow**，生成首篇正式内容。

之后，工作流会在上海时间每天 07:13 自动生成新日课；每次提交都会触发 GitHub Pages 部署。

## 本地预览

直接用任意静态文件服务器打开此目录。由于网页通过 `fetch` 读取 JSON，不建议双击 `index.html` 使用 `file://` 协议。
