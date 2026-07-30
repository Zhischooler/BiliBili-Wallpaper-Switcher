/* src/content-bilibili.js*/
const ROOT_ID = 'bb-wallpaper-root';
const SCRIM_ID = 'bb-wallpaper-scrim';

// 仅修改这些容器的 backgroundColor（避免影响缩略图的 background-image）
const PAGE_BG_SELECTORS = [
  '#app',
  '.bili-wrapper',
  '.tpl-page',
  '.page',
  '.main',
  '#app .root'
];

function ensureRoot() {
  let root = document.getElementById(ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.style.position = 'fixed';
    root.style.inset = '0';
    root.style.zIndex = '0';
    root.style.pointerEvents = 'none';
    root.style.backgroundSize = 'cover';
    root.style.backgroundPosition = 'center center';

    const scrim = document.createElement('div');
    scrim.id = SCRIM_ID;
    scrim.style.position = 'absolute';
    scrim.style.inset = '0';
    scrim.style.pointerEvents = 'none';
    scrim.style.zIndex = '0';
    scrim.style.background = 'transparent';

    root.appendChild(scrim);
    document.documentElement.appendChild(root);
  }
  return root;
}

function setPageBackgroundTransparency(enable) {
  PAGE_BG_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (enable) {
        if (!el.dataset._bb_orig_bgcolor) {
          el.dataset._bb_orig_bgcolor = el.style.backgroundColor || '';
        }
        el.style.backgroundColor = 'transparent';
        el.classList.add('bb-bg-safeguard');
      } else {
        el.style.backgroundColor = el.dataset._bb_orig_bgcolor || '';
        delete el.dataset._bb_orig_bgcolor;
        el.classList.remove('bb-bg-safeguard');
      }
    });
  });
}

function applySettings(settings) {
  const root = ensureRoot();
  const scrim = root.querySelector('#' + SCRIM_ID);
  const enabled = settings.bb_bg_enabled ?? true;
  if (!enabled) {
    root.style.display = 'none';
    setPageBackgroundTransparency(false);
    return;
  }
  root.style.display = '';

  if (settings.bb_bg_use_custom && settings.bb_bg_custom_dataurl) {
    root.style.backgroundImage = `url(${settings.bb_bg_custom_dataurl})`;
  } else if (settings.bb_bg_image_url) {
    root.style.backgroundImage = `url(${settings.bb_bg_image_url})`;
  } else {
    root.style.backgroundImage = '';
  }

  const opacity = typeof settings.bb_bg_opacity === 'number' ? settings.bb_bg_opacity : 0.4;
  root.style.opacity = opacity;

  const overlay = settings.bb_bg_overlay_color || 'rgba(0,0,0,0)';
  scrim.style.background = overlay;

  const makeTransparent = settings.bb_bg_make_page_transparent ?? true;
  setPageBackgroundTransparency(!!makeTransparent);
}

function loadAndApply() {
  chrome.storage.sync.get(
    ['bb_bg_enabled','bb_bg_opacity','bb_bg_use_custom','bb_bg_overlay_color','bb_bg_make_page_transparent','bb_bg_image_url'],
    (syncItems) => {
      chrome.storage.local.get(['bb_bg_custom_dataurl'], (localItems) => {
        const settings = {...syncItems, ...localItems};
        applySettings(settings);
      });
    }
  );
}

chrome.storage.onChanged.addListener(() => {
  loadAndApply();
});

// 确保 SPA 导航后 root 仍存在
const observer = new MutationObserver(() => { ensureRoot(); });
observer.observe(document.documentElement, {childList: true, subtree: true});

loadAndApply();