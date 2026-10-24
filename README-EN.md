# BiliBili-Wallpaper-Switcher
# Language
- [Chinese README](README.md)
# About
 > A browser extension (Manifest V3) that injects custom wallpapers into Bilibili pages. Supports uploading local images, adjusting transparency and mask color, and is suitable for customizing/replacing background images on the bilibili.com page.

> [!IMPORTANT]
> Project Not Update

## Function
- Inject custom wallpapers into Bilibili site
- Adjustable wallpaper transparency
-Support mask color (used to adjust the overall visual effect)
- Automatically takes effect on the matching page (host_permissions: *.bilibili.com)

## Screenshot
(If you need to take a screenshot, please put the image in `icons/` or other directories in the warehouse and update here)
- Icons and pop-up windows (icons/icon.png / src/popup/popup.html)

## Installation (developer mode)
1. Open the Chrome/Edge browser and enter the extension page: 
- chrome://extensions/ or edge://extensions/
2. Enable "Developer Mode" in the upper right corner.
3. Click "Load unpacked" and select the warehouse root directory (the directory containing manifest.json).
4. After loading, test the extension on any page of Bilibili.

## Instructions for use
1. Click the extension icon on the browser toolbar to open the pop-up window.
2. Upload or select an image to use as your background.
3. Use the transparency slider to adjust the wallpaper transparency.
4. Use the mask color picker to set the page mask color (which can improve page readability or atmosphere).
5. The page will automatically inject styles and scripts under the matching bilibili domain name (`content_scripts` is configured in the manifest).

## Permission description
- storage: used to save user settings (such as reference, transparency, mask color of uploaded images).
- scripting, activeTab: Inject script/style into the current tab to replace/cover the page background.
- host_permissions: Only pages matching `*://*.bilibili.com/*` are allowed.

## Project structure
- `manifest.json`
- `src/` 
- `content-bilibili.js` - script injected into bilibili page (responsible for inserting/managing background) 
- `styles/bilibili.css` - injected styles 
- `popup/` - HTML/JS/CSS for popup windows
- `icons/` - extension icons



## Debugging
- After modifying the code, you need to click "Refresh" on the extension page to load the latest changes (in developer mode).
## Compatibility
- Chromium-based browsers (Chrome, Edge, Brave, etc.) support Manifest V3.
- Since `host_permissions` is used to point to `*.bilibili.com`, it does not take effect on other websites.

## Privacy and Security
- This extension only runs under the bilibili.com domain name and saves the images and settings selected by the user to the browser's local storage (storage). User images will not be uploaded to any remote service.
