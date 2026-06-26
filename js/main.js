
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const progress = $('.page-progress');
  const nav = $('.nav');
  const topBtn = $('.back-top');
  function onScroll(){
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    if(progress) progress.style.width = (ratio * 100).toFixed(2) + '%';
    nav && nav.classList.toggle('is-scrolled', scrollY > 20);
    topBtn && topBtn.classList.toggle('show', scrollY > 520);
  }
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const menu = $('.menu-toggle');
  const links = $('.nav-links');
  menu && links && menu.addEventListener('click', () => links.classList.toggle('open'));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => links && links.classList.remove('open')));
  topBtn && topBtn.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

  const cursor = $('.ambient-cursor');
  if(cursor){
    addEventListener('pointermove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }, {passive:true});
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 6 * 55, 220) + 'ms';
    io.observe(el);
  });

  $$('.palette .sw').forEach(sw => {
    sw.title = '点击复制色值';
    sw.addEventListener('click', async () => {
      const color = sw.style.backgroundColor || sw.style.background || '';
      try { await navigator.clipboard.writeText(color); } catch(e){}
      sw.classList.add('copied');
      setTimeout(() => sw.classList.remove('copied'), 900);
    });
  });

  $$('.analysis-img').forEach(img => {
    img.addEventListener('click', () => img.classList.toggle('grid-off'));
    img.title = '点击切换构图辅助线';
  });

  $$('.case').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (x * 4).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
})();


// Reference-inspired quiz micro-interaction
document.querySelectorAll('.quiz-options button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.quiz-options button').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    btn.textContent = btn.textContent.replace(' ✓','') + ' ✓';
  });
});
