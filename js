javascript:(function(){  fetch("https://tenshirahuresia.github.io/comment.js/comment.js")  .then(r=>r.text())  .then(t=>eval(t))  .catch(e=>alert("%E3%82%A8%E3%83%A9%E3%83%BC: "+e.message));})();
