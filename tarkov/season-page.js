document.body.innerHTML=`
  <aside class="hub-nav" id="hub-nav">
    <header class="hub-brand"><small>ESCAPE FROM</small><strong>TARKOV<br><b>SEASON HUB</b></strong><span>(SEASON 1)</span><time id="hub-season-countdown" class="hub-season-countdown" datetime="2026-12-07">시즌 종료까지 계산 중</time></header>
    <nav aria-label="시즌 도구 메뉴">
      <a class="hub-tab" data-view="battlepass" href="/tarkov/season-1/battle-pass/"><i>01</i><span>배틀패스<small>BATTLE PASS</small></span></a>
      <a class="hub-tab" data-view="documents" href="/tarkov/season-1/documents/"><i>02</i><span>문서 위치<small>DOCUMENT MAP</small></span></a>
      <a class="hub-tab" data-view="quests" href="/tarkov/season-1/quests/"><i>03</i><span>시즌 퀘스트<small>SEASON QUESTS</small></span></a>
      <a class="hub-tab" data-view="allergy" href="/tarkov/season-1/allergy/"><i>04</i><span>알러지 체크<small>ALLERGY CHECK</small></span></a>
      <a class="hub-tab" data-view="modifiers" href="/tarkov/season-1/traits/"><i>05</i><span>시즌 특성<small>SEASON TRAITS</small></span></a>
      <a class="hub-tab" data-view="kappa" href="/tarkov/season-1/kappa/"><i>06</i><span>카파 체크리스트<small>KAPPA CHECKLIST</small></span></a>
    </nav>
    <footer>Unofficial fan-made tool<br>provided by whizs</footer>
  </aside>
  <main class="hub-main">
    <header class="hub-topbar">
      <button id="menu-toggle" aria-label="메뉴 열기">☰</button>
      <div class="view-heading"><small id="view-kicker">SEASON 1</small><h1 id="view-title">시즌 도구</h1></div>
      <div class="topbar-controls"><label class="top-control language-control"><span>LANGUAGE</span><select id="hub-language" aria-label="표시 언어"><option value="ko">한국어</option><option value="en">English</option><option value="ja">日本語</option></select></label><span id="autosave-state">LOCAL AUTO SAVE</span></div>
    </header>
    <section class="hub-panel" data-panel="battlepass"><iframe title="배틀패스"></iframe></section>
    <section class="hub-panel document-panel" data-panel="documents"><section class="hub-map-menu" id="hub-map-menu"><small>MAP CHANGE</small><div id="hub-map-buttons"></div></section><iframe title="문서 위치"></iframe></section>
    <section class="hub-panel content-panel" data-panel="quests"><div id="quest-app"></div></section>
    <section class="hub-panel content-panel" data-panel="allergy"><div id="allergy-app"></div></section>
    <section class="hub-panel content-panel" data-panel="modifiers"><div id="modifier-app"></div></section>
    <section class="hub-panel content-panel" data-panel="kappa"><div id="kappa-app"></div></section>
    <footer class="hub-footer"><span>This is an unofficial fan-made site and is not affiliated with Battlestate Games. Game content, screenshots, item images, trademarks, and related assets are the property of Battlestate Games and their respective licensors. Site provided by <a href="https://discord.com/users/299382568560885761" target="_blank" rel="noopener noreferrer">whizs</a>.</span><span>Interactive maps use <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a> · Map images by <a href="https://github.com/the-hideout/tarkov-dev-svg-maps" target="_blank" rel="noopener noreferrer">tarkov.dev SVG Maps contributors</a> and <a href="https://reemr.se/" target="_blank" rel="noopener noreferrer">RE3MR</a> · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a></span></footer>
  </main>
  <div class="nav-backdrop" id="nav-backdrop"></div>`;
