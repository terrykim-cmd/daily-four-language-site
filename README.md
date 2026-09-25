# 四语日课

每天发布一则韩语原文，并展示日语、巴西葡语、西班牙语和粤语的自然表达、发音与重点词。

## 发布到 GitHub

1. 在 GitHub 新建一个仓库，例如 `daily-four-language-site`。
2. 把此目录的所有文件推送到仓库的 `main` 分支。
3. 在 **Settings → Pages** 将 Source 设为 **GitHub Actions**。

日课内容由 Codex 在你的要求下生成并提交到 `content/`。每次推送都会触发 GitHub Pages 部署，因此不需要 API Key、服务器或额外费用。

## 本地预览

直接用任意静态文件服务器打开此目录。由于网页通过 `fetch` 读取 JSON，不建议双击 `index.html` 使用 `file://` 协议。
