(function(global){
  'use strict';
  var Ny = global.Ny || (global.Ny = {});
  Ny.Sections = Ny.Sections || {};
  Ny.Sections.ItemsParts = {
    colorsAndBar: function(){
      return `<div class="form-group-box" data-title="配色与进度条样式"><div class="form-box-title">配色与进度条样式</div><div class="control-group"><label>第三部分项目颜色</label><div class="compact-colors-grid"><div class="color-cell"><label for="section2-label-color-input">标签颜色</label><div class="color-row"><input type="color" id="section2-label-color-input" value="#6a717c"><input type="text" id="section2-label-color-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#6a717c"></div></div><div class="color-cell"><label for="section2-value-color-input">值颜色</label><div class="color-row"><input type="color" id="section2-value-color-input" value="#97aec8"><input type="text" id="section2-value-color-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#97aec8"></div></div><div class="color-cell"><label for="section2-bar-color-input">滑条颜色</label><div class="color-row"><input type="color" id="section2-bar-color-input" value="#6a717c"><input type="text" id="section2-bar-color-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#6a717c"></div></div><div class="color-cell"><label for="section2-divider-color-input">分割线颜色</label><div class="color-row"><input type="color" id="section2-divider-color-input" value="#6a717c"><input type="text" id="section2-divider-color-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#6a717c"></div></div></div><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">仅作用于第三部分的项目（分割线、标签、滑条），不影响标题与模板全局配色。</p></div><div class="control-group"><label>进度条样式</label><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><div><label for="bar-style-select">样式</label><select id="bar-style-select"><option value="normal">标准</option><option value="glow">荧光</option><option value="striped">斜纹</option><option value="glass">玻璃光泽</option></select></div><div><label for="bar-animation-select">动画</label><select id="bar-animation-select"><option value="none">无</option><option value="grow">逐渐增长到固定数值</option></select></div></div><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">选择全局进度条风格与动画，可与上方颜色联动。</p></div><div class="control-group"><label for="percent-display-select">百分比显示</label><select id="percent-display-select"><option value="center">中心覆盖</option><option value="badge">右侧徽章</option><option value="tooltip">上方气泡</option><option value="follow">末端跟随</option><option value="toast">下方吐司</option></select><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">点击进度条显示/隐藏百分比，可切换显示风格。</p></div></div>`;
    },
    cardBgShadow: function(){
      return `<!-- 新增：项目卡片背景与阴影（第三部分） --><div class="form-group-box" data-title="项目卡片背景与阴影"><div class="form-box-title">项目卡片背景与阴影</div><div class="control-group"><label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="item-bg-shadow-per-item-toggle">允许每个项目独立设置背景与阴影</label><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">开启后，可在“项目编辑”中为单个项目设置背景与阴影，局部设置将优先于下方全局设置。</p></div><div class="control-group"><label for="item-card-bg-mode-select">背景模式（全局）</label><select id="item-card-bg-mode-select"><option value="theme">跟随模板</option><option value="none">无背景（透明）</option><option value="color">纯色</option><option value="gradient">渐变</option><option value="image">图片</option><option value="url">自定义URL背景</option></select></div><!-- 纯色（全局） --><div class="control-group" id="item-card-bg-color-group" style="display:none;"><label for="item-card-bg-color-input">纯色背景</label><input type="color" id="item-card-bg-color-input" value="#111215"><input type="text" id="item-card-bg-color-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#111215" style="margin-top:6px;"></div><!-- 渐变（全局） --><div class="control-group" id="item-card-bg-gradient-group" style="display:none;"><label>渐变背景</label><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:8px;"><div><label for="item-card-grad-start-color-input">起色</label><input type="color" id="item-card-grad-start-color-input" value="#6a717c"><input type="text" id="item-card-grad-start-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#6a717c" style="margin-top:6px;"></div><div><label for="item-card-grad-end-color-input">终色</label><input type="color" id="item-card-grad-end-color-input" value="#97aec8"><input type="text" id="item-card-grad-end-code-input" placeholder="#RRGGBB 或 CSS颜色" value="#97aec8" style="margin-top:6px;"></div></div><div class="range-row" style="margin-top:8px;"><label>角度(°)</label><input type="range" id="item-card-grad-angle-range" min="0" max="360" step="1" value="135"><span class="value-pill"><span id="item-card-grad-angle-value">135</span>°</span></div><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">示例：linear-gradient(135deg, 起色, 终色)</p></div><!-- 图片（全局） --><div class="control-group" id="item-card-bg-image-group" style="display:none;"><label for="item-card-bg-image-url">背景图片 URL</label><input type="url" id="item-card-bg-image-url" placeholder="https://example.com/card-bg.jpg"><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">背景默认使用 cover/center/no-repeat。</p></div><!-- 自定义URL背景（全局） --><div class="control-group" id="item-card-bg-url-group" style="display:none;"><label for="item-card-bg-url-input">自定义 URL 背景</label><input type="url" id="item-card-bg-url-input" placeholder="https://example.com/your-image.png"><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">与“图片”一致，使用 cover/center/no-repeat；该项用于补充“背景模式”未包含的自定义 URL 场景。</p></div><!-- 阴影（全局） --><div class="control-group" id="item-card-shadow-group"><label style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="item-card-shadow-enable"> 启用阴影（全局）</label><div class="range-row" style="margin-top:6px;"><label>强度</label><input type="range" id="item-card-shadow-strength-range" min="0" max="1" step="0.05" value="0.30" disabled><span class="value-pill"><span id="item-card-shadow-strength-value">0.30</span></span></div><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">局部项目也可设置阴影；当开启局部设置时，项目内的阴影将覆盖此处全局设置。</p></div></div>`;
    },
    longtextGlobal: function(){
      return `<div class="form-group-box sm" data-title="长文字设置（全局）" style="display:none;"><div class="form-box-title">长文字设置（全局）</div><div class="control-group" id="longtext-settings-group" style="display:none;"></div></div>`;
    },
    valueBoxOffsets: function(){
      return `<div class="form-group-box" data-title="值框与整体偏移"><div class="form-box-title">值框与整体偏移</div><!-- 新增：值框宽度/位置 与 项目整体偏移/阴影（仅作用于“第三部分 状态项目”） --><div class="control-group"><label>值框宽度与位置（第三部分）</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div class="range-row"><label>宽度(相对最大 %)</label><input type="range" id="value-box-width-pct-range" min="40" max="100" step="1" value="100"><span class="value-pill"><span id="value-box-width-pct-value">100</span>%</span></div><div class="range-row"><label>值框水平偏移(%)</label><input type="range" id="value-box-offset-pct-range" min="-40" max="40" step="1" value="0"><span class="value-pill"><span id="value-box-offset-pct-value">0</span>%</span></div></div></div><!-- 新增：标签/值比例（默认 3:7，可调 10%~50% 标签占比） --><div class="control-group"><label>标签/值比例（第三部分）</label><div class="range-row"><label>标签占比(%)</label><input type="range" id="label-value-label-pct-range" min="10" max="50" step="1" value="30"><span class="value-pill"><span id="label-value-label-pct-value">30</span>% / <span id="label-value-value-pct-value">70</span>%</span></div><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">仅在“文字排列方式=左右排列（默认）”时生效；“上下堆叠/双列”保持各自布局设定。</p></div><div class="control-group"><label>项目整体偏移（第三部分）</label><div class="range-row"><label>整体水平偏移(%)</label><input type="range" id="item-offset-pct-range" min="-40" max="40" step="1" value="0"><span class="value-pill"><span id="item-offset-pct-value">0</span>%</span></div><div class="range-row"><label>整体右侧偏移(%)</label><input type="range" id="item-offset-right-pct-range" min="-40" max="40" step="1" value="0"><span class="value-pill"><span id="item-offset-right-pct-value">0</span>%</span></div><p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">默认宽度为最大值；偏移范围受限，避免超出背景边界。</p></div></div>`;
    },
    fontsStyle: function(){
      return `<div class="form-group-box" data-title="状态项目字体样式"><div class="form-box-title">状态项目字体样式</div><div class="control-group"><label>高级字体样式</label><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;"><div><label for="global-label-font-select">标签字体</label><select id="global-label-font-select"><option value="Noto Sans SC, sans-serif">Noto Sans SC（默认）</option><option value="Inter, Noto Sans SC, sans-serif">Inter</option><option value="Georgia, Songti SC, serif">Georgia / 宋体</option><option value="'Courier New', Courier, monospace">Courier New</option><option value="'Times New Roman', Georgia, serif">Times New Roman</option><optgroup label="📱 像素体"><option value="'BoutiqueBitmap9x9', monospace">精品点阵体9×9</option></optgroup><optgroup label="✨ 英文花体"><option value="'Dancing Script', cursive">Dancing Script（舞动花体）</option><option value="'Pacifico', cursive">Pacifico（温和花体）</option><option value="'Great Vibes', cursive">Great Vibes（优雅花体）</option><option value="'Allura', cursive">Allura（华丽花体）</option></optgroup><optgroup label="✍️ 手写体"><option value="'Caveat', cursive">Caveat（休闲手写）</option><option value="'Indie Flower', cursive">Indie Flower（独立手写）</option><option value="'Shadows Into Light', cursive">Shadows Into Light（阴影手写）</option><option value="'Permanent Marker', cursive">Permanent Marker（马克笔）</option></optgroup><optgroup label="🚀 科技感"><option value="'Rajdhani', sans-serif">Rajdhani（现代科技）</option><option value="'Audiowide', cursive">Audiowide（数字科技）</option><option value="'Electrolize', sans-serif">Electrolize（电子科技）</option></optgroup><optgroup label="🎨 中文艺术"><option value="'Ma Shan Zheng', cursive">马善政楷体</option><option value="'ZCOOL XiaoWei', serif">站酷小薇LOGO体</option><option value="'Long Cang', cursive">龙藏体</option><option value="'Zhi Mang Xing', cursive">志莽行体</option></optgroup><optgroup label="📖 衬线体"><option value="'Merriweather', serif">Merriweather（优雅衬线）</option><option value="'Playfair Display', serif">Playfair Display（展示衬线）</option></optgroup><optgroup label="🔤 无衬线扩展"><option value="'Roboto', sans-serif">Roboto（现代无衬线）</option><option value="'Montserrat', sans-serif">Montserrat（时尚无衬线）</option></optgroup></select></div><div><label for="global-value-font-select">值字体</label><select id="global-value-font-select"><option value="Noto Sans SC, sans-serif">Noto Sans SC（默认）</option><option value="Inter, Noto Sans SC, sans-serif">Inter</option><option value="Georgia, Songti SC, serif">Georgia / 宋体</option><option value="'Courier New', Courier, monospace">Courier New</option><option value="'Times New Roman', Georgia, serif">Times New Roman</option><optgroup label="📱 像素体"><option value="'BoutiqueBitmap9x9', monospace">精品点阵体9×9</option></optgroup><optgroup label="✨ 英文花体"><option value="'Dancing Script', cursive">Dancing Script（舞动花体）</option><option value="'Pacifico', cursive">Pacifico（温和花体）</option><option value="'Great Vibes', cursive">Great Vibes（优雅花体）</option><option value="'Allura', cursive">Allura（华丽花体）</option></optgroup><optgroup label="✍️ 手写体"><option value="'Caveat', cursive">Caveat（休闲手写）</option><option value="'Indie Flower', cursive">Indie Flower（独立手写）</option><option value="'Shadows Into Light', cursive">Shadows Into Light（阴影手写）</option><option value="'Permanent Marker', cursive">Permanent Marker（马克笔）</option></optgroup><optgroup label="🚀 科技感"><option value="'Rajdhani', sans-serif">Rajdhani（现代科技）</option><option value="'Audiowide', cursive">Audiowide（数字科技）</option><option value="'Electrolize', sans-serif">Electrolize（电子科技）</option></optgroup><optgroup label="🎨 中文艺术"><option value="'Ma Shan Zheng', cursive">马善政楷体</option><option value="'ZCOOL XiaoWei', serif">站酷小薇LOGO体</option><option value="'Long Cang', cursive">龙藏体</option><option value="'Zhi Mang Xing', cursive">志莽行体</option></optgroup><optgroup label="📖 衬线体"><option value="'Merriweather', serif">Merriweather（优雅衬线）</option><option value="'Playfair Display', serif">Playfair Display（展示衬线）</option></optgroup><optgroup label="🔤 无衬线扩展"><option value="'Roboto', sans-serif">Roboto（现代无衬线）</option><option value="'Montserrat', sans-serif">Montserrat（时尚无衬线）</option></optgroup></select></div></div><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;"><div class="range-row"><label>标签字号</label><input type="range" id="global-label-font-size-range" min="10" max="36" step="1" value="16"><span class="value-pill"><span id="global-label-font-size-value">16</span>px</span></div><div class="range-row"><label>值字号</label><input type="range" id="global-value-font-size-range" min="10" max="36" step="1" value="16"><span class="value-pill"><span id="global-value-font-size-value">16</span>px</span></div></div><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;"><div><label>标签样式</label><div style="display:grid; gap:8px;"><select id="global-label-weight-select"><option value="400">常规(400)</option><option value="500">中等(500)</option><option value="600">半粗(600)</option><option value="700">加粗(700)</option></select><div style="display:flex; align-items:center; gap:6px; flex-wrap: nowrap; font-size:12px; white-space:nowrap; margin-top:6px; grid-row:2;"><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="global-label-italic-checkbox">倾斜</label><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="global-label-uppercase-checkbox">大写</label><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="global-label-reflect-checkbox">倒影</label></div></div></div><div><label>值样式</label><div style="display:grid; gap:8px;"><select id="global-value-weight-select"><option value="400">常规(400)</option><option value="500">中等(500)</option><option value="600">半粗(600)</option><option value="700">加粗(700)</option></select><div style="display:flex; align-items:center; gap:6px; flex-wrap: nowrap; font-size:12px; white-space:nowrap; margin-top:6px; grid-row:2;"><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="global-value-italic-checkbox">倾斜</label><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="global-value-uppercase-checkbox">大写</label><label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="global-value-reflect-checkbox">倒影</label></div></div></div></div></div>`;
    },
    perItemCardBox: function(it, customization){
      try {
        var id = String((it && it.id) || '');
        var mode = String((it && it.cardBgMode) || 'inherit');
        var csEnabled = !!(it && it.cardShadowEnable);
        var csStrength = (isFinite(it && it.cardShadowStrength) ? Number(it.cardShadowStrength) : (parseFloat((customization && customization.itemCardShadowStrength) || '0.30') || 0.30));
        var showColor = mode === 'color';
        var showGradient = mode === 'gradient';
        var showImage = mode === 'image';
        var showUrl = mode === 'url';
        var angle = (isFinite(it && it.cardGradAngle) ? Number(it.cardGradAngle) : (parseInt((customization && customization.itemCardGradAngle) || '135', 10) || 135));
        var start = (it && it.cardGradStart) || (customization && customization.itemCardGradStart) || (customization && customization.primaryColor) || '#6a717c';
        var end = (it && it.cardGradEnd) || (customization && customization.itemCardGradEnd) || (customization && customization.secondaryColor) || '#97aec8';
        var color = (it && it.cardBgColor) || (customization && customization.itemCardBgColor) || '#111215';
        var imgUrl = (it && it.cardBgImageUrl) || '';
        var url = (((it && it.cardBgUrl) != null ? it.cardBgUrl : (it && it.cardUrl)) || '');

        return `
<div class="inline-subbox per-item-card-box">
  <div class="form-box-title">卡片背景与阴影（局部覆盖）</div>

  <div class="control-group">
    <label>背景模式（局部）</label>
    <select data-field="cardBgMode" data-id="${id}">
      <option value="inherit"${mode==='inherit'?' selected':''}>跟随全局</option>
      <option value="theme"${mode==='theme'?' selected':''}>跟随模板</option>
      <option value="none"${mode==='none'?' selected':''}>无背景（透明）</option>
      <option value="color"${mode==='color'?' selected':''}>纯色</option>
      <option value="gradient"${mode==='gradient'?' selected':''}>渐变</option>
      <option value="image"${mode==='image'?' selected':''}>图片</option>
      <option value="url"${mode==='url'?' selected':''}>自定义URL</option>
    </select>
  </div>

  <div class="control-group" data-role="card-bg-color" style="${showColor?'':'display:none;'}">
    <label>纯色背景</label>
    <input type="color" data-field="cardBgColor" data-id="${id}" value="${color}">
    <input type="text" data-field="cardBgColorCode" data-id="${id}" placeholder="#RRGGBB 或 CSS颜色" value="${color}" style="margin-top:6px;">
  </div>

  <div class="control-group" data-role="card-bg-gradient" style="${showGradient?'':'display:none;'}">
    <label>渐变背景</label>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:8px;">
      <div>
        <label>起色</label>
        <input type="color" data-field="cardGradStart" data-id="${id}" value="${start}">
      </div>
      <div>
        <label>终色</label>
        <input type="color" data-field="cardGradEnd" data-id="${id}" value="${end}">
      </div>
    </div>
    <div class="range-row" style="margin-top:8px;">
      <label>角度(°)</label>
      <input type="range" min="0" max="360" step="1" data-field="cardGradAngle" data-id="${id}" value="${angle}">
      <span class="value-pill"><span>${angle}</span>°</span>
    </div>
  </div>

  <div class="control-group" data-role="card-bg-image" style="${showImage?'':'display:none;'}">
    <label>背景图片 URL</label>
    <input type="url" data-field="cardImageUrl" data-id="${id}" placeholder="https://example.com/card-bg.jpg" value="${imgUrl}">
    <p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">背景默认使用 cover/center/no-repeat。</p>
  </div>

  <div class="control-group" data-role="card-bg-url" style="${showUrl?'':'display:none;'}">
    <label>自定义 URL 背景</label>
    <input type="url" data-field="cardUrl" data-id="${id}" placeholder="https://example.com/your-image.png" value="${url}">
    <p style="color: var(--text-secondary); font-size: 12px; margin-top:6px;">与“图片”一致，使用 cover/center/no-repeat。</p>
  </div>

  <div class="control-group">
    <label style="display:flex;align-items:center;gap:8px;">
      <input type="checkbox" data-field="cardShadowEnable" data-id="${id}" ${csEnabled?'checked':''}>
      阴影（局部）
    </label>
    <div class="range-row" style="margin-top:6px;">
      <label>强度</label>
      <input type="range" min="0" max="1" step="0.05" data-field="cardShadowStrength" data-id="${id}" value="${csStrength}" ${csEnabled?'':'disabled'}>
      <span class="value-pill"><span>${Number(csStrength).toFixed(2)}</span></span>
    </div>
  </div>
</div>
        `;
      } catch(_e){ return ''; }
    },
    editor: function(){
      return `<div class="form-group-box" data-title="项目编辑"><div class="form-box-title">项目编辑</div><div id="items-container"><div class="item-controls"><div class="item-header"><span>地点 (文本)</span><button class="btn-delete">X</button></div></div><div class="item-controls"><div class="item-header"><span>情绪 (进度条)</span><button class="btn-delete">X</button></div></div><div class="item-controls"><div class="item-header"><span>分割线</span><button class="btn-delete">X</button></div></div></div><div class="control-group" style="margin-top: 20px;"><label for="add-item-select">添加新项目</label><div style="display: flex; gap: 10px;"><select id="add-item-select"><option value="text">文本</option><option value="longtext">长文字</option><option value="bar">进度条/数值条</option><option value="divider">分割线</option></select><button class="btn btn-primary" style="width: auto; flex-shrink: 0;">添加</button></div></div></div>`;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);