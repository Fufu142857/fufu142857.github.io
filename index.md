---
layout: default
title: Home
is_home: true
---

<div class="portal-container">
  
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

<script>
 
  window.addEventListener('pageshow', function(event) {
    // 强制复原所有样式
    const deathSide = document.querySelector('.death-side');
    const cvSide = document.querySelector('.cv-side');
    // 清除内联样式，让 CSS 重新接管
    if (deathSide) {
      deathSide.style.backgroundColor = '';
      deathSide.querySelector('h1').style.color = '';
      deathSide.querySelector('p').style.opacity = '';
    }
    if (cvSide) {
      cvSide.style.backgroundColor = '';
      cvSide.querySelector('h1').style.color = '';
      cvSide.querySelector('p').style.opacity = '';
    }
  });

  document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();

    // 封装触发函数
    function triggerPortal(sideClass, linkId) {
      const sideEl = document.querySelector('.' + sideClass);
      if (!sideEl) return;
      
      const titleEl = sideEl.querySelector('h1');
      const cmdEl = sideEl.querySelector('p'); 
      const linkEl = document.getElementById(linkId);
      if (!linkEl) return;

      // 视觉反馈
      sideEl.style.backgroundColor = '#eeeeee';
      if (titleEl) titleEl.style.color = '#000000';
      if (cmdEl) {
        cmdEl.style.opacity = '1';
        cmdEl.style.transform = 'translateY(0)';
      }
      
      // 延迟跳转
      setTimeout(function() {
        linkEl.click();
      }, 250); 
    }

    // H (Left) 左边
    if (key === 'h') {
      triggerPortal('death-side', 'link-death');
    }
    
    // L (Right) 去右边
    if (key === 'l') {
      triggerPortal('cv-side', 'link-cv');
    }
  });
</script>
