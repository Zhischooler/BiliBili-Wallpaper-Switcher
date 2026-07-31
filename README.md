# BiliBili-Wallpaper-Switcher
# 语言
- [English README](README-EN.md)
# 介绍
- 在哔哩哔哩页面注入自定义壁纸的浏览器扩展（Manifest V3）。支持上传本地图片、调节透明度与遮罩颜色，适用于在 bilibili.com 页面自定义/替换背景图。

## 功能
- 在哔哩哔哩站内注入自定义壁纸
- 可调节壁纸透明度
- 支持遮罩颜色（用于调整整体视觉效果）
- 在匹配页面自动生效（host_permissions: *.bilibili.com）

## 截图
（若需截图，请把图片放到 `icons/` 或仓库其他目录并更新此处）
- 图标与弹出窗口（icons/icon.png / src/popup/popup.html）

## 安装（开发者模式）
1. 打开 Chrome/Edge 浏览器，进入扩展页面：
   - chrome://extensions/ 或 edge://extensions/
2. 启用右上角的「开发者模式」。
3. 点击 “加载已解压的扩展程序（Load unpacked）”，选择仓库根目录（包含 manifest.json 的目录）。
4. 加载后在哔哩哔哩任意页面测试扩展。

## 使用说明
1. 在浏览器工具栏点击扩展图标打开弹出窗口（popup）。
2. 上传或选择要用作背景的图片。
3. 使用透明度滑块调整壁纸透明度。
4. 使用遮罩颜色选择器设置页面遮罩颜色（可改善页面可读性或氛围）。
5. 页面会在匹配的 bilibili 域名下自动注入样式与脚本（manifest 中配置 `content_scripts`）。

## 权限说明
- storage：用于保存用户设置（例如已上传图片的引用、透明度、遮罩颜色）。
- scripting、activeTab：注入脚本/样式到当前标签页以替换/覆盖页面背景。
- host_permissions：仅允许匹配 `*://*.bilibili.com/*` 的页面。

## 项目结构
- `manifest.json`
- `src/`
  - `content-bilibili.js` - 注入到 bilibili 页面的脚本（负责插入/管理背景）
  - `styles/bilibili.css` - 注入的样式
  - `popup/` - 弹出窗口的 HTML/JS/CSS
- `icons/` - 扩展图标



## 调试
- 修改代码后，需在扩展页点击“刷新”以加载最新改动（开发者模式下）。
## 兼容性
- 基于 Chromium 的浏览器（Chrome、Edge、Brave 等）支持 Manifest V3。
- 由于使用了 `host_permissions` 指向 `*.bilibili.com`，在其他网站不生效。

## 隐私与安全
- 本扩展仅在 bilibili.com 域名下运行并保存用户选择的图片与设置到浏览器本地（storage）。不会上传用户图片到任何远端服务。


