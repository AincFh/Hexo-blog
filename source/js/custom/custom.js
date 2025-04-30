console.log('custom.js 已加载');

['contextmenu','copy','cut','paste'].forEach(function(eventName){
  document.addEventListener(eventName, function(e) {
    if (e.target.closest('.highlight, pre, code, .comments, .comment, .allow-copy, .el-textarea__inner, .tk-input-image')) return;
    e.preventDefault();
  }, true);
  document.addEventListener(eventName, function(e) {
    if (e.target.closest('.highlight, pre, code, .comments, .comment, .allow-copy, .el-textarea__inner, .tk-input-image')) return;
    e.preventDefault();
  }, false);
});

function enableTwikooInputCopy() {
  var inputList = document.querySelectorAll('textarea.el-textarea__inner, input.tk-input-image');
  inputList.forEach(function(el){
    el.classList.add('allow-copy');
    ['paste','copy','cut','contextmenu'].forEach(function(eventName){
      el.onpaste = null;
      el.oncopy = null;
      el.oncut = null;
      el.oncontextmenu = null;
      el.addEventListener(eventName, function(e){ e.stopPropagation(); }, true);
      el.addEventListener(eventName, function(e){ e.stopPropagation(); }, false);
    });
  });
}
for (let i = 0; i < 10; i++) {
  setTimeout(enableTwikooInputCopy, 1000 * (i + 1));
}
