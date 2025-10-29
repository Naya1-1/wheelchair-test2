(function (global) {
  'use strict';
  var Ny = global.Ny || (global.Ny = {});
  Ny.CodeGen = Ny.CodeGen || (function () {
    // Safe aliases
    var Utils = (Ny && Ny.Utils) ? Ny.Utils : {};
    var State = (Ny && Ny.State) ? Ny.State : {};
    var Render = (Ny && Ny.Render) ? Ny.Render : {};

    // Basic helpers
    function esc(s) {
      try { return Utils.esc ? Utils.esc(s) : String(s == null ? '' : s); }
      catch (_e) { return String(s == null ? '' : s); }
    }
    function clamp(n, min, max) {
      try { return Utils.clamp ? Utils.clamp(n, min, max) : Math.max(min, Math.min(max, n)); }
      catch (_e) { return Math.max(min, Math.min(max, n)); }
    }
    function wrapperNameFromTitle(title) {
      try { return Utils.toWrapperNameFromTitle ? Utils.toWrapperNameFromTitle(title) : (String(title || '').replace(/[^A-Za-z0-9\u4E00-\u9FFF_-]+/g, '').trim() || '状态'); }
      catch (_e) { return '状态'; }
    }

    // Keep parity with UI/Render: divider HTML for output
    function dividerHTMLForOutput(dividerStyle, primaryColor, dividerColor) {
      var dc = (dividerColor && dividerColor.trim()) ? dividerColor : primaryColor;
      if (dividerStyle === 'dashed') return '<hr style="border:none;border-top:1px dashed ' + dc + ';height:0;opacity:.9;">';
      if (dividerStyle === 'gradient') return '<hr style="border:none;height:1px;background-image:linear-gradient(to right, transparent, ' + dc + ', transparent);">';
      return '<hr style="border:none;height:1px;background:' + dc + ';">';
    }

    // Background builders (adapted from Ny.Render, not exported there)
    function buildBgLayersHTML(layers, customization) {
      customization = customization || (State.customization || {});
      try {
        var L = Array.isArray(layers) ? layers : [];
        if (!L.length) return '';
        var html = L.map(function (l) {
          var op = isFinite(l && l.opacity) ? Math.max(0, Math.min(1, Number(l.opacity))) : 1;
          if (l && l.type === 'color') {
            var color = esc(l.color || '#000000');
            return '<div class="bg-layer" style="background:' + color + ';opacity:' + op + ';"></div>';
          }
          if (l && l.type === 'gradient') {
            var style = String(l.style || 'linear');
            var angle = Number(l.angle == null ? 135 : l.angle) || 135;
            var dir = String(l.direction || 'to bottom right');
            var start = esc(l.start || customization.primaryColor || '#6a717c');
            var end = esc(l.end || customization.secondaryColor || '#97aec8');
            var grad;
            if (style === 'linear') {
              grad = 'linear-gradient(' + angle + 'deg, ' + start + ', ' + end + ')';
            } else if (style === 'radial') {
              var posR = dir.replace(/^to\s+/, '');
              grad = 'radial-gradient(at ' + posR + ', ' + start + ', ' + end + ')';
            } else if (style === 'conic') {
              var posC = dir.replace(/^to\s+/, '');
              grad = 'conic-gradient(from ' + angle + 'deg at ' + posC + ', ' + start + ', ' + end + ')';
            } else {
              grad = 'linear-gradient(' + angle + 'deg, ' + start + ', ' + end + ')';
            }
            return '<div class="bg-layer" style="background:' + grad + ';opacity:' + op + ';"></div>';
          }
          var src = esc((l && l.src) || '');
          var size = esc((l && l.size) || 'cover');
          var pos = esc((l && l.position) || 'center');
          var rep = esc((l && l.repeat) || 'no-repeat');
          return '<div class="bg-layer" style="background-image:url(\'' + src + '\');background-size:' + size + ';background-position:' + pos + ';background-repeat:' + rep + ';opacity:' + op + ';"></div>';
        }).join('');
        return '<div class="bg-layers">' + html + '</div>';
      } catch (_e) { return ''; }
    }
    function buildBgComponentsHTML(components) {
      try {
        var C = Array.isArray(components) ? components : [];
        if (!C.length) return '';
        var html = C.filter(function (c) { return c && c.visible !== false; }).map(function (c) {
          var id = esc(c.id || (Utils.genId ? Utils.genId() : ('it_' + Math.random().toString(36).slice(2, 9))));
          var src = esc(c.src || '');
          var x = isFinite(c.x) ? Math.max(0, Math.min(100, Number(c.x))) : 50;
          var y = isFinite(c.y) ? Math.max(0, Math.min(100, Number(c.y))) : 50;
          var w = isFinite(c.w) ? Math.max(2, Math.min(100, Number(c.w))) : 20;
          var op = isFinite(c.opacity) ? Math.max(0, Math.min(1, Number(c.opacity))) : 1;
          return '<img class="bg-comp" data-id="' + id + '" src="' + src + '" alt="" style="left:' + x + '%;top:' + y + '%;width:' + w + '%;opacity:' + op + ';">';
        }).join('');
        return '<div class="bg-components-layer">' + html + '</div>';
      } catch (_e) { return ''; }
    }

    // Build wrapper class list and inline style to match preview
    function computeWrapperAttrs(S) {
      var theme = S.currentTheme || 'theme-mystic-noir';
      var cfg = S.customization || {};
      var cls = 'status-preview-wrapper ' + theme + ' percent-style-' + (cfg.percentDisplay || 'center');
      if (cfg.layout === 'two-column') cls += ' layout-two-column';
      if (cfg.layout !== 'stacked' && cfg.layout !== 'center' && cfg.layout !== 'two-column') cls += ' ratio-layout';

      // Animation classes + variables
      var enterMap = { none: '', fade: 'anim-fade-in', slide: 'anim-slide-up' };
      var loopMap = { none: '', pulse: 'anim-pulse', neon: 'anim-neon-glow', shimmer: 'anim-shimmer', tilt3d: 'anim-tilt-3d', breathe: 'anim-breathe', gloss: 'anim-gloss' };
      var enterCls = enterMap[(S.currentEnterAnimation || 'none')] || '';
      var loopCls = loopMap[(S.currentLoopAnimation || 'none')] || '';
      if (enterCls) cls += ' ' + enterCls;
      if (loopCls) cls += ' ' + loopCls;

      // Inline style (match Ny.Render.renderPreview)
      // Remove hard-coded default font; only emit font-family when user selected one
      var styleParts = [];
      if (cfg.fontFamily && String(cfg.fontFamily).trim()) {
        styleParts.push('font-family:' + cfg.fontFamily);
      }
      styleParts.push('border-radius:' + ((isFinite(cfg.radius) ? cfg.radius : 12)) + 'px');
      styleParts.push('letter-spacing:' + (isFinite(cfg.letterSpacing) ? cfg.letterSpacing : 0) + 'em');
      styleParts.push('line-height:' + (isFinite(cfg.lineHeight) ? cfg.lineHeight : 1.4));
      styleParts.push('opacity:' + (isFinite(cfg.opacity) ? cfg.opacity : 1));
      var style = styleParts.join('; ') + '; ';

      // Width clamp and centering
      var __maxW = cfg.statusbarMaxWidth || 600;
      style += 'width: 100%; max-width: clamp(280px, 92vw, ' + __maxW + 'px); margin: 0 auto; ';

      // Two-column variables
      if (cfg.layout === 'two-column') {
        var lp = clamp(parseInt(cfg.twoColLabelPct == null ? 30 : cfg.twoColLabelPct, 10) || 30, 10, 50);
        var gap = clamp(parseInt(cfg.twoColGap == null ? 12 : cfg.twoColGap, 10) || 12, 0, 40);
        var vp = 100 - lp;
        style += '--two-col-label:' + lp + '%;--two-col-value:' + vp + '%;--two-col-gap:' + gap + 'px;';
      }
      // Label/Value ratio variables
      if (cfg.layout !== 'stacked' && cfg.layout !== 'center') {
        var lv = clamp(parseInt(cfg.lvLabelPct == null ? 30 : cfg.lvLabelPct, 10) || 30, 10, 50);
        style += '--lv-label:' + lv + '%;--lv-value:' + (100 - lv) + '%;';
      }

      // Background mode (inline)
      var bgMode = cfg.bgMode;
      if (bgMode === 'color') {
        style += 'background:' + (cfg.bgColor || '#111215') + ' !important;';
      } else if (bgMode === 'gradient') {
        var start = (cfg.bgGradientStart && cfg.bgGradientStart.trim().length > 0) ? cfg.bgGradientStart : cfg.primaryColor;
        var end = (cfg.bgGradientEnd && cfg.bgGradientEnd.trim().length > 0) ? cfg.bgGradientEnd : cfg.secondaryColor;
        var gStyle = (cfg.bgGradientStyle || 'linear');
        var angle = Number(cfg.bgGradientAngle == null ? 135 : cfg.bgGradientAngle) || 135;
        var dir = (cfg.bgGradientDirection || 'to bottom right');
        var grad;
        if (gStyle === 'linear') {
          grad = 'linear-gradient(' + angle + 'deg, ' + start + ', ' + end + ')';
        } else if (gStyle === 'radial') {
          var pos = String(dir || 'center').replace(/^to\s+/, '');
          grad = 'radial-gradient(at ' + pos + ', ' + start + ', ' + end + ')';
        } else if (gStyle === 'conic') {
          var pos2 = String(dir || 'center').replace(/^to\s+/, '');
          grad = 'conic-gradient(from ' + angle + 'deg at ' + pos2 + ', ' + start + ', ' + end + ')';
        } else {
          grad = 'linear-gradient(' + angle + 'deg, ' + start + ', ' + end + ')';
        }
        style += 'background:' + grad + ' !important;';
      } else if (bgMode === 'image') {
        var url = esc(cfg.bgImageUrl || '');
        style += 'background-image:url(\'' + url + '\');background-size:cover;background-position:center;';
      } else if (bgMode === 'layers') {
        style += 'background:transparent !important;';
      } else if (bgMode === 'none') {
        style += 'background:transparent !important;';
      }

      // Progress bar color var
      var wrapperBarColor = (cfg.section2BarColor && cfg.section2BarColor.trim().length > 0) ? cfg.section2BarColor : (cfg.primaryColor || '#6a717c');
      style += '--bar-color:' + wrapperBarColor + ';';

      // Value box / item offsets
      (function () {
        var pct = Math.max(40, Math.min(100, Number(cfg.valueBoxWidthPct == null ? 100 : cfg.valueBoxWidthPct)));
        var vOff = Math.max(-40, Math.min(40, Number(cfg.valueBoxOffsetPct == null ? 0 : cfg.valueBoxOffsetPct)));
        var iOff = Math.max(-40, Math.min(40, Number(cfg.itemOffsetPct == null ? 0 : cfg.itemOffsetPct)));
        var iOffR = Math.max(-40, Math.min(40, Number(cfg.itemOffsetRightPct == null ? 0 : cfg.itemOffsetRightPct)));
        var vOffPos = Math.max(0, vOff);
        var vOffNeg = Math.min(0, vOff);
        style += '--vb-width-pct:' + pct + ';--vb-offset-pct:' + vOff + ';--vb-offset-pct-pos:' + vOffPos + ';--vb-offset-pct-neg:' + vOffNeg + ';--item-offset-pct:' + iOff + ';--item-offset-right-pct:' + iOffR + ';';
      })();

      // Glow and animation variables
      var aCol = (cfg.glowColorA && cfg.glowColorA.trim()) ? cfg.glowColorA : (cfg.primaryColor || '#85a6f8');
      var bCol = (cfg.glowColorB && cfg.glowColorB.trim()) ? cfg.glowColorB : (cfg.secondaryColor || '#95b3e8');
      var gspd = (typeof cfg.glowSpeed === 'number' ? cfg.glowSpeed : 1.0);
      style += '--glow-color-a:' + aCol + ';--glow-color-b:' + bCol + ';--glow-speed:' + gspd + 's;';
      style += '--anim-speed:' + ((isFinite(S.animSpeed) ? S.animSpeed : 1.0)) + 's;';
      style += '--anim-intensity:' + ((isFinite(S.animIntensity) ? S.animIntensity : 0.7)) + ';';

      return { className: cls, style: style };
    }

    // CSS links (export-only policy: NO external links; provide only an inline style hook)
    // 同时收集自定义字体链接，确保导出时包含用户导入的字体
    function cssLinksHTML() {
      try {
        // 收集所有标记为 data-ny-custom-font="true" 的字体链接
        var customFontLinks = Array.prototype.slice.call(
          document.querySelectorAll('link[rel="stylesheet"][data-ny-custom-font="true"]')
        ).map(function(link) {
          return '<link rel="stylesheet" href="' + esc(link.href) + '">';
        }).join('\n');
        
        // 返回自定义字体链接 + 内联样式占位符
        return customFontLinks + '\n<style id="ny-inline-style"></style>';
      } catch(_e) {
        return '<style id="ny-inline-style"></style>';
      }
    }

    // FX Layers HTML builder (generate static HTML for sparkles, petals, stars)
    function buildFxLayersHTML(cfg) {
      try {
        if (!cfg) return '';
        var parts = [];
        
        // Helper functions
        var rand = function(min, max) { return Math.random() * (max - min) + min; };
        var px = function(v) { return v + 'px'; };
        var pct = function(v) { return v + '%'; };
        
        // Stars
        if (cfg.starEnabled) {
          var starColor = cfg.starColor || '#ffffff';
          var starSpeed = (cfg.starFrequency || 2) + 's';
          var starCount = clamp(parseInt(cfg.starDensity||0,10)||0, 0, 1000);
          var starHTML = [];
          for (var i=0; i<starCount; i++) {
            var size = rand(1, 2.5);
            var x = rand(0, 100);
            var y = rand(0, 100);
            var delay = rand(0, cfg.starFrequency||2);
            starHTML.push('<span class="fx-star" style="width:' + px(size) + ';height:' + px(size) + ';left:' + pct(x) + ';top:' + pct(y) + ';animation-delay:' + delay + 's;"></span>');
          }
          parts.push('<div class="fx-layer fx-stars" style="--star-color:' + starColor + ';--star-speed:' + starSpeed + ';">' + starHTML.join('') + '</div>');
        }
        
        // Sparkles
        if (cfg.sparkleEnabled) {
          var sparkleColor = cfg.sparkleColor || '#ffd966';
          var sparkleSpeed = cfg.sparkleFrequency || 2;
          var sparkleDir = cfg.sparkleDirection === 'up' ? 'up' : 'down';
          var sparkleCount = clamp(parseInt(cfg.sparkleDensity||0,10)||0, 0, 1000);
          var sparkleGlow = cfg.sparkleGlow ? ' glow' : '';
          var sparkleHTML = [];
          for (var j=0; j<sparkleCount; j++) {
            var size2 = rand(2, 3.5);
            var x2 = rand(0, 100);
            var delay2 = rand(0, sparkleSpeed);
            var topPos = sparkleDir === 'down' ? '-5%' : '105%';
            var animName = sparkleDir === 'down' ? 'sparkleDown' : 'sparkleUp';
            sparkleHTML.push('<span class="fx-sparkle' + sparkleGlow + '" style="width:' + px(size2) + ';height:' + px(size2) + ';left:' + pct(x2) + ';top:' + topPos + ';animation-duration:' + sparkleSpeed + 's;animation-name:' + animName + ';animation-delay:' + delay2 + 's;"></span>');
          }
          parts.push('<div class="fx-layer fx-sparkles" style="--sparkle-color:' + sparkleColor + ';">' + sparkleHTML.join('') + '</div>');
        }
        
        // Petals
        if (cfg.petalEnabled) {
          var petalSpeed = cfg.petalFrequency || 5;
          var petalCount = clamp(parseInt(cfg.petalDensity||0,10)||0, 0, 1000);
          var petalHTML = [];
          for (var k=0; k<petalCount; k++) {
            var x3 = rand(0, 100);
            var delay3 = rand(0, petalSpeed);
            var rot = rand(-30, 30);
            var petalIcon = '';
            if (cfg.petalIconMode === 'url' && cfg.petalIconUrl) {
              petalIcon = '<img src="' + esc(cfg.petalIconUrl) + '" alt="">';
            } else {
              // Use built-in leaf SVG as default
              var iconColor = cfg.secondaryColor || '#ffffff';
              petalIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C12 2 6 8 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 8 12 2 12 2Z" fill="' + iconColor + '" opacity="0.8"/></svg>';
            }
            petalHTML.push('<span class="fx-petal" style="left:' + pct(x3) + ';top:-10%;animation-duration:' + petalSpeed + 's;animation-delay:' + delay3 + 's;transform:rotate(' + rot + 'deg);">' + petalIcon + '</span>');
          }
          parts.push('<div class="fx-layer fx-petals" style="--petal-speed:' + petalSpeed + 's;">' + petalHTML.join('') + '</div>');
        }
        
        return parts.join('');
      } catch(_e) { return ''; }
    }

    // Minimal runtime script: longtext typewriter (match preview behavior) + empty script for FX injector hook
    function runtimeScript(state) {
      try {
        var S = state || {};
        var items = Array.isArray(S.items) ? S.items : [];
        var cfg = S.customization || {};
        // 保护内嵌 JSON 中的 </script>
        var itemsJson = JSON.stringify(items).replace(/<\//g, '<\\/');
        var cfgJson = JSON.stringify(cfg).replace(/<\//g, '<\\/');
        return [
          '(function(){',
          '  try {',
          '    var __items = ' + itemsJson + ';',
          '    var __cfg = ' + cfgJson + ';',
          '    var wrapper = document.getElementById(\'ny-status\') || document.querySelector(\'.status-preview-wrapper\');',
          '    var itemNodes = wrapper ? wrapper.querySelectorAll(\'.st-body .st-item\') : [];',
          '    var __idx = 0;',
          '    (__items || []).forEach(function(it){',
          '      if (!it || it.type === \'divider\') return;',
          '      var el = itemNodes[__idx++];',
          '      if (!el) return;',
          '      var valEl = el.querySelector(\'.st-value\');',
          '      if (isFinite(it.itemOffsetPct)) el.style.setProperty(\'--item-offset-pct\', Math.max(-40, Math.min(40, Number(it.itemOffsetPct) || 0)));',
          '      if (isFinite(it.itemOffsetRightPct)) el.style.setProperty(\'--item-offset-right-pct\', Math.max(-40, Math.min(40, Number(it.itemOffsetRightPct) || 0)));',
          '      if (valEl) {',
          '        if (isFinite(it.vbWidthPct)) valEl.style.setProperty(\'--vb-width-pct\', Math.max(40, Math.min(100, Number(it.vbWidthPct) || 100)));',
          '        if (isFinite(it.vbOffsetPct)) {',
          '          var __v = Math.max(-40, Math.min(40, Number(it.vbOffsetPct) || 0));',
          '          valEl.style.setProperty(\'--vb-offset-pct\', __v);',
          '          valEl.style.setProperty(\'--vb-offset-pct-pos\', Math.max(0, __v));',
          '          valEl.style.setProperty(\'--vb-offset-pct-neg\', Math.min(0, __v));',
          '        }',
          '      }',
          '      (function applyCardBgShadow(){',
          '        try {',
          '          var pickStr = function(a, b){ var s = (a == null ? \'\': String(a)).trim(); return s ? s : (b == null ? \'\': String(b)); };',
          '          var pickNum = function(a, b, def){ if (isFinite(a)) return Number(a); if (isFinite(b)) return Number(b); return def; };',
          '          var mode = __cfg.itemCardBgMode || \'theme\';',
          '          var color = __cfg.itemCardBgColor || \'#111215\';',
          '          var gStart = __cfg.itemCardGradStart || __cfg.primaryColor;',
          '          var gEnd = __cfg.itemCardGradEnd || __cfg.secondaryColor;',
          '          var gAngle = Number(__cfg.itemCardGradAngle == null ? 135 : __cfg.itemCardGradAngle) || 135;',
          '          var imgUrl = __cfg.itemCardBgImageUrl || \'\';',
          '          var url = __cfg.itemCardBgUrl || \'\';',
          '          if (__cfg.itemCardPerItemEnabled) {',
          '            if (it.cardBgMode && String(it.cardBgMode) !== \'inherit\') {',
          '              mode = String(it.cardBgMode);',
          '            }',
          '            if (mode === \'color\') {',
          '              color = pickStr(it.cardBgColor, color);',
          '            } else if (mode === \'gradient\') {',
          '              gStart = pickStr(it.cardGradStart, gStart);',
          '              gEnd = pickStr(it.cardGradEnd, gEnd);',
          '              gAngle = pickNum(it.cardGradAngle, gAngle, 135) || 135;',
          '            } else if (mode === \'image\') {',
          '              imgUrl = pickStr(it.cardBgImageUrl, imgUrl);',
          '            } else if (mode === \'url\') {',
          '              url = pickStr((it.cardBgUrl != null ? it.cardBgUrl : it.cardUrl), url);',
          '            }',
          '          }',
          '          el.style.background = \'\';',
          '          el.style.backgroundImage = \'\';',
          '          el.style.backgroundSize = \'\';',
          '          el.style.backgroundPosition = \'\';',
          '          el.style.backgroundRepeat = \'\';',
          '          if (mode === \'none\') {',
          '            el.style.background = \'transparent\';',
          '          } else if (mode === \'color\') {',
          '            el.style.background = String(color);',
          '          } else if (mode === \'gradient\') {',
          '            el.style.background = \'linear-gradient(\' + gAngle + \'deg, \' + gStart + \', \' + gEnd + \')\';',
          '          } else if (mode === \'image\') {',
          '            if (imgUrl && imgUrl.trim()) {',
          '              el.style.backgroundImage = \'url(\\\'\' + imgUrl + \'\\\')\';',
          '              el.style.backgroundSize = \'cover\';',
          '              el.style.backgroundPosition = \'center\';',
          '              el.style.backgroundRepeat = \'no-repeat\';',
          '            }',
          '          } else if (mode === \'url\') {',
          '            if (url && url.trim()) {',
          '              el.style.backgroundImage = \'url(\\\'\' + url + \'\\\')\';',
          '              el.style.backgroundSize = \'cover\';',
          '              el.style.backgroundPosition = \'center\';',
          '              el.style.backgroundRepeat = \'no-repeat\';',
          '            }',
          '          }',
          '          var shadowOn = !!__cfg.itemCardShadowEnabled;',
          '          var shadowStrength = Number(__cfg.itemCardShadowStrength || 0.30);',
          '          if (__cfg.itemCardPerItemEnabled) {',
          '            if (it.cardShadowEnable != null) shadowOn = !!it.cardShadowEnable;',
          '            if (isFinite(it.cardShadowStrength)) shadowStrength = Number(it.cardShadowStrength);',
          '          }',
          '          if (shadowOn) {',
          '            var s = Math.max(0, Math.min(1, shadowStrength));',
          '            var y = (4 + 8 * s).toFixed(1);',
          '            var blur = (10 + 18 * s).toFixed(1);',
          '            el.style.boxShadow = \'0 \' + y + \'px \' + blur + \'px rgba(0,0,0,\' + (0.2 + 0.3 * s) + \')\';',
          '          } else {',
          '            el.style.boxShadow = \'\';',
          '          }',
          '        } catch(_e) {}',
          '      })();',
          '    });',
          '    try { console.log(\'[Ny.CodeGen] runtime per-item overrides applied\', { count: (__items||[]).length }); } catch(_e) {}',
          '    var nodes = document.querySelectorAll(\'.st-longtext[data-effect="typewriter"]\');',
          '    nodes.forEach(function(el){',
          '      var full = el.textContent || \'\';',
          '      el.textContent = \'\';',
          '      var spd = Math.max(5, Math.min(200, parseInt(el.getAttribute(\'data-tw-speed\') || \'18\', 10) || 18));',
          '      var delay = Math.max(0, parseInt(el.getAttribute(\'data-tw-delay\') || \'0\', 10) || 0);',
          '      var caretOn = (el.getAttribute(\'data-tw-caret\') !== \'0\');',
          '      var i = 0;',
          '      var tick = function(){',
          '        if (i >= full.length) { el.textContent = full; return; }',
          '        i++;',
          '        if (caretOn && i < full.length) {',
          '          el.textContent = full.slice(0, i) + \'▌\';',
          '        } else {',
          '          el.textContent = full.slice(0, i);',
          '        }',
          '        setTimeout(tick, spd);',
          '      };',
          '      setTimeout(tick, delay);',
          '    });',
          '  } catch(_e) {}',
          '})();'
        ].join('\n');
      } catch(_e) { return '(function(){})()'; }
    }

    // Build Standalone HTML matching preview (Render)
    function buildReplacementHTML(state, options) {
      try {
        var S = state || State;
        var theme = S.currentTheme || 'theme-mystic-noir';
        var title = S.currentTitle || '角色状态';
        var cfg = S.customization || {};

        var headerHTML = (Render && Render.getHeaderHTML2)
          ? Render.getHeaderHTML2(theme, title, cfg)
          : ('<div class="st-header"><span class="st-title">' + esc(title || '角色状态') + '</span></div>');

        var itemsHTML = (Render && Render.buildItemsHTML)
          ? Render.buildItemsHTML(S.items || [], theme, cfg)
          : '';

        var attrs = computeWrapperAttrs(S);

        // Background layers/components (if layers mode)
        var bgLayersHTML = (cfg.bgMode === 'layers') ? buildBgLayersHTML(cfg.bgLayers, cfg) : '';
        var bgCompsHTML = (cfg.bgMode === 'layers') ? buildBgComponentsHTML(cfg.bgComponents) : '';
        
        // FX layers (sparkles, petals, stars)
        var fxLayersHTML = buildFxLayersHTML(cfg);

        var bodyStyle = ''; // reserved

        var doc = [
          '<!DOCTYPE html>',
          '<html lang="zh-CN">',
          '<head>',
          '<meta charset="UTF-8">',
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
          '<title>' + esc(title || '角色状态') + '</title>',
          cssLinksHTML(),
          '</head>',
          '<body>',
          '<section id="ny-status" class="' + attrs.className + '" style="' + attrs.style + '">',
          bgLayersHTML,
          bgCompsHTML,
          fxLayersHTML,
          headerHTML,
          '<div class="st-body" style="' + bodyStyle + '">',
          itemsHTML,
          '</div>',
          '</section>',
          '<script>',
          runtimeScript(S).replace('</script>', '<' + '/script>'),
          '</script>',
          '</body>',
          '</html>'
        ].join('\n');

        return doc;
      } catch (_e2) { try { console.warn('[Ny.CodeGen] buildReplacementHTML error', _e2); } catch(_ee){} return ''; }
    }

    // Static group snippet with $n placeholders (按 items 顺序为值占位)
    function buildGroupSnippet(state, options) {
      try {
        var S = state || State;
        var theme = S.currentTheme || 'theme-mystic-noir';
        var title = S.currentTitle || '角色状态';
        var cfg = S.customization || {};
        var items = Array.isArray(S.items) ? S.items : [];
  
        // 复用预览头部与外壳属性
        var headerHTML = (Render && Render.getHeaderHTML2)
          ? Render.getHeaderHTML2(theme, title, cfg)
          : ('<div class="st-header"><span class="st-title">' + esc(title || '角色状态') + '</span></div>');
        var attrs = computeWrapperAttrs(S);
  
        // 样式工具
        var styleJoin = function (parts) { return parts.filter(Boolean).join('; '); };
        var idFromLabel = function (label, prefix) {
          var base = String(label || '').replace(/[^A-Za-z0-9\u4E00-\u9FFF]+/g, '');
          return (prefix || 'k_') + (base || Math.random().toString(36).slice(2, 8));
        };
  
        // 第二部分项目颜色
        var s2Label = (cfg.section2LabelColor && cfg.section2LabelColor.trim().length > 0) ? cfg.section2LabelColor : '';
        var s2Value = (cfg.section2ValueColor && cfg.section2ValueColor.trim().length > 0) ? cfg.section2ValueColor : '';
        var s2Bar   = (cfg.section2BarColor   && cfg.section2BarColor.trim().length   > 0) ? cfg.section2BarColor   : '';
  
        // 字体样式
        var labelFontFamily = cfg.globalLabelFontFamily || cfg.fontFamily;
        var valueFontFamily = cfg.globalValueFontFamily || cfg.fontFamily;
        var labelWeight = cfg.globalLabelWeight || 500;
        var valueWeight = cfg.globalValueWeight || 600;
        var labelFontSize = cfg.globalLabelFontSize || 0;
        var valueFontSize = cfg.globalValueFontSize || 0;
        var labelItalic = cfg.globalLabelItalic ? 'font-style:italic' : '';
        var valueItalic = cfg.globalValueItalic ? 'font-style:italic' : '';
        var labelUpper = cfg.globalLabelUppercase ? 'text-transform:uppercase' : '';
        var valueUpper = cfg.globalValueUppercase ? 'text-transform:uppercase' : '';
        var labelReflect = cfg.globalLabelReflect ? '-webkit-box-reflect: below 0 linear-gradient(transparent, rgba(255,255,255,.15))' : '';
        var valueReflect = cfg.globalValueReflect ? '-webkit-box-reflect: below 0 linear-gradient(transparent, rgba(255,255,255,.15))' : '';
        var reflectInlineBlock = 'display:inline-block';
  
        // 进度条风格/动画
        var barStyle = cfg.barStyle || 'normal';
        var barAnimation = cfg.barAnimation || 'none';
        var barClassFromStyle = function () {
          switch (barStyle) {
            case 'glow': return 'pf-glow';
            case 'striped': return 'pf-striped';
            case 'glass': return 'pf-glass';
            default: return '';
          }
        };
        var isGrow = (barAnimation === 'grow');
  
        // 构建主体 HTML（值改为 $n）
        var groupIdx = 1;
        var bodyHTML = (items || []).map(function (it) {
          if (!it) return '';
          if (it.type === 'divider') {
            return dividerHTMLForOutput(cfg.dividerStyle, (cfg.primaryColor || '#6a717c'), (cfg.section2DividerColor || ''));
          }
          if (it.type === 'text' || it.type === 'longtext') {
            var labelColor = s2Label ? s2Label : (it.labelColor || cfg.secondaryColor || '#9FA6B2');
            var valueColor = s2Value ? s2Value : (it.valueColor || cfg.primaryColor || '#6a717c');
            var lblStyle = styleJoin([
              'color:' + labelColor,
              labelFontFamily ? ('font-family:' + labelFontFamily) : '',
              'font-weight:' + labelWeight,
              labelFontSize ? ('font-size:' + labelFontSize + 'px') : '',
              labelItalic,
              labelUpper,
              (cfg.globalLabelReflect ? reflectInlineBlock : ''),
              labelReflect
            ]);
            var valStyle = styleJoin([
              (valueColor ? ('color:' + valueColor) : ''),
              valueFontFamily ? ('font-family:' + valueFontFamily) : '',
              'font-weight:' + valueWeight,
              valueFontSize ? ('font-size:' + valueFontSize + 'px') : '',
              valueItalic,
              valueUpper,
              (cfg.globalValueReflect ? reflectInlineBlock : ''),
              valueReflect
            ]);
            var id = idFromLabel(it.label || (it.type === 'longtext' ? '说明' : '标签'), 'val_');
            var ph = '$' + groupIdx++;
            var valueClass = (it.type === 'longtext') ? 'st-value st-longtext' : 'st-value';
            
            // 应用项目级别的偏移设置（如果存在）
            var itemStyle = [];
            if (isFinite(it.itemOffsetPct)) {
              var iOff = Math.max(-40, Math.min(40, Number(it.itemOffsetPct) || 0));
              itemStyle.push('--item-offset-pct:' + iOff);
            }
            if (isFinite(it.itemOffsetRightPct)) {
              var iOffR = Math.max(-40, Math.min(40, Number(it.itemOffsetRightPct) || 0));
              itemStyle.push('--item-offset-right-pct:' + iOffR);
            }
            var itemStyleStr = itemStyle.length > 0 ? (' style="' + itemStyle.join(';') + '"') : '';
            
            return ''
              + '<div class="st-item" data-type="' + it.type + '" data-label="' + esc(it.label || '') + '"' + itemStyleStr + '>'
              + '  <div class="st-label" style="' + lblStyle + '">' + esc(it.label || '') + '</div>'
              + '  <div class="' + valueClass + '" id="' + id + '" style="' + valStyle + '">' + ph + '</div>'
              + '</div>';
          }
          if (it.type === 'bar') {
            var labelColor2 = s2Label ? s2Label : (it.labelColor || cfg.secondaryColor || '#9FA6B2');
            var fillColor = s2Bar ? s2Bar : (it.barColor || '');
            var lblStyle2 = styleJoin([
              'color:' + labelColor2,
              labelFontFamily ? ('font-family:' + labelFontFamily) : '',
              'font-weight:' + labelWeight,
              labelFontSize ? ('font-size:' + labelFontSize + 'px') : '',
              labelItalic,
              labelUpper,
              (cfg.globalLabelReflect ? reflectInlineBlock : ''),
              labelReflect
            ]);
            var valStyle2 = styleJoin([
              valueFontFamily ? ('font-family:' + valueFontFamily) : '',
              'font-weight:' + valueWeight,
              valueFontSize ? ('font-size:' + valueFontSize + 'px') : '',
              valueItalic,
              valueUpper,
              (cfg.globalValueReflect ? reflectInlineBlock : ''),
              valueReflect
            ]);
            var idBar = idFromLabel(it.label || '进度', 'bar_');
            var ph2 = '$' + groupIdx++;
            var classes = ['st-progress-bar-fill'];
            var extraStyleClass = barClassFromStyle();
            if (extraStyleClass) classes.push(extraStyleClass);
            if (isGrow) classes.push('pf-anim-grow');
            // 🔧 FIX: 确保进度条宽度使用占位符 $n，而不是硬编码数值
            // 动画模式：使用 CSS 变量 --target 配合占位符
            var widthStyle = isGrow ? ('width: var(--target); --target: ' + ph2 + '%') : ('width: ' + ph2 + '%');
            var colorStyle = fillColor ? ('background-color:' + esc(fillColor) + '; --bar-color:' + esc(fillColor)) : '';
            
            // 应用项目级别的偏移设置（如果存在）
            var itemStyle2 = [];
            if (isFinite(it.itemOffsetPct)) {
              var iOff2 = Math.max(-40, Math.min(40, Number(it.itemOffsetPct) || 0));
              itemStyle2.push('--item-offset-pct:' + iOff2);
            }
            if (isFinite(it.itemOffsetRightPct)) {
              var iOffR2 = Math.max(-40, Math.min(40, Number(it.itemOffsetRightPct) || 0));
              itemStyle2.push('--item-offset-right-pct:' + iOffR2);
            }
            var itemStyleStr2 = itemStyle2.length > 0 ? (' style="' + itemStyle2.join(';') + '"') : '';
            
            // 🔧 FIX: 添加百分比显示元素，确保导出代码中百分比也使用占位符
            var percentSpan = '<span class="st-progress-percent" style="--pct:' + ph2 + '%;">' + ph2 + '%</span>';
            
            return ''
              + '<div class="st-item" data-type="bar" data-label="' + esc(it.label || '') + '"' + itemStyleStr2 + '>'
              + '  <div class="st-label" style="' + lblStyle2 + '">' + esc(it.label || '') + '</div>'
              + '  <div class="st-value" style="width: clamp(120px, 40vw, calc(var(--_vb-base-max,160px) * var(--vb-width-pct,100) / 100)); transform: translateX(calc(1% * var(--vb-offset-pct, 0))); ' + valStyle2 + '">'
              + '    <div class="st-progress-bar" onclick="(function(bar){var s=bar.querySelector(\'.st-progress-percent\');var show=!(bar.classList&&bar.classList.contains(\'show-percent\'));if(bar.classList)bar.classList.toggle(\'show-percent\',show);if(s){s.style.opacity=show?\'1\':\'0\';}})(this)">'
              + '      <div id="' + idBar + '" class="' + classes.join(' ') + '" style="' + widthStyle + '; ' + colorStyle + '"></div>' + percentSpan
              + '    </div>'
              + '  </div>'
              + '</div>';
          }
          return '';
        }).join('');
  
        var doc = [
          '<!DOCTYPE html>',
          '<html lang="zh-CN">',
          '<head>',
          '<meta charset="UTF-8">',
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
          '<title>' + esc(title || '角色状态') + '</title>',
          cssLinksHTML(),
          '</head>',
          '<body>',
          '<section id="ny-status" class="' + attrs.className + '" style="' + attrs.style + '">',
          headerHTML,
          '<div class="st-body">',
          bodyHTML,
          '</div>',
          '</section>',
          '</body>',
          '</html>'
        ].join('\n');
        return doc;
      } catch (_e) { try { console.warn('[Ny.CodeGen] buildGroupSnippet error', _e); } catch(_ee){} return buildReplacementHTML(state, options); }
    }

    // AI 输出模板：所有“值”使用占位符（需要替换的值）
    function buildAiTemplate(state, options) {
      try {
        var S = state || State;
        var title = S.currentTitle || '角色状态';
        var wrap = wrapperNameFromTitle(title) + '状态栏';
        var items = Array.isArray(S.items) ? S.items : [];
        var lines = [];
        lines.push('<' + wrap + '>');
        items.forEach(function (it) {
          if (!it) return;
          if (it.type === 'text' || it.type === 'bar' || it.type === 'longtext') {
            var label = String(it.label || (it.type === 'bar' ? '进度' : it.type === 'longtext' ? '说明' : '标签')).trim() || (it.type === 'bar' ? '进度' : it.type === 'longtext' ? '说明' : '标签');
            lines.push(label + '：' + '（需要替换的值）');
          }
        });
        lines.push('</' + wrap + '>');
        return lines.join('\n');
      } catch (_e) {
        return '<ny状态栏>\n地点：（需要替换的值）\n情绪：（需要替换的值）\n</ny状态栏>';
      }
    }

    // findRegex：按标签逐项捕获值（多分组）
    function buildFindRegex(state, options) {
      try {
        var S = state || State;
        var name = wrapperNameFromTitle(S.currentTitle || '状态');
        var items = Array.isArray(S.items) ? S.items : [];
        var labels = items
          .filter(function (it) { return it && (it.type === 'text' || it.type === 'bar' || it.type === 'longtext'); })
          .map(function (it) { return String(it.label || (it.type === 'bar' ? '进度' : it.type === 'longtext' ? '说明' : '')).trim(); })
          .filter(function (s) { return s.length > 0; });
        var escRe = function (s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
        var colonClass = '[：:﹕︰∶]';
        if (!labels.length) {
          return { pattern: '<' + name + '状态栏>\\s*([\\s\\S]*?)</' + name + '状态栏>', flags: '' };
        }
        var parts = [];
        parts.push('<' + name + '状态栏>\\s*');
        labels.forEach(function (L) {
          var X = escRe(L);
          parts.push(
            '[\\s\\S]*?\\s*' + X + '\\s*' + colonClass + '\\s*' +
            '([\\s\\S]*?)' +
            '(?=\\s*(?:\\r?\\n)?\\s*[^\\r\\n<>]+\\s*' + colonClass + '|\\s*</' + name + '状态栏>)'
          );
        });
        parts.push('[\\s\\S]*?</' + name + '状态栏>');
        return { pattern: parts.join(''), flags: '' };
      } catch (_e) {
        return { pattern: '<ny状态栏>\\s*[\\s\\S]*?\\s*地点\\s*[：:﹕︰∶]\\s*([\\s\\S]*?)[\\s\\S]*?\\s*情绪\\s*[：:﹕︰∶]\\s*([\\s\\S]*?)[\\s\\S]*?</ny状态栏>', flags: '' };
      }
    }

    // 正则方案说明（示例流程 + 逐项替换提示）
    function buildRegexReference(state, options) {
      try {
        var S = state || State;
        var wrapName = wrapperNameFromTitle(S.currentTitle || '状态');
        var colonClass = '[：:﹕︰∶]';
        var items = Array.isArray(S.items) ? S.items : [];
        var escRe = function (s) { return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&'); };
        var labels = items
          .filter(function (it) { return it && (it.type === 'text' || it.type === 'bar' || it.type === 'longtext'); })
          .map(function (it) { return String(it.label || (it.type === 'bar' ? '进度' : it.type === 'longtext' ? '说明' : '')).trim(); })
          .filter(Boolean);
        var F = buildFindRegex(state, options);
  
        var lines = [];
        lines.push('SillyTavern 正则方案（捕获 <xxx状态栏> + 按标签替换值）');
        lines.push('A) 先用“块捕获”提取 <xxx状态栏> 内部文本，再对提取结果逐项替换。');
        lines.push('');
        lines.push('【块捕获（任意 xxx）→ 提取内部文本】');
        lines.push('FIND    <([^\\s<>/]+)状态栏>\\s*([\\s\\S]*?)\\s*</\\1状态栏>');
        lines.push('REPLACE $2');
        lines.push('');
        lines.push('【块捕获（固定名示例：' + wrapName + '状态栏）→ 提取内部文本】');
        lines.push('FIND    <' + wrapName + '状态栏>\\s*([\\s\\S]*?)\\s*</' + wrapName + '状态栏>');
        lines.push('REPLACE $1');
        lines.push('');
        lines.push('—— 逐项替换（对已提取的块内容执行）——');
        labels.forEach(function (label) {
          var L = escRe(label);
          // 文本/长文本：跨行捕获
          lines.push('[文本] ' + label);
          lines.push('FIND    (?m)(?:^|\\r?\\n)(\\s*' + L + '\\s*' + colonClass + '\\s*)([\\s\\S]*?)(?=\\r?\\n\\s*[^\\r\\n<>]+\\s*' + colonClass + '|$)');
          lines.push('REPLACE $1<新文本值>');
          lines.push('');
          // 数值条：单值捕获
          lines.push('[进度条/数值] ' + label);
          lines.push('FIND    (?m)(?:^|\\r?\\n)(\\s*' + L + '\\s*' + colonClass + '\\s*)(-?\\d+(?:\\.\\d+)?)');
          lines.push('REPLACE $1<新数值(0-100)>');
          lines.push('');
        });
        lines.push('【findRegex（多分组）】：');
        lines.push(F.pattern ? F.pattern : '(生成失败)');
        return lines.join('\\n');
      } catch (_e) {
        return '正则方案生成失败: ' + (_e && _e.message ? _e.message : String(_e));
      }
    }

    // Optional: base inline style for theme (kept for compatibility)
    function themeBaseInline(theme) {
      // Render path already sets complete inline style; keep empty to avoid duplication
      return '';
    }

    return {
      // Builders
      buildReplacementHTML: buildReplacementHTML,
      buildGroupSnippet: buildGroupSnippet,
      buildAiTemplate: buildAiTemplate,
      buildFindRegex: buildFindRegex,
      buildRegexReference: buildRegexReference,
      // Utils exposed for Ny.Export compatibility
      themeBaseInline: themeBaseInline,
      dividerHTMLForOutput: dividerHTMLForOutput
    };
  })();

})(typeof window !== 'undefined' ? window : globalThis);
