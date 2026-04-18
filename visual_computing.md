---
layout: default
title: Visual Computing
---

<div id="portal-section">
  <div class="portal cv-side">
    <a href="{{ "/CV_study/CV_Total.html" | relative_url }}" id="link-cv"></a>
    <div class="portal-content">
      <h1>Vision</h1>
      <p>cd ./CV_study</p>
      
    </div>
  </div>
  
  <div class="portal cg-side">
    <a href="{{ "/CG_study/readme" | relative_url }}" id="link-cg"></a>
    <div class="portal-content">
      <h1>Graphics</h1>
      <p>cd ./CG_study</p>
      
    </div>
  </div>
</div>

<style>
  body, html {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow: hidden; 
    background-color: #050505 !important;
  }

  #portal-section {
    height: 100vh; 
    width: 100%;
    background-color: #000;
    display: flex;
    flex-direction: row; 
    position: relative;
  }

  .portal {
    flex: 1;
    height: 100%;    
    display: flex; 
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    border: 1px solid #111;
    transition: flex 0.5s ease, background-color 0.3s;
    position: relative;
  }

  @media (min-width: 769px) {
    .portal:hover {
      flex: 1.5; 
      background-color: #fff;
    }
    .portal:hover h1 { color: #000; }
    .portal:hover p { color: #333; }
    .portal:hover .file-link { color: #555; }
    .portal:hover .file-link:hover { color: #000; font-weight: bold; }
  }

  @media (max-width: 768px) {
    #portal-section { flex-direction: column; }
    .portal { flex: 1; width: 100%; transition: background-color 0.3s; }
    .portal:hover { background-color: #fff; }
    .portal:hover h1 { color: #000; }
    .portal:hover p { color: #333; }
    .portal:hover .file-link { color: #555; }
    .portal h1 { font-size: 3rem !important; }
  }

  .portal-content {
    text-align: center;
    width: 80%;
    max-height: 80%;
    overflow-y: auto;
    scrollbar-width: none;
    z-index: 2;
    pointer-events: none; /* Let clicks pass through to link */
  }
  .portal-content::-webkit-scrollbar { display: none; }

  .portal-content h1 { font-family: 'Hack', monospace; font-weight: 900; color: #fff; margin-bottom: 5px; pointer-events: auto; }
  .portal-content p { color: #666; font-family: monospace; margin-bottom: 20px; pointer-events: auto; }
  
  .cv-side, .cg-side { background: #000; }
  
  .file-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 8px;
    margin-top: 20px;
    font-family: monospace;
    font-size: 14px;
    pointer-events: auto; /* Re-enable clicks for links */
  }

  .file-link {
    color: #888;
    text-decoration: none;
    transition: color 0.2s;
    position: relative;
    z-index: 10;
  }
  .file-link:hover {
    color: #fff;
  }

  #link-cv, #link-cg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
  }
  
</style>

<script markdown="0">
document.addEventListener('keydown', (e) => {
if (e.isComposing) return;
const k = e.key.toLowerCase();
if (k === 'h') clickLink('link-cv', 'cv-side');
if (k === 'l') clickLink('link-cg', 'cg-side');
if (['k', '0', 'escape'].includes(k)) window.location.href = '{{ "/" | relative_url }}';
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
</script>
