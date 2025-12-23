---
layout: default
title: Home
is_home: true
---

<div id="world-container">

  <div id="terminal-section">
    <div class="terminal-window">
      <div id="terminal-content"></div>
      <span class="cursor">_</span>
    </div>

    <div class="terminal-footer">
      <span class="cmd-hint">[j] or [Enter] to Access | [k] or [0] to Return</span>
    </div>
  </div>

  <div id="portal-section">

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

</div>

<style>
  /* 基础设定 */
  body, html {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow: hidden; 
    background-color: #050505 !important;
  }

  /* 世界容器 */
  #world-container {
    width: 100%;
    height: 200vh;
    display: flex;
    flex-direction: column;
    transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
    transform: translateY(0);
  }

  /* --- 第一屏：终端布局 --- */
  #terminal-section {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: flex-start; /* 左对齐 */
    padding-left: 10vw;      /* 左侧留白 */
    padding-right: 5vw;
    position: relative;
    box-sizing: border-box;
  }

  /* 终端窗口 */
  .terminal-window {
    width: 100%;
    max-width: 1100px;
    max-height: 85vh; 
    overflow-y: auto; 
    scrollbar-width: none;
    
    /* 字体自适应 */
    font-size: clamp(14px, 2.2vh, 20px); 
    font-family: 'Hack', 'Menlo', 'Consolas', monospace;
    line-height: 1.6;
    color: #ccc;
  }
  .terminal-window::-webkit-scrollbar { display: none; }

  /* ASCII 艺术字 */
  .ascii-art {
    font-weight: 900;
    color: #fff;
    white-space: pre;
    line-height: 1;
    margin-bottom: 4vh; 
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.6); 
    font-size: clamp(12px, 1.5vh, 18px); 
  }
/* --- 颜色高亮系统 (纯白 + Dracula 点缀) --- */
  .log-line {
    margin-bottom: 0.8vh; 
    opacity: 0;
    animation: slideIn 0.2s forwards;
  }
  @keyframes slideIn { to { opacity: 1; } }

  /* 时间戳：深灰色 */
  .ts   { color: #44475a; margin-right: 15px; font-size: 0.8em; } 

  /* 标签：紫罗兰 (Dracula Purple) */
  .tag  { color: #bd93f9; margin-right: 10px; font-weight: 500; } 

  /* 普通内容回归纯白 */
  .content { color: #ffffff;  font-weight: 700;} 

  /* 高亮：粉色 (Dracula Pink) */
  .highlight { color: #ff79c6; font-weight: bolder; } 

  /* 关键字：橙色 (Dracula Orange) */
  .keyword   { color: #ffb86c; font-weight: bolder; }   

  /* 命令：青色 (Dracula Cyan) */
  .cmd       { color: #8be9fd; font-weight: bolder; }   

  /* 注释：灰蓝紫 (Dracula Comment) */
  .comment   { color: #6272a4; font-style: italic; font-weight: bold; }  

  /* 链接样式 */
  .link-text { 
    color: #8be9fd; 
    text-decoration: underline; 
    text-underline-offset: 4px;
    cursor: pointer;
  }
  .link-text:hover { color: #ff79c6; }

  /* 光标 */
  .cursor {
    display: inline-block; width: 10px; height: 1.2em; background: #ccc;
    animation: blink 1s step-end infinite; vertical-align: sub;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  .terminal-footer {
    position: absolute; bottom: 30px; left: 0;
    width: 100%; text-align: center;
    color: #444; font-size: 12px;
    letter-spacing: 3px;
    pointer-events: none; 
  }


  /* ---  第二屏：双子传送门 --- */
  #portal-section {
    height: 100vh; 
    width: 100%;
    background-color: #000;
    display: flex;
    /* 默认大屏幕是左右排 */
    flex-direction: row; 
    position: relative;
  }

  .portal {
    flex: 1; /* 默认各占一半 */
    height: 100%;    
    display: flex; 
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    border: 1px solid #111;
    /* 只有在大屏幕时，才允许 flex 动画 (变宽效果) */
    transition: flex 0.5s ease, background-color 0.3s;
  }

  /* 大屏幕下的悬停效果：变宽 */
  @media (min-width: 769px) {
    .portal:hover {
      flex: 1.5; /* 变宽 */
      background-color: #fff;
    }
    .portal:hover h1 { color: #000; }
    .portal:hover p { color: #333; }
  }

  /* 小屏幕适配 (解决闪烁的核心) */
  @media (max-width: 768px) {
    #portal-section {
      /* 强制变成上下排列 */
      flex-direction: column; 
    }
    .portal {
      /* 强制各占一半高度 */
      flex: 1; 
      width: 100%;
      /* 禁止 flex 动画，防止闪烁 */
      transition: background-color 0.3s; 
    }
    
    /* 小屏幕悬停只变色，不变大小 */
    .portal:hover {
      background-color: #fff;
    }
    .portal:hover h1 { color: #000; }
    .portal:hover p { color: #333; }
    
    /* 调整字体防止溢出 */
    .portal h1 { font-size: 3rem !important; }
  }

  .portal-content h1 { font-family: 'Hack'; font-weight: 900; color: #fff; }
  .portal-content p { color: #666; }
  .death-side, .cv-side { background: #000; }

</style>

<script>
  // --- 1. 日志数据 ---
  function getTS() {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}]`;
  }

  const logs = [
    { type: 'header', text: 
`███████╗██╗   ██╗███████╗██╗   ██╗
██╔════╝██║   ██║██╔════╝██║   ██║
█████╗  ██║   ██║█████╗  ██║   ██║
██╔══╝  ██║   ██║██╔══╝  ██║   ██║
██║     ╚██████╔╝██║     ╚██████╔╝
╚═╝      ╚═════╝ ╚═╝      ╚═════╝ v1.4.2.8.5.7` 
    },
    { type: 'sys', tag: 'SYSTEM', text: "Initializing kernel... memory_check=OK" },
    { type: 'sys', tag: 'SYSTEM', text: "Loading user profile..." },
    { type: 'break' },

    { type: 'info', tag: 'USER', text: "fufu142857 | Fu_1/7", style: 'highlight' },
    { type: 'info', tag: 'ALIAS', text: "'Fufu' (Preferred) | 'Fu' (Self-Ref)" },
    { type: 'calc', tag: 'MATH', text: "ID_Signature: 1/7 ≈ 0.142857 (Cyclic)", style: 'keyword' },
    { type: 'info', tag: 'Traits', text: "INTJ / Scorpio / Undergrad" },
    { type: 'info', tag: 'Major', text: "CS / Computer Vision" },
    { type: 'tool', tag: 'SKILL', text: "CLI, Vim [Status: GRINDING_EXP...]", style: 'cmd' },
    { type: 'scan', tag: 'Psyche_Scan', text: "Abnormal Psychology & Philosophy" },
    { type: 'break' },
    
    { type: 'sys', tag: 'MOUNT', text: "Mounting Active Partitions [2/2]:", style: 'keyword' },
    
    { type: 'vol', tag: 'VOL_1', text: "Death_Studies", style: 'highlight' },
    { type: 'txt', text: ">> 有关 Death 的讨论无比吸引我。我决定维护一个主页,去展示我学习到的有关死亡的科普百科、随想，以及我热爱的有关死亡的作品。" },
    
    { type: 'vol', tag: 'VOL_2', text: "CV_Research", style: 'highlight' },
    { type: 'txt', text: ">> 我正在自学 Computer Vision 领域内内容，并有志向进行深入研究，在此记录我的自学笔记。" },
    
    { type: 'break' },
    
    // 邮件点击唤起
    { type: 'link', tag: 'CONTACT', text: "fufu142857@gmail.com", href: "mailto:fufu142857@gmail.com" },
    
    { type: 'break' },
    { type: 'sys', tag: 'READY', text: "System Ready. Interactive Mode Enabled." },
    { type: 'NAV', tag: 'Help', text: "Navigation Guide:" },
    { type: 'help', text: "> J / Enter :: Access System" },
    { type: 'help', text: "> K / 0 / GG :: Return to Root" },
    { type: 'break' },
    { type: 'sys', tag: '_', text: "Awaiting input..." }
  ];

  // --- 2. 核心逻辑 ---
  const terminalContent = document.getElementById('terminal-content');
  const worldContainer = document.getElementById('world-container');
  let currentLine = 0;
  let inPortal = false;

  function printLog() {
    if (sessionStorage.getItem('skipBoot')) {
      renderAllLogs();
      return;
    }
    if (currentLine >= logs.length) return;

    const log = logs[currentLine];
    const lineEl = document.createElement('div');
    lineEl.className = 'log-line';
    
    let html = '';
    
    if (log.type === 'header') {
      html = `<div class="ascii-art">${log.text}</div>`;
    } 
    else if (log.type === 'break') {
      html = '<br>';
    } else {
      html += `<span class="ts">${getTS()}</span>`;
      
      if (log.tag) {
        html += `<span class="tag">[${log.tag}]</span>`;
      }
      
      let contentClass = 'content';
      if (log.style) contentClass = log.style; 
      if (log.type === 'txt') contentClass = 'comment';
      if (log.type === 'help') contentClass = 'comment';
      if (log.type === 'link') contentClass = 'link-text'; 
      
      if (log.type === 'link') {
         html += `<a href="${log.href}" class="${contentClass}">${log.text}</a>`;
      } else {
         html += `<span class="${contentClass}">${log.text}</span>`;
      }
    }
    
    lineEl.innerHTML = html;
    terminalContent.appendChild(lineEl);
    
    const win = document.querySelector('.terminal-window');
    win.scrollTop = win.scrollHeight;
    
    currentLine++;
    setTimeout(printLog, Math.random() * 100 + 150);
  }

  function renderAllLogs() {
    terminalContent.innerHTML = '';
    logs.forEach(log => {
      const lineEl = document.createElement('div');
      lineEl.className = 'log-line';
      lineEl.style.opacity = '1';
      lineEl.style.animation = 'none';

      let html = '';
      if (log.type === 'header') {
        html = `<div class="ascii-art">${log.text}</div>`;
      } else if (log.type === 'break') {
        html = '<br>';
      } else {
        html += `<span class="ts">[00:00]</span>`;
        if (log.tag) html += `<span class="tag">[${log.tag}]</span>`;
        
        let contentClass = 'content';
        if (log.style) contentClass = log.style;
        if (log.type === 'txt') contentClass = 'comment';
        if (log.type === 'help') contentClass = 'comment';
        if (log.type === 'link') contentClass = 'link-text';
    
        if (log.type === 'link') {
           html += `<a href="${log.href}" class="${contentClass}">${log.text}</a>`;
        } else {
           html += `<span class="${contentClass}">${log.text}</span>`;
        }
      }
      lineEl.innerHTML = html;
      terminalContent.appendChild(lineEl);
    });
  }

  // --- 3. 交互控制 (无滚轮切屏版) ---
  function goPortal() {
    if (inPortal) return;
    inPortal = true;
    worldContainer.style.transform = 'translateY(-100vh)';
    sessionStorage.setItem('skipBoot', 'true');
  }

  function goTerminal() {
    if (!inPortal) return;
    inPortal = false;
    worldContainer.style.transform = 'translateY(0)';
  }

  let lastG = 0;
  document.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    const k = e.key.toLowerCase();

    if (['j', 'enter'].includes(k) && !inPortal) goPortal();
    if (['k', '0'].includes(k) && inPortal) goTerminal();
    
    if (k === 'g') {
      const now = Date.now();
      if (now - lastG < 500 && inPortal) goTerminal();
      lastG = now;
    }
    
    if (inPortal) {
       if (k === 'h') clickLink('link-death', 'death-side');
       if (k === 'l') clickLink('link-cv', 'cv-side');
    }
  });

  function clickLink(id, sideClass) {
    const el = document.getElementById(id);
    const side = document.querySelector('.'+sideClass);
    if(el && side) {
      side.style.backgroundColor = '#fff'; 
      side.querySelector('h1').style.color = '#000';
      setTimeout(() => el.click(), 200);
    }
  }

  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('skipBoot');
  }
  printLog();

  window.addEventListener('pageshow', () => {
     document.querySelectorAll('.portal').forEach(p => {
       p.style.background = '';
       p.querySelector('h1').style.color = '';
     });
  });
</script>
