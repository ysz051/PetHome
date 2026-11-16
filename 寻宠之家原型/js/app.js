/* ================= 寻宠之家 PetHome · 原型应用 ================= */
(function () {
  'use strict';

  /* ---------------- 基础 ---------------- */
  const DB_KEY = 'pethome_proto_v3';
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');

  const CH = {
    lost: {
      key: 'lost', label: '寻宠启事', short: '寻宠', icon: '🐾',
      desc: '宠物走失，宠主发布寻宠求助，让更多人帮你留意',
      timeLabel: '走失时间', action: '发布寻宠启事', accent: 'accent-lost',
      doneText: '已找回'
    },
    found: {
      key: 'found', label: '遇见走失', short: '遇见', icon: '👀',
      desc: '偶遇走失宠物，好心人发布线索，帮助它回到主人身边',
      timeLabel: '发现时间', action: '发布遇见线索', accent: 'accent-found',
      doneText: '已归还'
    },
    adopt: {
      key: 'adopt', label: '领养专区', short: '领养', icon: '🏡',
      desc: '因故无法继续饲养，为毛孩子寻找一个靠谱的新家',
      timeLabel: '发布时间', action: '发布领养信息', accent: 'accent-adopt',
      doneText: '已领养'
    }
  };

  const ICON = {
    pin: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    eye: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chevron: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>'
  };
  const PAW = '<svg viewBox="0 0 24 24" fill="#fff"><ellipse cx="12" cy="15.6" rx="4.7" ry="3.9"/><ellipse cx="5.1" cy="10.2" rx="2.1" ry="2.7"/><ellipse cx="9.4" cy="6.4" rx="2.1" ry="2.8"/><ellipse cx="14.6" cy="6.4" rx="2.1" ry="2.8"/><ellipse cx="18.9" cy="10.2" rx="2.1" ry="2.7"/></svg>';
  const FALLBACK = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#F6EFE7"/><g fill="#E2D2C2"><ellipse cx="320" cy="270" rx="62" ry="50"/><ellipse cx="228" cy="196" rx="27" ry="35"/><ellipse cx="285" cy="152" rx="27" ry="36"/><ellipse cx="355" cy="152" rx="27" ry="36"/><ellipse cx="412" cy="196" rx="27" ry="35"/></g><text x="320" y="376" font-family="PingFang SC,Arial" font-size="22" fill="#A99887" text-anchor="middle">照片加载中 / 暂无图片</text></svg>'
  );
  window.imgFallback = function (el) { el.onerror = null; el.src = FALLBACK; };

  let DB = loadDB();

  function loadDB() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    const fresh = {
      users: JSON.parse(JSON.stringify(SEED_USERS)),
      posts: JSON.parse(JSON.stringify(SEED_POSTS)),
      categories: JSON.parse(JSON.stringify(SEED_CATEGORIES)),
      session: null
    };
    try { localStorage.setItem(DB_KEY, JSON.stringify(fresh)); } catch (e) { /* ignore */ }
    return fresh;
  }
  function save() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(DB)); }
    catch (e) { toast('浏览器本地存储已满，请删除部分演示数据后重试', 'err'); }
  }
  function me() { return DB.users.find(u => u.id === DB.session) || null; }

  /* ---------------- 工具 ---------------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const GENDER = ['未知', '公', '母'];
  const CAT = id => (DB.categories.find(c => c.id === +id) || { name: '其他', icon: '🐾' });
  function stateText(p) {
    if (p.status === 0) return '待审核';
    if (p.status === 2) return '已驳回';
    if (p.status === 3) return CH[p.channel].doneText;
    return p.channel === 'lost' ? '寻宠中' : p.channel === 'found' ? '等待认领' : '待领养';
  }
  const stateClass = p => p.status === 3 ? 'ok' : p.status === 0 ? 'warn' : p.status === 2 ? 'muted' : (p.channel === 'lost' ? 'lost' : p.channel === 'found' ? 'found' : 'adopt');

  function parseDate(s) {
    if (!s) return null;
    const d = new Date(String(s).replace(' ', 'T'));
    return isNaN(d.getTime()) ? null : d;
  }
  function fmt(s) {
    const d = parseDate(s); if (!d) return '—';
    const p = n => String(n).padStart(2, '0');
    return `${d.getMonth() + 1}月${d.getDate()}日 ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function relative(s) {
    const d = parseDate(s); if (!d) return '—';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
    if (diff < 86400 * 7) return Math.floor(diff / 86400) + ' 天前';
    return fmt(s);
  }
  const published = ch => DB.posts.filter(p => p.channel === ch && p.status === 1)
    .sort((a, b) => (parseDate(b.createTime) || 0) - (parseDate(a.createTime) || 0));
  const countAll = ch => DB.posts.filter(p => p.channel === ch).length;
  const nextId = ch => Math.max(1000, ...DB.posts.filter(p => p.channel === ch).map(p => p.id)) + 1;

  function toast(msg, type) {
    const el = document.createElement('div');
    el.className = 'toast ' + (type || 'ok');
    el.textContent = msg;
    toastRoot.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(16px)'; el.style.transition = '.25s'; }, 2600);
    setTimeout(() => el.remove(), 2950);
  }

  function parseHash() {
    const raw = (location.hash || '#/').slice(1);
    const [path, qs] = raw.split('?');
    const query = {};
    new URLSearchParams(qs || '').forEach((v, k) => { query[k] = v; });
    return { path: path || '/', query };
  }
  const currentPath = () => parseHash().path;

  /* ---------------- 布局 ---------------- */
  function header() {
    const user = me();
    const path = currentPath();
    const links = [['/', '首页'], ['/lost', '寻宠启事'], ['/found', '遇见走失'], ['/adopt', '领养专区']];
    const nav = links.map(([href, label]) => {
      const active = href === '/' ? path === '/' : path.indexOf(href) === 0;
      return `<a class="nav-link ${active ? 'active' : ''}" href="#${href}">${label}</a>`;
    }).join('');
    return `<header class="header"><div class="container header-inner">
      <a class="logo" href="#/"><div class="logo-mark">${PAW}</div><div class="logo-text">寻宠<i>之家</i></div></a>
      <nav class="nav">${nav}</nav>
      <div class="header-actions">
        <button class="btn btn-primary" data-act="publish-menu">＋ <span>发布</span></button>
        ${user
          ? `<div class="user-chip" data-act="user-menu"><div class="avatar">${esc(user.nickname.slice(0, 1))}</div><span>${esc(user.nickname)}</span>${ICON.chevron}</div>`
          : `<button class="btn btn-ghost" data-act="login">登录 / 注册</button>`}
      </div>
    </div></header><div id="userMenu"></div>`;
  }

  function footer() {
    return `<footer class="footer"><div class="container footer-inner">
      <div>
        <div class="logo" style="margin-bottom:10px"><div class="logo-mark">${PAW}</div><div class="logo-text">寻宠<i>之家</i></div></div>
        <p>让每一次走失，都有回家的路。<br>寻宠 · 遇见 · 领养，三端信息互助平台。</p>
      </div>
      <div class="cols">
        <div><h4>信息频道</h4><p><a href="#/lost">寻宠启事</a><br><a href="#/found">遇见走失</a><br><a href="#/adopt">领养专区</a></p></div>
        <div><h4>用户服务</h4><p><a href="#/publish?channel=lost">发布寻宠</a><br><a href="#/me">我的发布</a><br><a href="#/admin">管理后台</a></p></div>
        <div><h4>关于平台</h4><p>课程实训项目<br>数据仅用于演示<br>请勿填写真实隐私</p></div>
      </div>
      <div class="copy"><span>© 2026 寻宠之家 PetHome · Vue3 + Spring Boot + MySQL 全栈实训</span><span>原型演示版</span></div>
    </div></footer>`;
  }

  function shell(content) { return header() + '<main>' + content + '</main>' + footer(); }

  /* ---------------- 组件 ---------------- */
  function statusBadge(p) {
    return `<span class="badge ${stateClass(p)}">${stateText(p)}</span>`;
  }
  function stateTag(p) {
    if (p.channel === 'found') {
      const m = { 1: '只是偶遇 · 已离开', 2: '宠物在我身边', 3: '已带回家暂养' };
      return `<span class="state-tag">${m[p.petState] || ''}</span>`;
    }
    if (p.status === 3) return `<span class="state-tag">${CH[p.channel].doneText}</span>`;
    return '';
  }
  function petCard(p) {
    const img = p.images && p.images[0];
    return `<article class="pet-card" data-act="go" data-href="#/detail/${p.channel}/${p.id}">
      <div class="thumb">
        <img src="${img || ''}" alt="${esc(p.title)}" loading="lazy" onerror="imgFallback(this)">
        <div class="badges"><span class="badge ${p.channel}">${CH[p.channel].icon} ${CAT(p.categoryId).name}</span>${statusBadge(p)}</div>
        ${stateTag(p)}
      </div>
      <div class="pet-body">
        <h3>${esc(p.title)}</h3>
        <div class="pet-meta">
          <div>${ICON.pin}${esc(p.address)}</div>
          <div>${ICON.clock}${CH[p.channel].timeLabel}：${p.time ? fmt(p.time) : relative(p.createTime)}</div>
        </div>
        <p class="pet-desc">${esc(p.features)}</p>
        <div class="pet-foot"><span>${esc(p.userName)} 发布</span><span class="views">${ICON.eye}${p.viewCount || 0}</span></div>
      </div>
    </article>`;
  }
  function emptyBox(title, sub) {
    return `<div class="empty"><div class="emoji">🐾</div><b>${title}</b><span>${sub || ''}</span></div>`;
  }
  function mapBox(p) {
    const has = p.lng && p.lat;
    const pos = has ? `${p.lng},${p.lat}` : '';
    return `<div class="map-box">
        <div class="map-pin"><div class="dot"></div><div class="pin-label">${esc(p.address)}</div></div>
      </div>
      <div class="map-foot">
        <span>${has ? `经纬度 ${p.lng}, ${p.lat}` : '未填写精确坐标'}</span>
        ${has ? `<a class="link-btn" target="_blank" rel="noopener" href="https://uri.amap.com/marker?position=${pos}&name=${encodeURIComponent(p.address)}">在高德地图查看 →</a>` : ''}
      </div>`;
  }

  /* ---------------- 首页 ---------------- */
  function homePage() {
    const lostN = published('lost').length, foundN = published('found').length, adoptN = published('adopt').length;
    const reunited = DB.posts.filter(p => p.status === 3 && p.channel !== 'adopt').length;
    const latest = [...published('lost').slice(0, 4), ...published('found').slice(0, 2)]
      .sort((a, b) => (parseDate(b.createTime) || 0) - (parseDate(a.createTime) || 0));
    const adoptList = published('adopt').slice(0, 3);

    return `<section class="hero"><div class="container hero-inner">
        <div class="hero-eyebrow">🐾 寻宠 · 遇见 · 领养 一站式互助平台</div>
        <h1>让每一次<em>走失</em><br>都有回家的路</h1>
        <p class="hero-sub">宠物走失后，每一分钟都很关键。发布寻宠启事，让附近的好心人帮你留意；偶遇走失宠物，也可以留下线索。</p>
        <form class="searchbar" data-form="search">
          ${ICON.search}
          <input name="kw" placeholder="搜索宠物名字、品种、地点关键词，例如「柯基 望京」" aria-label="搜索">
          <select name="channel" aria-label="频道">
            <option value="lost">寻宠启事</option>
            <option value="found">遇见走失</option>
            <option value="adopt">领养专区</option>
          </select>
          <button class="btn btn-primary" type="submit">搜索</button>
        </form>
        <div class="hero-stats">
          <div class="hero-stat"><b>${lostN}<i>条</i></b><span>寻宠中的毛孩子</span></div>
          <div class="hero-stat"><b>${foundN}<i>条</i></b><span>好心人提供的线索</span></div>
          <div class="hero-stat"><b>${reunited}<i>个</i></b><span>已经团圆</span></div>
          <div class="hero-stat"><b>${adoptN}<i>只</i></b><span>等待领养</span></div>
        </div>
      </div></section>

      <section class="channels"><div class="container">
        <div class="channel-grid">
          <a class="channel-card lost" href="#/lost">
            <div class="ch-num">${lostN} 条在寻</div>
            <div class="ch-icon">🐾</div>
            <h3>寻宠启事</h3>
            <p>宠物走失后，宠主填写特征、走失地点与联系方式，让附近的人帮忙一起找。</p>
            <span class="ch-go">去看看 ${ICON.arrow}</span>
          </a>
          <a class="channel-card found" href="#/found">
            <div class="ch-num">${foundN} 条线索</div>
            <div class="ch-icon">👀</div>
            <h3>遇见走失</h3>
            <p>偶遇走失宠物？留下照片和位置，并说明它现在只是路过，还是已经在你身边。</p>
            <span class="ch-go">提供线索 ${ICON.arrow}</span>
          </a>
          <a class="channel-card adopt" href="#/adopt">
            <div class="ch-num">${adoptN} 只待领养</div>
            <div class="ch-icon">🏡</div>
            <h3>领养专区</h3>
            <p>因工作、搬家、过敏等原因无法继续饲养，可以为它寻找一个经过核实的新家庭。</p>
            <span class="ch-go">寻找新家 ${ICON.arrow}</span>
          </a>
        </div>
      </div></section>

      <section class="section"><div class="container">
        <div class="section-head">
          <div><h2>最新求助</h2><p class="sub">多一次转发，就多一分找回的可能</p></div>
          <a href="#/lost">查看全部 ${ICON.arrow}</a>
        </div>
        <div class="card-grid">${latest.map(petCard).join('')}</div>
      </div></section>

      <section class="section" style="padding-top:6px"><div class="container">
        <div class="section-head">
          <div><h2>等待领养的小家伙</h2><p class="sub">领养代替购买，给它一个稳定的家</p></div>
          <a href="#/adopt">进入领养专区 ${ICON.arrow}</a>
        </div>
        <div class="card-grid">${adoptList.map(petCard).join('')}</div>
      </div></section>

      <section class="section"><div class="container">
        <div class="section-head"><div><h2>三步，帮它回家</h2><p class="sub">无论你是宠主还是路人，都可以做点什么</p></div></div>
        <div class="channel-grid">
          <div class="channel-card"><div class="ch-icon" style="background:#FFF3E8">1️⃣</div><h3>发布信息</h3><p>上传宠物照片或视频，填写特征、时间和定位，越详细越容易被认出。</p></div>
          <div class="channel-card"><div class="ch-icon" style="background:#E7F7F5">2️⃣</div><h3>附近扩散</h3><p>信息会展示在对应频道，路过的邻居、遛狗的人都能看到并提供线索。</p></div>
          <div class="channel-card"><div class="ch-icon" style="background:#F2ECFE">3️⃣</div><h3>核实联系</h3><p>通过预留的电话或微信联系，建议在公共场所见面并核对照片。</p></div>
        </div>
      </div></section>`;
  }

  /* ---------------- 列表页 ---------------- */
  function listPage(ch) {
    const { query } = parseHash();
    const cfg = CH[ch];
    const kw = (query.kw || '').trim();
    const cat = query.cat || '';
    const state = query.state || '';
    const sort = query.sort || 'new';
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const size = 6;

    let list = DB.posts.filter(p => p.channel === ch);
    list = list.filter(p => p.status === 1 || p.status === 3);
    if (state === 'done') list = list.filter(p => p.status === 3);
    else if (state === 'active') list = list.filter(p => p.status === 1);
    if (cat) list = list.filter(p => +p.categoryId === +cat);
    if (ch === 'found' && state && state.indexOf('pet') === 0) list = list.filter(p => +p.petState === +state.slice(3));
    if (kw) {
      const k = kw.toLowerCase();
      list = list.filter(p => [p.title, p.features, p.address, p.breed, p.petName, p.userName].join(' ').toLowerCase().includes(k));
    }
    list.sort((a, b) => sort === 'hot' ? (b.viewCount || 0) - (a.viewCount || 0)
      : (parseDate(b.createTime) || 0) - (parseDate(a.createTime) || 0));

    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / size));
    const pageList = list.slice((page - 1) * size, page * size);

    const qs = obj => {
      const u = new URLSearchParams();
      Object.keys(obj).forEach(k => { if (obj[k]) u.set(k, obj[k]); });
      const s = u.toString();
      return `#/${ch}${s ? '?' + s : ''}`;
    };
    const catChips = `<div class="filter-group"><span class="label">类型</span>
        <a class="chip ${!cat ? 'active' : ''}" href="${qs({ kw, state, sort })}">全部</a>
        ${DB.categories.map(c => `<a class="chip ${+cat === c.id ? 'active' : ''}" href="${qs({ kw, state, sort, cat: c.id })}">${c.icon} ${c.name}</a>`).join('')}
      </div>`;

    let stateChips = '';
    if (ch === 'lost') {
      stateChips = `<div class="filter-group"><span class="label">状态</span>
        <a class="chip ${!state ? 'active' : ''}" href="${qs({ kw, cat, sort })}">全部</a>
        <a class="chip ${state === 'active' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'active' })}">寻宠中</a>
        <a class="chip ${state === 'done' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'done' })}">已找回</a>
      </div>`;
    } else if (ch === 'found') {
      stateChips = `<div class="filter-group"><span class="label">宠物现状</span>
        <a class="chip ${!state ? 'active' : ''}" href="${qs({ kw, cat, sort })}">全部</a>
        <a class="chip ${state === 'pet1' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'pet1' })}">只是偶遇</a>
        <a class="chip ${state === 'pet2' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'pet2' })}">在我身边</a>
        <a class="chip ${state === 'pet3' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'pet3' })}">已带回家</a>
      </div>`;
    } else {
      stateChips = `<div class="filter-group"><span class="label">状态</span>
        <a class="chip ${!state ? 'active' : ''}" href="${qs({ kw, cat, sort })}">全部</a>
        <a class="chip ${state === 'active' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'active' })}">待领养</a>
        <a class="chip ${state === 'done' ? 'active' : ''}" href="${qs({ kw, cat, sort, state: 'done' })}">已领养</a>
      </div>`;
    }

    const pager = pages > 1 ? `<div class="pagination">
        ${Array.from({ length: pages }, (_, i) => i + 1).map(n =>
          `<a href="${qs({ kw, cat, state, sort, page: n > 1 ? n : '' })}"><button class="${n === page ? 'active' : ''}">${n}</button></a>`).join('')}
        <span class="total">共 ${total} 条</span>
      </div>` : `<div class="pagination"><span class="total">共 ${total} 条</span></div>`;

    const intro = ch === 'adopt'
      ? `<div class="note-card" style="margin:0 0 22px;background:linear-gradient(150deg,#F7F3FF,#fff);border-color:#E7DBFD">
           <h4 style="color:#6D28D9">领养须知</h4>
           <ul style="margin:0;padding-left:18px;color:#7C6A99;font-size:12.8px;line-height:1.9">
             <li>领养前请与送养人充分沟通，确认居住条件、家人意见与经济能力。</li>
             <li>建议签署领养协议，约定绝育、疫苗、不弃养、定期回访等条款。</li>
             <li>平台仅提供信息展示，请勿提前转账，谨防任何形式的押金诈骗。</li>
           </ul>
         </div>`
      : '';

    return `<div class="container">
      <div class="page-head">
        <h1><span class="${cfg.accent}">${cfg.label}</span></h1>
        <p>${cfg.desc}</p>
      </div>
      <div class="filter-bar">${catChips}${stateChips}
        <select onchange="location.hash=this.value">
          <option value="${qs({ kw, cat, state, sort: 'new' })}" ${sort === 'new' ? 'selected' : ''}>按最新发布</option>
          <option value="${qs({ kw, cat, state, sort: 'hot' })}" ${sort === 'hot' ? 'selected' : ''}>按浏览最多</option>
        </select>
      </div>
      ${intro}
      ${kw ? `<p style="color:#8C8178;font-size:13px;margin:-8px 0 16px">关键词「${esc(kw)}」共找到 ${total} 条结果　<a class="link-btn" href="${qs({ cat, state, sort })}">清除搜索</a></p>` : ''}
      ${pageList.length ? `<div class="card-grid">${pageList.map(petCard).join('')}</div>` : emptyBox('暂时没有相关信息', '换个筛选条件，或者成为第一个发布的人')}
      ${total ? pager : ''}
      <div style="text-align:center;margin:18px 0 40px">
        <a class="btn btn-primary btn-lg" href="#/publish?channel=${ch}">＋ ${cfg.action}</a>
      </div>
    </div>`;
  }

  /* ---------------- 详情页 ---------------- */
  function detailPage(ch, id) {
    const p = DB.posts.find(x => x.channel === ch && x.id === +id);
    if (!p) return `<div class="container" style="padding:60px 0">${emptyBox('信息不存在或已删除', '请返回列表查看其他信息')}</div>`;
    p.viewCount = (p.viewCount || 0) + 1; save();

    const cfg = CH[ch];
    const isMine = me() && (me().id === p.userId || me().role === 1);
    const related = DB.posts.filter(x => x.channel === ch && x.status === 1 && x.id !== p.id).slice(0, 3);
    const imgs = p.images && p.images.length ? p.images : [FALLBACK];
    const extra = [];
    if (ch === 'lost') {
      extra.push(['宠物名字', p.petName || '—'], ['品种', p.breed || '—'], ['性别', GENDER[p.gender] || '未知'], ['毛色', p.color || '—']);
    } else if (ch === 'found') {
      const st = { 1: '只是偶遇，已离开', 2: '宠物现在在我身边', 3: '已带回家暂养' }[p.petState] || '—';
      extra.push(['宠物状态', st], ['品种', p.breed || '—'], ['性别', GENDER[p.gender] || '未知'], ['毛色', p.color || '—']);
    } else {
      extra.push(['宠物名字', p.petName || '—'], ['品种', p.breed || '—'], ['年龄', p.age || '—'], ['性别', GENDER[p.gender] || '未知'],
        ['健康状况', p.healthStatus || '—'], ['绝育 / 疫苗', `${p.sterilized ? '已绝育' : '未绝育'} · ${p.vaccinated ? '已接种疫苗' : '未接种疫苗'}`]);
    }

    return `<div class="container">
      <div style="padding:18px 0 0;font-size:13px;color:#8C8178">
        <a href="#/">首页</a> / <a href="#/${ch}">${cfg.label}</a> / <span>详情</span>
      </div>
      <div class="detail-grid">
        <div>
          <div class="panel">
            <div class="gallery-main"><img id="mainImg" src="${imgs[0]}" alt="${esc(p.title)}" onerror="imgFallback(this)"></div>
            ${imgs.length > 1 ? `<div class="gallery-thumbs">${imgs.map((s, i) => `<img class="${i === 0 ? 'active' : ''}" src="${s}" data-act="gallery" data-src="${s}" onerror="imgFallback(this)">`).join('')}</div>` : ''}
            <div class="detail-body">
              <div class="detail-badges">
                <span class="badge ${ch}">${cfg.icon} ${cfg.label}</span>
                <span class="badge muted">${CAT(p.categoryId).icon} ${CAT(p.categoryId).name}</span>
                ${statusBadge(p)}
                ${p.channel === 'found' ? `<span class="badge warn">${{ 1: '只是偶遇', 2: '在我身边', 3: '已带回家' }[p.petState]}</span>` : ''}
              </div>
              <h1 class="detail-title">${esc(p.title)}</h1>
              <div class="info-grid">
                <div class="info-item"><div class="k">${cfg.timeLabel}</div><div class="v">${fmt(p.time) || relative(p.createTime)}</div></div>
                <div class="info-item"><div class="k">${ch === 'adopt' ? '所在地区' : '地点'}</div><div class="v">${esc(p.address)}</div></div>
                ${extra.map(([k, v]) => `<div class="info-item"><div class="k">${k}</div><div class="v">${esc(v)}</div></div>`).join('')}
              </div>
              <div class="block-title">${ch === 'adopt' ? '性格与领养要求' : '宠物特征描述'}</div>
              <p class="block-text">${esc(p.features)}</p>
              ${p.reason ? `<div class="block-title">送养原因</div><p class="block-text">${esc(p.reason)}</p>` : ''}
              ${p.video ? `<div class="block-title">视频</div><div class="video-note">🎬 <b>${esc(p.video)}</b>　原型演示中仅记录文件名，正式版支持视频上传与播放</div>` : ''}
              <div class="block-title">${ch === 'adopt' ? '所在位置' : '走失 / 发现位置'}</div>
              ${mapBox(p)}
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px">
                <button class="btn btn-primary" data-act="reveal">${ICON.phone} 查看联系方式</button>
                <button class="btn btn-ghost" data-act="share">转发这条信息</button>
                <button class="btn btn-ghost" data-act="back">返回列表</button>
                ${isMine && p.status === 1 ? `<button class="btn btn-dark" data-act="finish" data-id="${p.id}" data-ch="${ch}">标记${cfg.doneText}</button>` : ''}
                ${isMine ? `<button class="btn btn-ghost" data-act="delete" data-id="${p.id}" data-ch="${ch}" style="color:#B91C1C">删除</button>` : ''}
              </div>
            </div>
          </div>
          ${related.length ? `<div class="section" style="padding:30px 0 0">
            <div class="section-head"><div><h2 style="font-size:20px">相关${cfg.short}信息</h2></div></div>
            <div class="card-grid">${related.map(petCard).join('')}</div>
          </div>` : ''}
        </div>
        <div class="side-stack">
          <div class="panel contact-card">
            <h3>联系发布人</h3>
            <p class="tip">${ch === 'adopt' ? '领养请先沟通确认，再线下见面' : '提供线索时请说明你看到的时间与地点'}</p>
            <div class="contact-row"><span class="k">联系人</span><span class="v">${esc(p.contactName)}</span></div>
            <div class="contact-row"><span class="k">手机号</span><span class="v" id="phoneVal">${esc(p.contactPhone.replace(/(\d{3})-?(\d{4})-?(\d{4})/, '$1****$3'))}</span></div>
            <div class="contact-row"><span class="k">微信号</span><span class="v">${p.contactWechat ? esc(p.contactWechat) : '未填写'}</span></div>
            <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-primary btn-block" data-act="reveal">显示完整联系方式</button>
              <a class="btn btn-ghost btn-block" href="#/publish?channel=found">我也遇到了走失宠物</a>
            </div>
            <p style="font-size:11.5px;color:#A99887;margin:12px 0 0;line-height:1.7">为保护隐私，联系方式默认脱敏。请勿将信息用于其他用途。</p>
          </div>
          <div class="safety"><b>⚠ 安全提示</b>线下见面请选择人流较多的公共场所；领养不要提前支付任何押金、运费；核对宠物照片与特征，避免误认。</div>
          <div class="panel" style="padding:18px">
            <div style="font-size:13px;font-weight:700;margin-bottom:10px">信息数据</div>
            <div class="contact-row" style="border-top:none;padding-top:0"><span class="k">发布时间</span><span class="v">${relative(p.createTime)}</span></div>
            <div class="contact-row"><span class="k">浏览次数</span><span class="v">${p.viewCount}</span></div>
            <div class="contact-row"><span class="k">信息编号</span><span class="v">#${p.id}</span></div>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- 发布页 ---------------- */
  let draftImages = [];
  let draftVideoName = '';

  function field(label, name, opts) {
    opts = opts || {};
    const req = opts.required ? '<span class="req">*</span>' : '';
    if (opts.type === 'textarea') {
      return `<div class="field"><label class="field-label">${label}${req}</label>
        <textarea class="textarea" name="${name}" ${opts.required ? 'required' : ''} placeholder="${opts.placeholder || ''}"></textarea>
        ${opts.hint ? `<div class="field-hint">${opts.hint}</div>` : ''}</div>`;
    }
    return `<div class="field"><label class="field-label">${label}${req}</label>
      <input class="input" name="${name}" type="${opts.type || 'text'}" ${opts.required ? 'required' : ''} placeholder="${opts.placeholder || ''}" ${opts.value ? `value="${opts.value}"` : ''}>
      ${opts.hint ? `<div class="field-hint">${opts.hint}</div>` : ''}</div>`;
  }

  function publishPage(ch) {
    const cfg = CH[ch];
    if (!me()) return loginRequired('发布信息需要先登录');
    draftImages = []; draftVideoName = '';

    const catOptions = DB.categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
    const isFound = ch === 'found', isAdopt = ch === 'adopt';

    const stateBlock = isFound ? `
      <div class="form-section-title"><span class="idx">2</span>宠物现状（重要）</div>
      <div class="field">
        <label class="field-label">你现在和这只宠物的关系是？<span class="req">*</span></label>
        <div class="segmented">
          <label class="seg-card checked"><input type="radio" name="petState" value="1" checked>
            <div class="seg-title">🚶 只是偶遇</div><div class="seg-desc">看到它经过/停留，已经离开，无法控制它</div></label>
          <label class="seg-card"><input type="radio" name="petState" value="2">
            <div class="seg-title">🤝 宠物在我身边</div><div class="seg-desc">它一直跟着我/被我留住，暂时看护中</div></label>
          <label class="seg-card"><input type="radio" name="petState" value="3">
            <div class="seg-title">🏠 已带回家暂养</div><div class="seg-desc">已安置在家中，可等待主人认领</div></label>
        </div>
        <div class="field-hint">选择「在我身边」或「已带回家」时，请务必填写可联系的方式，方便宠主尽快认领。</div>
      </div>` : '';

    return `<div class="container">
      <div class="page-head"><h1>${cfg.action}</h1><p>${cfg.desc}。带 <span style="color:#DC2626">*</span> 为必填项，提交后需管理员审核。</p></div>
      <div class="publish-wrap">
        <form class="form-card" data-form="publish" data-channel="${ch}" novalidate>
          <input type="hidden" name="lng" id="f-lng"><input type="hidden" name="lat" id="f-lat">
          <div class="form-section-title"><span class="idx">1</span>基本信息</div>
          ${field('标题', 'title', { required: true, placeholder: isAdopt ? '例如：2岁英短「元宝」找新家，因搬家无法带走' : (isFound ? '例如：望京地铁站偶遇一只戴蓝色项圈的边牧' : '例如：急寻！布偶猫「奶糖」在望京SOHO附近走失') })}
          <div class="row-2">
            <div class="field"><label class="field-label">宠物类型<span class="req">*</span></label>
              <select class="select" name="categoryId" required>${catOptions}</select></div>
            ${field('品种', 'breed', { placeholder: '例如：柯基 / 英短 / 虎皮鹦鹉' })}
          </div>
          <div class="row-3">
            ${!isFound ? field('宠物名字', 'petName', { placeholder: '例如：奶糖' }) : ''}
            <div class="field"><label class="field-label">性别</label>
              <select class="select" name="gender"><option value="0">未知</option><option value="1">公</option><option value="2">母</option></select></div>
            ${field('毛色', 'color', { placeholder: '例如：三色 / 蓝灰' })}
          </div>
          ${isAdopt ? `<div class="row-3">
              ${field('年龄', 'age', { placeholder: '例如：2岁3个月' })}
              ${field('健康状况', 'healthStatus', { placeholder: '例如：健康 / 已驱虫' })}
              <div class="field"><label class="field-label">绝育 / 疫苗</label>
                <div style="display:flex;gap:8px">
                  <select class="select" name="sterilized"><option value="0">未绝育</option><option value="1">已绝育</option></select>
                  <select class="select" name="vaccinated"><option value="0">未接种</option><option value="1">已接种</option></select>
                </div></div>
            </div>
            ${field('送养原因', 'reason', { placeholder: '请如实说明无法继续饲养的原因，例如工作调动、家人过敏、搬家等' })}` : ''}

          <div class="form-section-title"><span class="idx">2</span>${isFound ? '发现信息' : (isAdopt ? '宠物情况' : '走失信息')}</div>
          <div class="row-2">
            <div class="field"><label class="field-label">${cfg.timeLabel}<span class="req">*</span></label>
              <input class="input" type="datetime-local" name="time" required>
              <div class="field-hint">${isAdopt ? '可填写你决定送养的时间' : '尽量精确到小时，便于比对'}</div></div>
            ${field(isAdopt ? '所在地区' : (isFound ? '发现地点' : '走失地点'), 'address', { required: true, placeholder: '例如：朝阳区望京SOHO T3 附近' })}
          </div>
          ${!isAdopt ? `<div class="field"><label class="field-label">地图定位</label>
            <div class="input-group">
              <input class="input" id="f-coord" readonly placeholder="点击右侧按钮获取当前位置（原型演示）">
              <button class="btn btn-ghost" type="button" data-act="geo">📍 获取定位</button>
            </div>
            <div class="field-hint">定位仅用于展示大致范围，不会公开你的精确门牌号。</div></div>` : ''}
          ${field(isAdopt ? '性格与领养要求' : '宠物特征描述', 'features', { type: 'textarea', required: true, placeholder: isAdopt ? '描述它的性格、生活习惯，以及对领养人的要求，例如：亲人、会用猫砂、需封窗、接受回访…' : '请描述毛色、体型、项圈、疤痕、特殊习惯、是否会回应名字等，越具体越容易被认出' })}

          <div class="form-section-title"><span class="idx">3</span>照片与视频</div>
          <div class="upload-grid" id="uploadGrid"></div>
          <div class="video-note">🎬 视频：
            <input type="file" accept="video/*" data-upload="video" style="font-size:12px;max-width:200px">
            <span id="videoName">未选择</span>
          </div>

          ${stateBlock}

          <div class="form-section-title"><span class="idx">${isFound ? '3' : '4'}</span>联系方式</div>
          <div class="row-3">
            ${field('联系人', 'contactName', { required: true, value: me().nickname })}
            ${field('联系电话', 'contactPhone', { required: true, value: me().phone || '', placeholder: '手机号或座机' })}
            ${field('微信号', 'contactWechat', { value: me().wechat || '', placeholder: '选填' })}
          </div>

          <div class="form-actions">
            <span class="hint">提交后进入审核队列，审核通过后展示在「${cfg.label}」</span>
            <a class="btn btn-ghost" href="#/${ch}">取消</a>
            <button class="btn btn-primary" type="submit">提交发布</button>
          </div>
        </form>

        <div class="preview-sticky">
          <div class="preview-label">实时预览</div>
          <div class="pet-card" id="previewCard">
            <div class="thumb">
              <img id="pvImg" src="${FALLBACK}" alt="预览">
              <div class="badges"><span class="badge ${ch}">${cfg.icon} ${cfg.label}</span><span class="badge warn">待审核</span></div>
            </div>
            <div class="pet-body">
              <h3 id="pvTitle">${isAdopt ? '领养信息标题' : (isFound ? '遇见走失宠物' : '寻宠启事标题')}</h3>
              <div class="pet-meta"><div>${ICON.pin}<span id="pvAddr">填写地点</span></div><div>${ICON.clock}${cfg.timeLabel}：<span id="pvTime">待填写</span></div></div>
              <p class="pet-desc" id="pvDesc">填写宠物特征后，这里会实时显示预览效果。</p>
              <div class="pet-foot"><span>${esc(me().nickname)} 发布</span><span class="views">${ICON.eye}0</span></div>
            </div>
          </div>
          <div class="note-card">
            <h4>发布小贴士</h4>
            <ul>
              <li>照片尽量包含全身、脸部、特殊标记三张。</li>
              <li>写清项圈颜色、疤痕、绝育标记等辨识点。</li>
              <li>${isFound ? '选择「已带回家」时，请先确认家中无人过敏，并注意隔离。' : '保持电话畅通，陌生来电可能是好心人。'}</li>
              <li>信息找回后请及时标记，避免打扰。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderUpload() {
    const grid = document.getElementById('uploadGrid');
    if (!grid) return;
    const items = draftImages.map((src, i) =>
      `<div class="upload-item"><img src="${src}" data-act="view-img" data-src="${src}" alt="已上传图片"><button type="button" class="del" data-act="del-img" data-i="${i}">×</button></div>`).join('');
    const add = draftImages.length < 3
      ? `<label class="upload-add"><input type="file" accept="image/*" multiple data-upload="image" style="display:none"><span>＋</span>上传照片<br>（${draftImages.length}/3）</label>`
      : '';
    grid.innerHTML = items + add;
    const pv = document.getElementById('pvImg');
    if (pv && draftImages[0]) pv.src = draftImages[0];
  }

  function readImage(file, cb) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 900 / img.width);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      cb(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); cb(null); };
    img.src = url;
  }

  /* ---------------- 个人中心 ---------------- */
  function profilePage() {
    const user = me();
    if (!user) return loginRequired('查看个人中心需要先登录');
    const { query } = parseHash();
    const tab = query.tab || 'all';
    let mine = DB.posts.filter(p => p.userId === user.id);
    if (tab !== 'all') mine = mine.filter(p => p.channel === tab);
    mine = mine.sort((a, b) => (parseDate(b.createTime) || 0) - (parseDate(a.createTime) || 0));
    const count = ch => DB.posts.filter(p => p.userId === user.id && p.channel === ch).length;

    const rows = mine.map(p => `<div class="my-row">
        <img src="${(p.images && p.images[0]) || FALLBACK}" onerror="imgFallback(this)" alt="">
        <div class="info">
          <h3>${esc(p.title)}<span class="status-pill status-${p.status}">${stateText(p)}</span></h3>
          <div class="meta"><span>${CH[p.channel].icon} ${CH[p.channel].label}</span><span>${esc(p.address)}</span><span>${relative(p.createTime)}</span><span>浏览 ${p.viewCount || 0}</span></div>
          ${p.status === 2 && p.auditRemark ? `<div class="meta" style="color:#B91C1C;margin-top:4px">驳回原因：${esc(p.auditRemark)}</div>` : ''}
        </div>
        <div class="ops">
          ${p.status === 1 ? `<a class="btn btn-ghost btn-sm" href="#/detail/${p.channel}/${p.id}">查看</a>
            <button class="btn btn-dark btn-sm" data-act="finish" data-id="${p.id}" data-ch="${p.channel}">标记${CH[p.channel].doneText}</button>` : ''}
          ${p.status === 0 ? `<button class="btn btn-ghost btn-sm" data-act="edit-demo">编辑</button>` : ''}
          <button class="btn btn-ghost btn-sm" data-act="delete" data-id="${p.id}" data-ch="${p.channel}" style="color:#B91C1C">删除</button>
        </div>
      </div>`).join('');

    return `<div class="container">
      <div class="me-head">
        <div class="me-avatar">${esc(user.nickname.slice(0, 1))}</div>
        <div><h1>${esc(user.nickname)}</h1>
          <p>账号：${esc(user.username)}　·　${({ 1: '宠主', 2: '好心人', 3: '宠主 / 好心人' })[user.userType]}　·　${user.role === 1 ? '管理员' : '普通用户'}</p>
        </div>
        <div style="margin-left:auto;display:flex;gap:10px">
          ${user.role === 1 ? '<a class="btn btn-dark" href="#/admin">进入管理后台</a>' : ''}
          <button class="btn btn-ghost" data-act="logout">退出登录</button>
        </div>
      </div>
      <div class="me-tabs">
        <a class="me-tab ${tab === 'all' ? 'active' : ''}" href="#/me">全部发布（${DB.posts.filter(p => p.userId === user.id).length}）</a>
        <a class="me-tab ${tab === 'lost' ? 'active' : ''}" href="#/me?tab=lost">寻宠启事（${count('lost')}）</a>
        <a class="me-tab ${tab === 'found' ? 'active' : ''}" href="#/me?tab=found">遇见走失（${count('found')}）</a>
        <a class="me-tab ${tab === 'adopt' ? 'active' : ''}" href="#/me?tab=adopt">领养信息（${count('adopt')}）</a>
        <a class="me-tab ${tab === 'setting' ? 'active' : ''}" href="#/me?tab=setting">账号设置</a>
      </div>
      ${tab === 'setting' ? settingPanel(user) : (rows || emptyBox('还没有发布过信息', '选择下方频道，发布你的第一条信息') + '<div style="text-align:center;margin-top:18px"><a class="btn btn-primary" href="#/publish?channel=lost">去发布</a></div>')}
      <div style="height:50px"></div>
    </div>`;
  }

  function settingPanel(user) {
    return `<div class="form-card" style="max-width:560px;margin-top:20px">
      <form data-form="setting">
        <div class="form-section-title" style="margin-top:0"><span class="idx">✎</span>修改个人信息</div>
        ${field('昵称', 'nickname', { required: true, value: user.nickname })}
        <div class="row-2">${field('手机号', 'phone', { value: user.phone || '' })}${field('微信号', 'wechat', { value: user.wechat || '' })}</div>
        <div class="field"><label class="field-label">账号身份</label>
          <select class="select" name="userType">
            <option value="1" ${user.userType === 1 ? 'selected' : ''}>我是宠主</option>
            <option value="2" ${user.userType === 2 ? 'selected' : ''}>我是好心人</option>
            <option value="3" ${user.userType === 3 ? 'selected' : ''}>两者都是</option>
          </select></div>
        ${field('新密码', 'password', { type: 'password', placeholder: '留空则不修改密码' })}
        <div class="form-actions" style="margin-top:20px"><span class="hint">修改后立即生效</span><button class="btn btn-primary" type="submit">保存修改</button></div>
      </form>
    </div>`;
  }

  /* ---------------- 管理后台 ---------------- */
  function adminPage() {
    const user = me();
    if (!user) return loginRequired('管理后台需要管理员登录');
    if (user.role !== 1) return `<div class="container" style="padding:60px 0">${emptyBox('没有访问权限', '当前账号不是管理员，请使用 admin / admin123 登录')}</div>`;

    const { query } = parseHash();
    const tab = query.tab || 'dashboard';
    const pending = DB.posts.filter(p => p.status === 0);
    const navItems = [['dashboard', '数据概览', '📊'], ['audit', '内容审核', '📝'], ['users', '用户管理', '👤'], ['category', '分类管理', '🐾']];
    const nav = navItems.map(([k, label, icon]) =>
      `<a class="${tab === k ? 'active' : ''}" href="#/admin?tab=${k}">${icon} ${label}${k === 'audit' && pending.length ? ` <span style="margin-left:auto;background:#F97316;color:#fff;font-size:11px;padding:1px 7px;border-radius:999px">${pending.length}</span>` : ''}</a>`).join('');

    let body = '';
    if (tab === 'dashboard') body = adminDashboard();
    else if (tab === 'audit') body = adminAudit();
    else if (tab === 'users') body = adminUsers();
    else body = adminCategory();

    return `<div class="container"><div class="admin-shell">
      <aside class="admin-nav"><div class="brand-mini">🛠 管理后台</div>${nav}</aside>
      <section class="admin-main">${body}</section>
    </div></div>`;
  }

  function adminDashboard() {
    const total = DB.posts.length;
    const lost = countAll('lost'), found = countAll('found'), adopt = countAll('adopt');
    const pendingList = DB.posts.filter(p => p.status === 0);
    const pending = pendingList.length;
    const done = DB.posts.filter(p => p.status === 3).length;
    const max = Math.max(lost, found, adopt, 1);
    const bars = [['寻宠启事', lost, 'bar'], ['遇见走失', found, 'bar b2'], ['领养信息', adopt, 'bar b3']]
      .map(([label, n, cls]) => `<div class="bar-col"><span class="val">${n}</span><div class="${cls}" style="height:${Math.max(8, n / max * 100)}%"></div><span class="lbl">${label}</span></div>`).join('');
    const recent = DB.posts.slice().sort((a, b) => (parseDate(b.createTime) || 0) - (parseDate(a.createTime) || 0)).slice(0, 5);
    const recentRows = recent.map(p => `<tr>
        <td><span class="t-title">${esc(p.title)}</span><span class="t-sub">${CH[p.channel].label} · #${p.id}</span></td>
        <td>${esc(p.userName)}</td><td>${relative(p.createTime)}</td>
        <td><span class="status-pill status-${p.status}">${stateText(p)}</span></td>
      </tr>`).join('');
    return `<h2 class="admin-title">数据概览</h2><p class="admin-sub">当前共 ${DB.users.length} 位注册用户，${total} 条发布信息</p>
      <div class="stat-cards">
        <div class="stat-card accent"><div class="k">待审核</div><div class="n">${pending}<small>条</small></div></div>
        <div class="stat-card"><div class="k">寻宠启事</div><div class="n">${lost}<small>条</small></div></div>
        <div class="stat-card"><div class="k">遇见线索</div><div class="n">${found}<small>条</small></div></div>
        <div class="stat-card"><div class="k">成功团圆 / 领养</div><div class="n">${done}<small>例</small></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1.1fr .9fr;gap:16px" class="admin-cols">
        <div class="table-wrap" style="padding:18px 18px 10px">
          <div style="font-size:14px;font-weight:700;margin-bottom:10px">各频道发布量</div>
          <div class="bar-chart">${bars}</div>
        </div>
        <div class="table-wrap" style="padding:18px">
          <div style="font-size:14px;font-weight:700;margin-bottom:6px">审核队列</div>
          <p style="font-size:12.5px;color:#8C8178;margin:0 0 14px">待审核内容审核通过后才会在前台展示</p>
          ${pendingList.length ? pendingList.slice(0, 3).map(p => `<div style="padding:10px 0;border-top:1px dashed #EFE8E0">
            <div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.title)}</div>
            <div style="font-size:11.5px;color:#8C8178;margin-top:3px;display:flex;justify-content:space-between">
              <span>${CH[p.channel].label} · ${esc(p.userName)}</span>
              <a class="link-btn" href="#/admin?tab=audit">去审核</a>
            </div></div>`).join('') : '<div style="font-size:13px;color:#8C8178;padding:12px 0">🎉 暂无待审核内容</div>'}
        </div>
      </div>
      <div class="table-wrap" style="margin-top:16px">
        <table><thead><tr><th>最新发布</th><th>发布人</th><th>时间</th><th>状态</th></tr></thead><tbody>${recentRows}</tbody></table>
      </div>`;
  }

  function adminAudit() {
    const { query } = parseHash();
    const filter = query.status || '0';
    let list = DB.posts.slice().sort((a, b) => (parseDate(b.createTime) || 0) - (parseDate(a.createTime) || 0));
    if (filter !== 'all') list = list.filter(p => String(p.status) === filter);
    const rows = list.map(p => `<tr>
        <td><span class="t-title">${esc(p.title)}</span><span class="t-sub">#${p.id} · ${esc(p.address)}</span></td>
        <td>${CH[p.channel].icon} ${CH[p.channel].label}</td>
        <td>${esc(p.userName)}</td>
        <td>${relative(p.createTime)}</td>
        <td><span class="status-pill status-${p.status}">${stateText(p)}</span></td>
        <td><div class="row-ops">
          ${p.status === 0 ? `<button class="btn btn-primary btn-sm" data-act="approve" data-id="${p.id}" data-ch="${p.channel}">通过</button>
          <button class="btn btn-ghost btn-sm" data-act="reject" data-id="${p.id}" data-ch="${p.channel}" style="color:#B91C1C">驳回</button>` : ''}
          <a class="btn btn-ghost btn-sm" href="#/detail/${p.channel}/${p.id}">查看</a>
        </div></td>
      </tr>`).join('');
    return `<h2 class="admin-title">内容审核</h2><p class="admin-sub">审核通过后信息才会在前台展示；驳回需填写原因，用户可在个人中心看到</p>
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
        ${[['0', '待审核'], ['1', '已通过'], ['2', '已驳回'], ['3', '已完成'], ['all', '全部']].map(([k, l]) =>
          `<a class="chip ${filter === k ? 'active' : ''}" href="#/admin?tab=audit&status=${k}">${l}</a>`).join('')}
      </div>
      <div class="table-wrap"><table><thead><tr><th>内容</th><th>频道</th><th>发布人</th><th>提交时间</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" style="text-align:center;padding:40px;color:#8C8178">没有符合条件的内容</td></tr>'}</tbody></table></div>`;
  }

  function adminUsers() {
    const rows = DB.users.map(u => `<tr>
        <td><div style="display:flex;align-items:center;gap:9px"><div class="avatar" style="width:28px;height:28px;font-size:12px">${esc(u.nickname.slice(0, 1))}</div>
          <div><span class="t-title" style="max-width:120px">${esc(u.nickname)}</span><span class="t-sub">@${esc(u.username)}</span></div></div></td>
        <td>${{ 1: '宠主', 2: '好心人', 3: '宠主/好心人' }[u.userType]}</td>
        <td>${esc(u.phone || '—')}</td>
        <td>${DB.posts.filter(p => p.userId === u.id).length} 条</td>
        <td><label class="switch"><input type="checkbox" ${u.role === 1 ? 'checked' : ''} ${u.id === 1 ? 'disabled' : ''} data-act="role" data-id="${u.id}"><i></i></label>
          <span style="font-size:12px;color:#8C8178;margin-left:6px">${u.role === 1 ? '管理员' : '普通用户'}</span></td>
        <td><label class="switch"><input type="checkbox" ${u.status !== 0 ? 'checked' : ''} ${u.id === 1 ? 'disabled' : ''} data-act="status" data-id="${u.id}"><i></i></label>
          <span style="font-size:12px;color:#8C8178;margin-left:6px">${u.status !== 0 ? '正常' : '禁用'}</span></td>
      </tr>`).join('');
    return `<h2 class="admin-title">用户管理</h2><p class="admin-sub">可调整用户身份与账号状态；管理员账号与自身账号不可修改</p>
      <div class="table-wrap"><table><thead><tr><th>用户</th><th>身份</th><th>手机号</th><th>发布数</th><th>角色</th><th>状态</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function adminCategory() {
    const rows = DB.categories.map(c => {
      const n = DB.posts.filter(p => +p.categoryId === c.id).length;
      return `<tr><td style="font-size:18px">${c.icon}</td><td>${esc(c.name)}</td><td>${n} 条信息</td>
        <td><button class="btn btn-ghost btn-sm" data-act="cat-del" data-id="${c.id}" ${n ? 'disabled title="该分类下已有内容"' : ''} style="color:#B91C1C">删除</button></td></tr>`;
    }).join('');
    return `<h2 class="admin-title">分类管理</h2><p class="admin-sub">分类用于前台筛选；已有内容的分类不可删除</p>
      <div style="display:flex;gap:10px;margin-bottom:16px;max-width:430px">
        <input class="input" id="newCat" placeholder="输入新分类名称，例如：仓鼠">
        <button class="btn btn-primary" data-act="cat-add" style="flex-shrink:0">新增分类</button>
      </div>
      <div class="table-wrap" style="max-width:640px"><table><thead><tr><th>图标</th><th>名称</th><th>使用情况</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  /* ---------------- 登录 / 注册 ---------------- */
  let authMode = 'login';

  function loginRequired(msg) {
    return `<div class="container" style="padding:70px 0 90px"><div class="empty" style="max-width:520px;margin:0 auto">
      <div class="emoji">🔐</div><b>${msg}</b>
      <p style="margin:6px 0 18px">登录后即可发布信息、管理发布内容</p>
      <button class="btn btn-primary" data-act="login">立即登录 / 注册</button>
    </div></div>`;
  }

  function openAuth(mode) {
    authMode = mode || authMode;
    const isLogin = authMode === 'login';
    modalRoot.innerHTML = `<div class="modal-mask"><div class="modal">
      <button class="close" data-act="close-modal">×</button>
      <h2>${isLogin ? '欢迎回来' : '加入寻宠之家'}</h2>
      <p class="modal-sub">${isLogin ? '登录后可以发布寻宠、遇见与领养信息' : '选择你的身份，开始帮助毛孩子回家'}</p>
      <div class="modal-tabs">
        <button class="${isLogin ? 'active' : ''}" data-act="auth-tab" data-mode="login">登录</button>
        <button class="${!isLogin ? 'active' : ''}" data-act="auth-tab" data-mode="register">注册</button>
      </div>
      ${isLogin ? `<form data-form="login">
          <div class="field"><label class="field-label">账号</label><input class="input" name="username" required placeholder="用户名或手机号"></div>
          <div class="field"><label class="field-label">密码</label><input class="input" type="password" name="password" required placeholder="请输入密码"></div>
          <button class="btn btn-primary btn-block" type="submit" style="margin-top:6px">登录</button>
          <div class="demo-tip">演示账号
            <span><button type="button" class="link-btn" data-act="fill" data-u="linxiao" data-p="123456">宠主</button> ·
            <button type="button" class="link-btn" data-act="fill" data-u="admin" data-p="admin123">管理员</button></span>
          </div>
        </form>` : `<form data-form="register">
          <div class="row-2">
            <div class="field"><label class="field-label">账号<span class="req">*</span></label><input class="input" name="username" required placeholder="英文或数字"></div>
            <div class="field"><label class="field-label">昵称<span class="req">*</span></label><input class="input" name="nickname" required placeholder="展示名称"></div>
          </div>
          <div class="field"><label class="field-label">我的身份</label>
            <select class="select" name="userType"><option value="1">宠主（寻找走失宠物）</option><option value="2">好心人（提供遇见线索）</option><option value="3">两者都是</option></select></div>
          <div class="row-2">
            <div class="field"><label class="field-label">手机号</label><input class="input" name="phone" placeholder="便于联系"></div>
            <div class="field"><label class="field-label">密码<span class="req">*</span></label><input class="input" type="password" name="password" required minlength="6" placeholder="至少6位"></div>
          </div>
          <button class="btn btn-primary btn-block" type="submit" style="margin-top:6px">注册并登录</button>
        </form>`}
    </div></div>`;
  }
  function closeModal() { modalRoot.innerHTML = ''; }

  /* ---------------- 用户菜单 ---------------- */
  function toggleUserMenu() {
    const user = me();
    const box = document.getElementById('userMenu');
    if (!box) return;
    if (box.innerHTML) { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="user-menu">
      <a href="#/me">👤 个人中心</a>
      <a href="#/me?tab=setting">⚙️ 账号设置</a>
      ${user && user.role === 1 ? '<a href="#/admin">🛠 管理后台</a>' : ''}
      <button data-act="logout">↩ 退出登录</button>
    </div>`;
  }
  function togglePublishMenu() {
    const box = document.getElementById('userMenu');
    if (!box) return;
    if (box.innerHTML) { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="user-menu">
      <a href="#/publish?channel=lost">🐾 发布寻宠启事</a>
      <a href="#/publish?channel=found">👀 发布遇见线索</a>
      <a href="#/publish?channel=adopt">🏡 发布领养信息</a>
    </div>`;
  }

  /* ---------------- 路由 ---------------- */
  function route() {
    const { path, query } = parseHash();
    const seg = path.split('/').filter(Boolean);
    let html;
    if (path === '/' || path === '') html = homePage();
    else if (seg[0] === 'lost' || seg[0] === 'found' || seg[0] === 'adopt') {
      if (seg[1] === 'detail' && seg[2]) html = detailPage(seg[0], seg[2]);
      else if (seg[1] === 'detail') html = detailPage(seg[0], seg[2] || seg[1]);
      else html = listPage(seg[0]);
    } else if (seg[0] === 'detail') {
      html = detailPage(seg[1], seg[2]);
    } else if (seg[0] === 'publish') {
      const ch = query.channel || 'lost';
      html = publishPage(CH[ch] ? ch : 'lost');
    } else if (seg[0] === 'me') html = profilePage();
    else if (seg[0] === 'admin') html = adminPage();
    else html = `<div class="container" style="padding:70px 0">${emptyBox('页面不存在', '请检查链接地址')}</div>`;

    app.innerHTML = shell(html);
    window.scrollTo(0, 0);

    if (seg[0] === 'publish') { renderUpload(); }
    if (seg[0] === 'publish' && !me()) setTimeout(() => openAuth('login'), 120);
  }

  /** 重新渲染当前路由（供增删改操作后刷新使用） */
  function render() { route(); }

  /* ---------------- 事件 ---------------- */
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-act]');
    if (!el) {
      const menu = document.getElementById('userMenu');
      if (menu && !e.target.closest('.user-menu')) menu.innerHTML = '';
      if (e.target.classList && e.target.classList.contains('modal-mask')) closeModal();
      return;
    }
    const act = el.dataset.act;

    if (act === 'go') { location.hash = el.dataset.href; return; }
    if (act === 'login') { openAuth('login'); return; }
    if (act === 'close-modal') { closeModal(); return; }
    if (act === 'auth-tab') { openAuth(el.dataset.mode); return; }

    if (act === 'fill') {
      const f = modalRoot.querySelector('form');
      f.username.value = el.dataset.u; f.password.value = el.dataset.p;
      return;
    }
    if (act === 'user-menu') { toggleUserMenu(); return; }
    if (act === 'publish-menu') { togglePublishMenu(); return; }
    if (act === 'logout') {
      DB.session = null; save(); document.getElementById('userMenu') && (document.getElementById('userMenu').innerHTML = '');
      toast('已退出登录'); location.hash = '#/'; render(); return;
    }
    if (act === 'back') { history.length > 1 ? history.back() : location.hash = '#/lost'; return; }
    if (act === 'gallery') {
      const main = document.getElementById('mainImg');
      if (main) main.src = el.dataset.src;
      document.querySelectorAll('.gallery-thumbs img').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      return;
    }
    if (act === 'view-img') {
      const box = document.createElement('div');
      box.className = 'lightbox';
      box.innerHTML = `<img src="${el.dataset.src}" alt="">`;
      box.onclick = () => box.remove();
      document.body.appendChild(box);
      return;
    }
    if (act === 'reveal') {
      const p = currentDetailPost();
      if (!p) return;
      modalRoot.innerHTML = `<div class="modal-mask"><div class="modal" style="max-width:390px">
        <button class="close" data-act="close-modal">×</button>
        <h2>联系方式</h2><p class="modal-sub">请说明来意，避免误会</p>
        <div class="contact-row" style="border-top:none"><span class="k">联系人</span><span class="v">${esc(p.contactName)}</span></div>
        <div class="contact-row"><span class="k">手机号</span><span class="v" style="font-size:16px">${esc(p.contactPhone)}</span></div>
        <div class="contact-row"><span class="k">微信号</span><span class="v">${esc(p.contactWechat || '未填写')}</span></div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <a class="btn btn-primary btn-block" href="tel:${esc(p.contactPhone.replace(/-/g, ''))}">拨打电话</a>
          <button class="btn btn-ghost btn-block" data-act="copy" data-text="${esc(p.contactPhone)}">复制号码</button>
        </div>
        <p style="font-size:11.5px;color:#A99887;margin:12px 0 0;line-height:1.7">${CH[p.channel].icon} ${CH[p.channel].label} · #${p.id}　请勿将联系方式用于其他用途。</p>
      </div></div>`;
      return;
    }
    if (act === 'copy') {
      navigator.clipboard && navigator.clipboard.writeText(el.dataset.text);
      toast('已复制：' + el.dataset.text); return;
    }
    if (act === 'share') {
      const url = location.href;
      if (navigator.share) navigator.share({ title: '寻宠之家 · 请帮忙留意', url }).catch(() => { });
      else { navigator.clipboard && navigator.clipboard.writeText(url); toast('链接已复制，可转发给朋友'); }
      return;
    }
    if (act === 'del-img') {
      draftImages.splice(+el.dataset.i, 1); renderUpload(); return;
    }
    if (act === 'geo') {
      const fill = (lng, lat, tip) => {
        const lngEl = document.getElementById('f-lng'), latEl = document.getElementById('f-lat'), c = document.getElementById('f-coord');
        if (lngEl) lngEl.value = lng; if (latEl) latEl.value = lat;
        if (c) c.value = `已定位：${lng}, ${lat}`;
        if (tip) toast(tip, tip.indexOf('示例') >= 0 ? 'info' : 'ok');
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => fill(pos.coords.longitude.toFixed(6), pos.coords.latitude.toFixed(6), '定位成功'),
          () => fill('116.404000', '39.915000', '未获取到定位权限，已使用示例位置')
        );
      } else fill('116.404000', '39.915000', '当前浏览器不支持定位，已使用示例位置');
      return;
    }
    if (act === 'finish' || act === 'delete') {
      const ch = el.dataset.ch, id = +el.dataset.id;
      const p = DB.posts.find(x => x.channel === ch && x.id === id);
      if (!p) return;
      if (act === 'finish') {
        if (!confirm(`确认将「${p.title}」标记为${CH[ch].doneText}？`)) return;
        p.status = 3; save(); toast('已更新状态'); render(); return;
      }
      if (!confirm('删除后不可恢复，确认删除这条信息？')) return;
      DB.posts = DB.posts.filter(x => !(x.channel === ch && x.id === id));
      save(); toast('已删除'); location.hash = '#/me'; render(); return;
    }
    if (act === 'approve') {
      const p = DB.posts.find(x => x.channel === el.dataset.ch && x.id === +el.dataset.id);
      if (p) { p.status = 1; save(); toast('审核通过'); render(); }
      return;
    }
    if (act === 'reject') {
      const p = DB.posts.find(x => x.channel === el.dataset.ch && x.id === +el.dataset.id);
      if (!p) return;
      const reason = prompt('请填写驳回原因（用户可在个人中心看到）', '信息不完整，请补充宠物特征与清晰照片');
      if (reason === null) return;
      p.status = 2; p.auditRemark = reason || '信息不符合发布规范';
      save(); toast('已驳回', 'info'); render(); return;
    }
    if (act === 'cat-add') {
      const input = document.getElementById('newCat');
      const name = (input && input.value || '').trim();
      if (!name) { toast('请输入分类名称', 'info'); return; }
      DB.categories.push({ id: Math.max(0, ...DB.categories.map(c => c.id)) + 1, name, icon: '🐾' });
      save(); toast('分类已新增'); render(); return;
    }
    if (act === 'cat-del') {
      const id = +el.dataset.id;
      if (DB.posts.some(p => +p.categoryId === id)) { toast('该分类下已有内容，无法删除', 'err'); return; }
      DB.categories = DB.categories.filter(c => c.id !== id); save(); toast('已删除'); render(); return;
    }
    if (act === 'edit-demo') { toast('原型演示：审核中的内容暂不支持编辑', 'info'); return; }
  });

  document.addEventListener('change', function (e) {
    const el = e.target;
    if (el.dataset && el.dataset.upload === 'image') {
      const files = Array.from(el.files || []).slice(0, 3 - draftImages.length);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        readImage(file, data => {
          if (data) { draftImages.push(data); renderUpload(); toast('照片已添加'); }
          else toast('图片读取失败，请换一张试试', 'err');
        });
      });
      el.value = '';
      return;
    }
    if (el.dataset && el.dataset.upload === 'video') {
      draftVideoName = el.files && el.files[0] ? el.files[0].name : '';
      const n = document.getElementById('videoName');
      if (n) n.textContent = draftVideoName || '未选择';
      return;
    }
    if (el.dataset && el.dataset.act === 'role') {
      const u = DB.users.find(x => x.id === +el.dataset.id);
      if (u) { u.role = el.checked ? 1 : 0; save(); toast('角色已更新'); render(); }
      return;
    }
    if (el.dataset && el.dataset.act === 'status') {
      const u = DB.users.find(x => x.id === +el.dataset.id);
      if (u) { u.status = el.checked ? 1 : 0; save(); toast(el.checked ? '账号已启用' : '账号已禁用', 'info'); render(); }
      return;
    }
    if (el.name === 'petState') {
      document.querySelectorAll('.seg-card').forEach(c => c.classList.toggle('checked', c.contains(el)));
    }
  });

  document.addEventListener('input', function (e) {
    const el = e.target;
    if (!el.closest || !el.closest('[data-form="publish"]')) return;
    const set = (id, val) => { const n = document.getElementById(id); if (n) n.textContent = val; };
    if (el.name === 'title') set('pvTitle', el.value || '标题');
    if (el.name === 'address') set('pvAddr', el.value || '填写地点');
    if (el.name === 'features') set('pvDesc', el.value || '填写宠物特征后，这里会实时显示预览效果。');
    if (el.name === 'time') set('pvTime', el.value ? fmt(el.value) : '待填写');
  });

  document.addEventListener('submit', function (e) {
    const form = e.target;
    const type = form.dataset.form;
    if (!type) return;
    e.preventDefault();

    if (type === 'search') {
      const kw = form.kw.value.trim(), ch = form.channel.value;
      location.hash = `#/${ch}${kw ? '?kw=' + encodeURIComponent(kw) : ''}`;
      return;
    }

    if (type === 'login') {
      const username = form.username.value.trim(), password = form.password.value;
      const u = DB.users.find(x => (x.username === username || x.phone === username) && x.password === password);
      if (!u) { toast('账号或密码不正确', 'err'); return; }
      if (u.status === 0) { toast('该账号已被禁用，请联系管理员', 'err'); return; }
      DB.session = u.id; save(); closeModal(); toast('欢迎回来，' + u.nickname); render(); return;
    }

    if (type === 'register') {
      const username = form.username.value.trim();
      if (DB.users.some(u => u.username === username)) { toast('该账号已被注册', 'err'); return; }
      const u = {
        id: Math.max(0, ...DB.users.map(x => x.id)) + 1,
        username, password: form.password.value, nickname: form.nickname.value.trim() || username,
        userType: +form.userType.value, role: 0, status: 1,
        phone: form.phone.value.trim(), wechat: ''
      };
      DB.users.push(u); DB.session = u.id; save(); closeModal(); toast('注册成功，欢迎加入'); render(); return;
    }

    if (type === 'setting') {
      const u = me(); if (!u) return;
      u.nickname = form.nickname.value.trim() || u.nickname;
      u.phone = form.phone.value.trim();
      u.wechat = form.wechat.value.trim();
      u.userType = +form.userType.value;
      if (form.password.value) {
        if (form.password.value.length < 6) { toast('密码至少 6 位', 'err'); return; }
        u.password = form.password.value;
      }
      save(); toast('个人信息已保存'); render(); return;
    }

    if (type === 'publish') {
      const ch = form.dataset.channel;
      if (!form.reportValidity()) { toast('请先补全带 * 的必填项', 'info'); return; }
      const fd = new FormData(form);
      const get = k => (fd.get(k) || '').toString().trim();
      const timeVal = get('time') ? get('time').replace('T', ' ') : '';
      const post = {
        id: nextId(ch), channel: ch, userId: me().id, userName: me().nickname,
        categoryId: +get('categoryId'), title: get('title'), breed: get('breed'),
        gender: +get('gender') || 0, color: get('color'), features: get('features'),
        time: timeVal, address: get('address'),
        lng: get('lng') ? +get('lng') : null, lat: get('lat') ? +get('lat') : null,
        images: draftImages.slice(), video: draftVideoName,
        contactName: get('contactName'), contactPhone: get('contactPhone'), contactWechat: get('contactWechat'),
        status: me().role === 1 ? 1 : 0, auditRemark: '', viewCount: 0,
        createTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      if (ch === 'lost' || ch === 'adopt') post.petName = get('petName');
      if (ch === 'adopt') {
        post.age = get('age'); post.healthStatus = get('healthStatus');
        post.sterilized = +get('sterilized') || 0; post.vaccinated = +get('vaccinated') || 0;
        post.reason = get('reason');
      }
      if (ch === 'found') post.petState = +get('petState') || 1;
      DB.posts.unshift(post); save();
      toast(me().role === 1 ? '发布成功，已直接上线' : '提交成功，等待管理员审核');
      location.hash = '#/me';
      return;
    }
  });

  function currentDetailPost() {
    const { path } = parseHash();
    const seg = path.split('/').filter(Boolean);
    if (seg[0] === 'detail') return DB.posts.find(x => x.channel === seg[1] && x.id === +seg[2]);
    return DB.posts.find(x => x.channel === seg[0] && x.id === +seg[2]);
  }

  function init() {
    if (!location.hash) { location.hash = '#/'; return; }
    route();
  }
  window.addEventListener('hashchange', route);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
