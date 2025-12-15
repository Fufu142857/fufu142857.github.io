---
layout: default
title: Home
is_home: true
---


<div id="terminal-cover">
  <div class="terminal-window">
    <div id="terminal-content"></div>
    <span class="cursor">_</span>
  </div>
  
  <div class="terminal-footer">
    [j] or [Enter] to Inject | [k] or [0] to Reset
  </div>
</div>

<div id="portal-container" class="hidden">
  
  <div class="ghost-watermark">Fu_1/7</div>

  <div class="portal death-side">
    <div class="portal-content">
      <h1>DEATH</h1>
      <p>cd ./death_wiki</p>
    </div>
    <a href="{{ "/death/readme" | relative_url }}" id="link-death"></a>
  </div>

  <div class="portal cv-side">
    <div class="portal-content">
      <h1>CV_Lab</h1>
      <p>cd ./CV_study</p>
    </div>
    <a href="{{ "/CV_study/readme" | relative_url }}" id="link-cv"></a>
  </div>

</div>

<style>
  /* 封页样式 */
  #terminal-cover {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100vh;
    background: #000;
    color: #ccc;
    font-family: 'Hack', monospace;
    z-index: 999;
    padding: 60px 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  
  .hidden { display: none !important; }

  #terminal-content {
    white-space: pre-wrap;
    font-size: 16px;
    line-height: 1.6;
  }

  /* 关键字高亮 */
  .key { color: #888; }
  .val { color: #eee; }
  .cmd { color: #50fa7b; }
  .warn { color: #ff5555; }
  .comment { color: #6272a4; font-style: italic; }

  .cursor {
    display: inline-block;
    width: 10px; height: 18px; background: #ccc;
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  .terminal-footer {
    position: absolute; bottom: 20px; left: 0; width: 100%;
    text-align: center; font-size: 12px; color: #444;
    animation: fadeIn 2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  #portal-container { height: 100vh; width: 100%; display: flex; }
</style>

<script>
  // --- 配置内容 ---
  const lines = [
    { text: "> boot_sequence_initiated... [OK]", type: "cmd", delay: 600 },
    { text: "> loading_profile... ", type: "cmd", delay: 200 },
    { text: "", type: "break", delay: 0 },

    { text: "user       : ", type: "key" }, { text: "fufu (Fu_1/7)\n", type: "val" },
    { text: "id_math    : ", type: "key" }, { text: "1/7 = 0.142857... (infinite_loop)\n", type: "val" },
    { text: "class      : ", type: "key" }, { text: "INTJ / Scorpio / Adult\n", type: "val" },
    { text: "major      : ", type: "key" }, { text: "CS (Computer Science)\n", type: "val" },
    { text: "focus      : ", type: "key" }, { text: "Computer Vision & Deep Learning\n", type: "val" },
    { text: "tools      : ", type: "key" }, { text: "CLI, Vim, HHKB\n", type: "val" },
    { text: "interests  : ", type: "key" }, { text: "[\"Psychology\", \"Philosophy\", \"Death_Studies\"]\n", type: "val" },
    
    { text: "", type: "break", delay: 0 },
    { text: "[!] SYSTEM NOTICE:\n", type: "warn", delay: 300 },
    { text: "# Subject has extreme interest in 'Death'.\n", type: "comment" },
    { text: "# Creating repository for Death Education & Philosophy...\n", type: "comment" },
    { text: "", type: "break", delay: 0 },
    
    { text: "contact    : ", type: "key" }, { text: "fufu142857@gmail.com\n", type: "val" },
    { text: "status     : ", type: "key" }, { text: "Ready to mount volumes.\n", type: "cmd" },
    
    { text: "", type: "break", delay: 0 },
    { text: "> Press [j] or [Enter] to enter the Void...", type: "val", delay: 500 }
  ];

  // --- 状态管理 ---
  let isIntroDone = false;
  let isPortalOpen = false;
  const termCover = document.getElementById('terminal-cover');
  const termContent = document.getElementById('terminal-content');
  const portalContainer = document.getElementById('portal-container');

  // gg 键位检测变量
  let lastKeyGTime = 0; 

  // --- 打字机引擎 ---
  async function typeWriter() {
    if (sessionStorage.getItem('visited')) {
        skipIntro();
        return;
    }
    for (let line of lines) {
      if (isPortalOpen) return;
      const span = document.createElement('span');
      span.className = line.type;
      termContent.appendChild(span);
      if (line.type === "break") {
        termContent.appendChild(document.createElement('br'));
        continue;
      }
      const chars = line.text.split('');
      for (let char of chars) {
        if (isPortalOpen) return;
        span.textContent += char;
        await new Promise(r => setTimeout(r, Math.random() * 30 + 30));
      }
      if (line.delay) await new Promise(r => setTimeout(r, line.delay));
    }
    isIntroDone = true;
  }

  // --- 动作：进入主页 ---
  function enterPortal() {
    isPortalOpen = true;
    termCover.classList.add('hidden');
    portalContainer.classList.remove('hidden');
    sessionStorage.setItem('visited', 'true');
  }

  // --- 动作：返回/跳过 ---
  function skipIntro() {
    isIntroDone = true;
    isPortalOpen = false;
    termCover.classList.remove('hidden');
    portalContainer.classList.add('hidden');
    // 无动画直接渲染
    termContent.innerHTML = "";
    lines.forEach(line => {
      if(line.type === 'break') {
         termContent.appendChild(document.createElement('br'));
      } else {
         const span = document.createElement('span');
         span.className = line.type;
         span.textContent = line.text;
         termContent.appendChild(span);
      }
    });
  }

  // --- 键盘监听 (Vimium 友好版) ---
  document.addEventListener('keydown', function(event) {
    if (event.isComposing || event.keyCode === 229) return;
    const key = event.key.toLowerCase();
    const now = new Date().getTime();

    // === 逻辑 A：进入主页 ===
    // 按 j / Enter / Space
    if (key === 'j' || key === 'enter' || key === ' ') {
      if (!isPortalOpen) enterPortal();
    }

    // === 逻辑 B：返回封页 / 重置 ===
    // 按 0 / k 
    if (key === '0' || key === 'k') {
      if (isPortalOpen) skipIntro();
    }
    
    // 按 gg (双击 g)
    if (key === 'g') {
      if (now - lastKeyGTime < 500) { // 500ms 内按两次 g
        if (isPortalOpen) skipIntro();
      }
      lastKeyGTime = now;
    }

    // === 逻辑 C：左右传送 (仅在主页有效) ===
    if (isPortalOpen) {
      // 封装触发器
      function triggerPortal(sideClass, linkId) {
        const sideEl = document.querySelector('.' + sideClass);
        if (!sideEl) return;
        const linkEl = document.getElementById(linkId);
        if (!linkEl) return;

        // 视觉反馈
        sideEl.style.backgroundColor = '#eeeeee';
        sideEl.querySelector('h1').style.color = '#000000';
        const cmd = sideEl.querySelector('p');
        if(cmd) {
            cmd.style.opacity = '1';
            cmd.style.transform = 'translateY(0)';
        }
        
        // 延迟跳转
        setTimeout(() => linkEl.click(), 200);
      }

      // h -> 左边
      if (key === 'h') triggerPortal('death-side', 'link-death');
      // l -> 右边
      if (key === 'l') triggerPortal('cv-side', 'link-cv');
    }
  });

  // 鼠标支持
  termCover.addEventListener('click', enterPortal);
  typeWriter();

  // 页面回退修复
  window.addEventListener('pageshow', function(event) {
    const deathSide = document.querySelector('.death-side');
    const cvSide = document.querySelector('.cv-side');
    if (deathSide) { deathSide.style.backgroundColor = ''; deathSide.querySelector('h1').style.color = ''; }
    if (cvSide) { cvSide.style.backgroundColor = ''; cvSide.querySelector('h1').style.color = ''; }
  });

</script>