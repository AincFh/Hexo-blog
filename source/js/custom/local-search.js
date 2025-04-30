// Shoka风格全屏极简本地搜索弹窗
// 依赖 elasticlunr.min.js

document.addEventListener('DOMContentLoaded', function () {
  // 1. 创建全屏遮罩和居中极简搜索条
  let mask = document.createElement('div');
  mask.id = 'local-search-mask';
  mask.style = 'display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:rgba(60,50,100,0.13);backdrop-filter:blur(2.5px);transition:all .18s;';
  let box = document.createElement('div');
  box.id = 'local-search-box';
  box.style = 'position:absolute;top:16%;left:50%;transform:translateX(-50%);width:96vw;max-width:420px;';
  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.98);border-radius:13px;padding:0.7em 1.2em;box-shadow:0 6px 32px rgba(122,96,210,0.08);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#b89cff" stroke-width="2" fill="none"/><path d="M17 17l3.5 3.5" stroke="#b89cff" stroke-width="2" stroke-linecap="round"/></svg>
      <input id="local-search-input" type="search" autocomplete="off" placeholder="输入关键词..." style="flex:1;background:transparent;border:none;font-size:1.11em;padding:7px 2px;outline:none;">
      <button id="local-search-close" style="background:none;border:none;color:#7a60d2;font-size:1.09em;padding:0 0.2em;cursor:pointer;">关闭</button>
    </div>
    <div id="local-search-result" style="margin-top:0.9em;background:rgba(255,255,255,0.99);border-radius:11px;box-shadow:0 2px 18px rgba(122,96,210,0.08);max-height:330px;overflow:auto;"></div>
  `;
  mask.appendChild(box);
  document.body.appendChild(mask);

  // 2. 响应式适配
  let style = document.createElement('style');
  style.innerHTML = `
  @media (max-width: 600px) {
    #local-search-box { top:6%!important;max-width:99vw!important;width:99vw!important; }
    #local-search-box input#local-search-input { font-size:1em!important; }
    #local-search-box #local-search-result { max-height:55vw!important; }
  }
  `;
  document.head.appendChild(style);

  // 3. 打开/关闭逻辑
  function openModal() {
    mask.style.display = 'block';
    document.getElementById('local-search-input').focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    mask.style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('local-search-input').value = '';
    document.getElementById('local-search-result').innerHTML = '';
  }
  document.getElementById('local-search-close').onclick = closeModal;
  mask.onclick = function(e){ if(e.target===mask) closeModal(); };
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape') closeModal();
  });

  // 4. 搜索按钮（右上角或菜单栏的.search按钮）
  let searchBtn = document.querySelector('.search');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      openModal();
    });
  }

  // 5. 搜索逻辑
  let input = document.getElementById('local-search-input');
  let resultDiv = document.getElementById('local-search-result');
  let index = null, data = [];
  fetch('/search.json')
    .then(res => res.json())
    .then(json => {
      data = Array.isArray(json) ? json : (json.posts || json);
      index = elasticlunr(function () {
        this.addField('title');
        this.addField('content');
        this.setRef('url');
      });
      data.forEach(post => {
        if (post.title && post.content && post.url) index.addDoc(post);
      });
    });
  input.addEventListener('input', function () {
    let kw = this.value.trim();
    if (!kw || !index) {
      resultDiv.innerHTML = '';
      return;
    }
    let result = index.search(kw, { expand: true });
    if (!result.length) {
      resultDiv.innerHTML = '<p style="color:#b89cff;text-align:center;margin:0.7em 0;">无结果</p>';
      return;
    }
    resultDiv.innerHTML = result.map(r => {
      let post = data.find(p => p.url === r.ref);
      return `<div style=\"padding:0.5em 1.1em 0.6em 1.1em;border-bottom:1px solid #f1eaff;\"><a href=\"${post.url}\" style=\"font-weight:bold;color:#7a60d2;font-size:1.09em;\">${post.title}</a><div style=\"color:#6b5c99;font-size:.98em;margin-top:2px;\">${post.content.replace(/<[^>]+>/g,'').slice(0,80)}...</div></div>`;
    }).join('');
  });
});
