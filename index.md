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
      [j] or [Enter] to Access | [k] or [0] to Return
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
  /* 强制锁定全屏，禁止浏览器原生滚动 */
  body, html {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow: hidden;
    background-color: #000 !important; /* 全局死寂黑 */
  }
.ascii-art {
  font-family: 'Hack', monospace;
  font-weight: bold;
  color: #fff; /* 纯白高亮 */
  white-space: pre; /* 保持空格格式 */
  line-height: 1.1; /* 行距紧一点，不然图形会散开 */
  margin-bottom: 20px; /* 和下面拉开距离 */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* 微微发光 */
}
  /* 世界容器：包含两屏高度 */
  #world-container {
    width: 100%;
    height: 200vh; /* 两屏高 */
    display: flex;
    flex-direction: column;
    /* 核心动画：贝塞尔曲线模拟 Mac 物理惯性 */
    transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
    transform: translateY(0); /* 默认显示第一屏 */
  }

  /* --- 第一屏：终端封页 --- */
  #terminal-section {
    height: 100vh;
    width: 100%;
    background-color: #000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; /* 居中 */
    padding: 0 15%; /* 增加左右边距，防止字太宽 */
    position: relative;
    z-index: 10;
  }

  /* 终端内容区域 */
  .terminal-window {
    width: 100%;
    max-width: 900px; /* 限制最大宽度，便于阅读 */
    font-family: 'Hack', monospace, "Menlo", "Consolas";
    font-size: 16px;
    line-height: 1.5; /* 紧凑一点更像日志 */
    color: #ccc;
    text-align: left; /* 必须左对齐 */
  }

  /* 日志样式 */
  .log-line {
    margin-bottom: 4px; /* 行间距 */
    display: block;
    opacity: 0; /* 初始隐藏，等JS显示 */
    animation: slideIn 0.1s forwards; /* 出现动画 */
  }
  @keyframes slideIn { to { opacity: 1; } }

  /* 颜色定义 */
  .ts { color: #555; margin-right: 10px; } /* 时间戳灰色 */
  .proc { color: #50fa7b; font-weight: bold; margin-right: 10px; } /* 进程名绿色 */
  .warn { color: #ffb86c; font-weight: bold; margin-right: 10px; } /* 警告橙色 */
  .err  { color: #ff5555; font-weight: bold; margin-right: 10px; } /* 错误红色 */
  .info { color: #8be9fd; margin-right: 10px; } /* 信息青色 */
  .val  { color: #f8f8f2; } /* 正在内容白色 */
  .comment { color: #6272a4; font-style: italic; } /* 注释色 */

  /* 光标 */
  .cursor {
    display: inline-block;
    width: 10px; height: 18px; background: #50fa7b;
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  .terminal-footer {
    position: absolute; bottom: 30px;
    font-family: 'Hack'; font-size: 12px; color: #444;
    letter-spacing: 1px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100% {opacity: 0.5} 50% {opacity: 1} }


  /* --- 第二屏：双子传送门 --- */
  #portal-section {
    height: 100vh;
    width: 100%;
    background-color: #000 !important; /* 强制纯黑 */
    display: flex;
    position: relative;
  }

  /* 传送门文字修正 (防止被 CSS 覆盖) */
  .portal-content h1 { font-family: 'Hack'; font-weight: 900; color: #fff; }
  .portal-content p { color: #888; }
  
  /* 覆盖之前的背景色逻辑，确保只有悬停才变白 */
  .death-side, .cv-side { background: #000; border-color: #111; }

</style>

<script>
  // --- 配置内容：系统日志风格 ---
// --- 配置内容：系统日志风格 ---
  // 时间戳生成器
  function getTS() {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
  }


  const logs = [
    // 1. ASCII 艺术大标题 
    { type: 'header', text: 
`███████╗██╗   ██╗███████╗██╗   ██╗
██╔════╝██║   ██║██╔════╝██║   ██║
█████╗  ██║   ██║█████╗  ██║   ██║
██╔══╝  ██║   ██║██╔══╝  ██║   ██║
██║     ╚██████╔╝██║     ╚██████╔╝
╚═╝      ╚═════╝ ╚═╝      ╚═════╝ v1.4.2.8.5.7` 
    },
    
    { type: 'sys', text: "Initializing kernel... memory_check=OK" },
    { type: 'sys', text: "Loading user profile..." },
    
    // 2. 关于称呼
    { type: 'info', text: "Username: fufu142857 ｜ Fu_1/7" },
    { type: 'info', text: "Alias: 'Fufu' (Preferred) | 'Fu' (Self-ref)" },
    
    { type: 'calc', text: "ID_Signature: 1/7 ≈ 0.142857 (Cyclic_Sequence)" },
    
    { type: 'break' },
    
    { type: 'info', text: "Class: INTJ / Scorpio / Adult" },
    { type: 'info', text: "Focus: CS / Computer Vision / 0101010" },
    
    // 3. 关于工具
    { type: 'tool', text: "Skill_Tree: CLI, Vim [Status: GRINDING_EXP...]" },
    
    { type: 'info', text: "Psyche_Scan: Abnormal Psychology & Philosophy" },
    
    { type: 'break' },
    // 4. 加载 volume
  	{ type: 'sys', text: "Mounting Active Partitions [2/2]:" },
    // 目标 1
    { type: 'data', label: 'VOL_1', text: "Death_Studies" },
    { type: 'txt', text: ">> 由于 Death 是我最感兴趣的话题，我决定开一个个人主页对外展示有关死亡的科普百科、随想，以及我热爱的有关死亡的作品。" },
    { type: 'break' },
    
    // 目标 2
    { type: 'data', label: 'VOL_2', text: "CV_Research" },
    { type: 'txt', text: ">> 我正在自学 Computer Vision 领域内内容，并有志向进行深入研究，记录我的自学笔记。" },
    
    { type: 'break' },
    
    // 4. 操作指引：用 MANUAL 标签，清晰告知如何交互
    { type: 'link', text: "Contact: fufu142857@gmail.com" },
    { type: 'break' },
    { type: 'sys', text: "System Ready. " },
    { type: 'sys', text: "----------------------------------------" },
    { type: 'info', text: "[HELP] Navigation Guide:" },

    { type: 'txt', text: "   > J / Enter / Space   :: Access System" },
    { type: 'txt', text: "   > K / 0 / GG          :: Return to Root" },
    { type: 'txt', text: "   > Mouse Scroll        :: Fully Supported" },
    { type: 'sys', text: "----------------------------------------" },
    { type: 'sys', text: "Awaiting input..." }
  ];

  // --- 状态管理 ---
  const terminalContent = document.getElementById('terminal-content');
  const worldContainer = document.getElementById('world-container');
  let currentLine = 0;
  let isBooted = false; // 是否打印完毕
  let inPortal = false; // 是否在二楼

  // --- 1. 日志打印引擎 (按行打印) ---
  function printLog() {
    // 检查是否是从 Portal 返回的 (如果是，直接显示全部，不打印)
    if (sessionStorage.getItem('skipBoot')) {
      renderAllLogs();
      isBooted = true;
      return;
    }

    if (currentLine >= logs.length) {
      isBooted = true;
      return;
    }

    const log = logs[currentLine];
    const lineEl = document.createElement('div');
    lineEl.className = 'log-line';

    // 格式化输出
    let html = `<span class="ts">${getTS()}</span>`;
    
    if (log.type === 'sys')  html += `<span class="proc">[SYSTEM]</span> ${log.text}`;
    if (log.type === 'calc') html += `<span class="info">[MATH]</span> ${log.text}`;
    if (log.type === 'info') html += `<span class="info">[INFO]</span> <span class="val">${log.text}</span>`;
    if (log.type === 'tool') html += `<span class="proc">[TOOLS]</span> ${log.text}`;
    if (log.type === 'warn') html += `<span class="warn">[NOTICE]</span> ${log.text}`;
    if (log.type === 'data') html += `<span class="err">[${log.label}]</span> <span class="val">${log.text}</span>`;
    if (log.type === 'txt')  html += `<span class="comment">${log.text}</span>`;
    if (log.type === 'link') html += `<span class="proc">[LINK]</span> ${log.text}`;
    if (log.type === 'break') html = '<br>';

    lineEl.innerHTML = html;
    terminalContent.appendChild(lineEl);

    // 自动滚动到底部
    // terminalContent.scrollTop = terminalContent.scrollHeight; // (如果需要)

    currentLine++;
    // 每 0.1s ~ 0.25s 打印一行
    setTimeout(printLog, Math.random() * 150 + 100);
  }

  // 直接渲染全部 (用于返回时)
  function renderAllLogs() {
    logs.forEach(log => {
      const lineEl = document.createElement('div');
      lineEl.className = 'log-line';
      lineEl.style.animation = 'none';
      lineEl.style.opacity = '1';
      
      let html = `<span class="ts">[00:00:00]</span>`;
      if (log.type === 'sys')  html += `<span class="proc">[SYSTEM]</span> ${log.text}`;
      else if (log.type === 'txt')  html += `<span class="comment">${log.text}</span>`;
      else if (log.type === 'break') html = '<br>';
      else html += `<span class="val">${log.text}</span>`; 
      
      lineEl.innerHTML = html;
      terminalContent.appendChild(lineEl);
    });
  }

  // --- 2. 核心交互：切屏 (Slide) ---
  function goPortal() {
    if (inPortal) return;
    inPortal = true;
    // 整体上移 100vh
    worldContainer.style.transform = 'translateY(-100vh)';
    // 标记：下次回来不播放动画
    sessionStorage.setItem('skipBoot', 'true');
  }

  function goTerminal() {
    if (!inPortal) return;
    inPortal = false;
    // 整体下移回 0
    worldContainer.style.transform = 'translateY(0)';
  }

  // --- 3. 监听器 ---

  // 键盘控制
  let lastG = 0;
  document.addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    const k = e.key.toLowerCase();

    // 下滑 / 进入
    if (['j', 'enter', ' '].includes(k)) {
      if (!inPortal) goPortal();
      // 如果已经在 portal，j 无操作，或者你想让它滑动页面内容？
      // 目前 portal 只有一屏，所以不做操作
    }

    // 上滑 / 返回
    if (['k', '0'].includes(k)) {
      if (inPortal) goTerminal();
    }

    // gg 检测
    if (k === 'g') {
      const now = Date.now();
      if (now - lastG < 500 && inPortal) goTerminal();
      lastG = now;
    }

    // Portal 内部左右跳转 (保留)
    if (inPortal) {
       if (k === 'h') clickLink('link-death', 'death-side');
       if (k === 'l') clickLink('link-cv', 'cv-side');
    }
  });

  // 鼠标滚轮控制 (Debounce 防止太灵敏)
  let wheelTimeout;
  window.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        // 向下滚 -> 进主页
        goPortal();
      } else if (e.deltaY < 0) {
        // 向上滚 -> 回封页
        goTerminal();
      }
    }, 50);
  }, { passive: true });

  // 辅助点击函数
  function clickLink(id, sideClass) {
    const el = document.getElementById(id);
    const side = document.querySelector('.'+sideClass);
    if(el && side) {
      side.style.backgroundColor = '#fff'; // 闪白
      side.querySelector('h1').style.color = '#000';
      setTimeout(() => el.click(), 200);
    }
  }
  
  // 页面加载逻辑
  // 如果是刷新 (performance navigation)，清除 skipBoot，重新播放
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('skipBoot');
  }

  // 启动
  printLog();

  // 修复后退颜色问题
  window.addEventListener('pageshow', () => {
     document.querySelectorAll('.portal').forEach(p => {
       p.style.background = '';
       p.querySelector('h1').style.color = '';
     });
  });

</script>