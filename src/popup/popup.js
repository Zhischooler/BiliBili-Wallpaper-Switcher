// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const enabledEl = document.getElementById('enabled');
  const opacityEl = document.getElementById('opacity');
  const opacityVal = document.getElementById('opacityVal');
  const overlayEl = document.getElementById('overlay');
  const overlayAlphaEl = document.getElementById('overlayAlpha');
  const overlayAlphaVal = document.getElementById('overlayAlphaVal');
  const fileEl = document.getElementById('file');
  const clearBtn = document.getElementById('clear');
  const openPage = document.getElementById('openPage');

  function rgbaFromHex(hex, alpha) {
    // hex: #rrggbb, alpha: 0..1
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // load settings
  function load() {
    chrome.storage.sync.get(['bb_bg_enabled','bb_bg_opacity','bb_bg_overlay_color','bb_bg_make_page_transparent'], (items) => {
      enabledEl.checked = items.bb_bg_enabled ?? true;
      const op = Math.round((items.bb_bg_opacity ?? 0.4) * 100);
      opacityEl.value = op;
      opacityVal.textContent = op + '%';
      const overlay = items.bb_bg_overlay_color || 'rgba(0,0,0,0)';
      const m = overlay.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (m) {
        const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]), a = parseFloat(m[4]);
        const hex = '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
        overlayEl.value = hex;
        overlayAlphaEl.value = Math.round(a * 100);
        overlayAlphaVal.textContent = Math.round(a * 100) + '%';
      } else {
        overlayEl.value = overlay.startsWith('#') ? overlay : '#000000';
        overlayAlphaEl.value = 0;
        overlayAlphaVal.textContent = '0%';
      }
    });
  }

  load();

  function saveSync(obj) {
    chrome.storage.sync.set(obj);
  }
  function saveLocal(obj) {
    chrome.storage.local.set(obj);
  }

  enabledEl.addEventListener('change', () => {
    saveSync({bb_bg_enabled: enabledEl.checked});
  });

  opacityEl.addEventListener('input', () => {
    const v = parseInt(opacityEl.value);
    opacityVal.textContent = v + '%';
    saveSync({bb_bg_opacity: v/100});
  });

  overlayEl.addEventListener('input', () => {
    const hex = overlayEl.value;
    const a = overlayAlphaEl.value / 100;
    overlayAlphaVal.textContent = Math.round(a*100) + '%';
    saveSync({bb_bg_overlay_color: rgbaFromHex(hex, a)});
  });
  overlayAlphaEl.addEventListener('input', () => {
    overlayAlphaVal.textContent = overlayAlphaEl.value + '%';
    const hex = overlayEl.value;
    const a = overlayAlphaEl.value / 100;
    saveSync({bb_bg_overlay_color: rgbaFromHex(hex, a)});
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.dataset.color;
      overlayEl.value = c;
      overlayAlphaEl.value = 30;
      overlayAlphaVal.textContent = '30%';
      saveSync({bb_bg_overlay_color: rgbaFromHex(c, 0.3)});
    });
  });

  fileEl.addEventListener('change', () => {
    const f = fileEl.files && fileEl.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataurl = reader.result;
      saveSync({bb_bg_use_custom: true});
      saveLocal({bb_bg_custom_dataurl: dataurl});
      saveSync({bb_bg_last_update_ts: Date.now()});
    };
    reader.readAsDataURL(f);
  });

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['bb_bg_custom_dataurl'], () => {
      saveSync({bb_bg_use_custom: false});
      saveSync({bb_bg_image_url: ''});
    });
  });

  openPage.addEventListener('click', () => {
    chrome.tabs.query({active:true,currentWindow:true}, (tabs) => {
      if (tabs[0]) chrome.tabs.reload(tabs[0].id);
    });
  });
});