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
    <a href="{{ "/death/readme" | relative_url }}">id="link-death"></a>
  </div>

  <div class="portal cv-side">
    <div class="portal-content">
    <h1>CV_Lab</h1>
    <p>cd ./CV_study</p>
    </div>
    <a href="{{ "/CV_study/readme" | relative_url }}">id="link-cv"></a>
  </div>

</div>

<script>
  document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();

    // 封装触发函数
    function triggerPortal(sideClass, linkId) {
      const sideEl = document.querySelector('.' + sideClass);
      const titleEl = sideEl.querySelector('h1');
      const cmdEl = sideEl.querySelector('p'); 
      const linkEl = document.getElementById(linkId);
      sideEl.style.backgroundColor = '#eeeeee';
      titleEl.style.color = '#000000';
      cmdEl.style.opacity = '1';
      cmdEl.style.transform = 'translateY(0)';
      
      setTimeout(function() {
        linkEl.click();
      }, 200); // 200毫秒 = 0.2秒
    }


    if (key === 'h') {
      triggerPortal('death-side', 'link-death');
    }
    if (key === 'l') {
      triggerPortal('cv-side', 'link-cv');
    }
  });
</script>
