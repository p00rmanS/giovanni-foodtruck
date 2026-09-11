import '../css/style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import QRCode from 'qrcode'
import menuData from '../data/menu.json'

gsap.registerPlugin(ScrollTrigger)

// Respect prefers-reduced-motion: the CSS media query in style.css handles CSS
// transitions/keyframes, but GSAP animates via inline styles, so it needs its
// own opt-out. Speeding the global timeline way up keeps every tween's end
// state (opacity, layout, etc.) correct while making the motion imperceptible.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(50)
}

/* ---------------- Menu rendering (single source of truth: src/data/menu.json) ---------------- */
const MENU_ICONS = {
  chili: '<path d="M8.7 5c2.6-1.9 5-1 5.2.9.1 1-.5 1.7-1.3 2.2" /><path d="M7.2 7.3c-2.5 1.5-3.5 4.8-2.6 8 1 3.2 3.9 5.4 6.7 5 3.4-.6 5.6-4.2 4.7-8-.7-3.4-4.1-6.3-7-6-.6.1-1.2.3-1.8.6Z" />',
  lemon: '<circle cx="12" cy="13" r="7" /><path d="M8.3 10c1.3 1.3 1.3 5.7 0 7M15.7 10c-1.3 1.3-1.3 5.7 0 7" /><path d="M12 6c.5-1.9 2.3-2.9 4.1-2.5-.4 1.9-2.2 3-4.1 2.5Z" />',
  hotdog: '<path d="M3.5 15c0-2.2 1.8-4 4-4h9c2.2 0 4 1.8 4 4s-1.8 4-4 4h-9c-2.2 0-4-1.8-4-4Z" /><path d="M5.2 13c1 1.3 2 1.3 3 0s2-1.3 3 0 2 1.3 3 0 2-1.3 3 0" />',
}
const MENU_BADGE_COLORS = {
  shrimp: 'bg-shrimp-100 text-shrimp-600',
  red: 'bg-red-100 text-red-600',
  lagoon: 'bg-lagoon-100 text-lagoon-600',
  sun: 'bg-sun-100 text-sun-600',
}
const MENU_ICON_BG = {
  red: 'bg-red-100 text-red-500',
  lagoon: 'bg-sun-100 text-sun-600',
  sun: 'bg-shrimp-100 text-shrimp-600',
}

function pick(field, lang) {
  return field[lang] || field.en
}

function renderMenu(lang) {
  const grid = document.getElementById('menu-grid')
  const extras = document.getElementById('menu-extras')
  if (!grid || !extras) return

  grid.innerHTML = menuData.items
    .map((item, i) => {
      const media = item.image
        ? `<div class="h-32 overflow-hidden"><img src="${item.image}" alt="${pick(item.name, lang)}" class="w-full h-full object-cover" /></div>`
        : `<div class="h-11 w-11 rounded-2xl ${MENU_ICON_BG[item.badgeColor] || ''} flex items-center justify-center mb-4">
             <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${MENU_ICONS[item.icon] || ''}</svg>
           </div>`
      const padded = item.image ? `<div class="p-6 flex flex-col flex-1">` : ''
      const paddedClose = item.image ? `</div>` : ''
      return `
        <div class="menu-card bg-[#fffaf2] rounded-3xl ${item.image ? 'overflow-hidden' : 'p-6'} flex flex-col shadow-xl" data-delay="${i * 100}">
          ${media}
          ${padded}
          <h3 class="font-heading font-extrabold text-lg mb-2">${pick(item.name, lang)}</h3>
          <p class="text-ink/60 text-sm flex-1 mb-4">${pick(item.description, lang)}</p>
          <div class="flex items-center justify-between">
            <span class="font-display text-shrimp-500 text-2xl">${item.price}</span>
            <span class="text-xs font-semibold ${MENU_BADGE_COLORS[item.badgeColor] || ''} px-3 py-1 rounded-full">${pick(item.badge, lang)}</span>
          </div>
          ${paddedClose}
        </div>`
    })
    .join('')

  extras.innerHTML = `
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-white/80">
      <h4 class="font-heading font-bold text-sun-400 mb-3">${pick(menuData.sidesHeading, lang)}</h4>
      <ul class="text-sm space-y-1.5">
        ${menuData.sides.map((s) => `<li class="flex justify-between"><span>${pick(s.name, lang)}</span><span class="font-semibold">${s.price}</span></li>`).join('')}
      </ul>
    </div>
    <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-white/80">
      <h4 class="font-heading font-bold text-sun-400 mb-3">${pick(menuData.drinksHeading, lang)}</h4>
      <p class="text-sm">${pick(menuData.drinksList, lang)}</p>
    </div>
    <div class="bg-shrimp-500/15 border border-shrimp-500/30 rounded-2xl p-6 text-white">
      <h4 class="font-heading font-bold mb-3">${pick(menuData.partyHeading, lang)}</h4>
      <p class="text-sm text-white/80 mb-3">${pick(menuData.partyBody, lang)}</p>
      <a href="tel:+18082931839" class="font-heading font-bold text-shrimp-400 hover:text-shrimp-300">(808) 293-1839</a>
    </div>`
}

renderMenu('en')

/* ---------------- Keep ScrollTrigger in sync with late-loading fonts/images ---------------- */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh())
}
window.addEventListener('load', () => ScrollTrigger.refresh())
document.querySelectorAll('img').forEach((img) => {
  if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

/* ---------------- Loader ---------------- */
let loaderHidden = false
function hideLoader() {
  if (loaderHidden) return
  loaderHidden = true
  const loader = document.getElementById('loader')
  if (!loader) return
  loader.style.transition = 'opacity 0.5s ease'
  loader.style.pointerEvents = 'none'
  loader.style.opacity = '0'
  setTimeout(() => {
    loader.style.display = 'none'
  }, 550)
  playHeroIntro()
}
if (document.readyState === 'complete') {
  setTimeout(hideLoader, 300)
} else {
  window.addEventListener('load', () => setTimeout(hideLoader, 300), { once: true })
}
// Hard fallback in case 'load' is delayed or never fires cleanly
setTimeout(hideLoader, 2500)

/* ---------------- Hero intro timeline ---------------- */
function playHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(
    '.hero-in',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }
  )
}

/* ---------------- Sticky nav ---------------- */
const nav = document.getElementById('site-nav')
ScrollTrigger.create({
  start: 'top -80',
  end: 99999,
  toggleClass: { targets: nav, className: 'nav-scrolled' },
})

/* ---------------- Mobile menu ---------------- */
const toggleBtn = document.getElementById('menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')
let mobileOpen = false
if (toggleBtn && mobileMenu) {
  toggleBtn.addEventListener('click', () => {
    mobileOpen = !mobileOpen
    mobileMenu.style.maxHeight = mobileOpen ? mobileMenu.scrollHeight + 'px' : '0px'
  })
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileOpen = false
      mobileMenu.style.maxHeight = '0px'
    })
  })
}

/* ---------------- Scroll reveal ---------------- */
document.querySelectorAll('.reveal').forEach((el) => {
  const delay = Number(el.dataset.delay || 0)
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      setTimeout(() => el.classList.add('is-visible'), delay)
    },
  })
})

/* ---------------- Timeline line + dots ---------------- */
const timelineLine = document.querySelector('.timeline-line')
if (timelineLine) {
  ScrollTrigger.create({
    trigger: timelineLine.parentElement,
    start: 'top 70%',
    once: true,
    onEnter: () => timelineLine.classList.add('is-visible'),
  })
}

/* ---------------- Counters (supports decimals) ---------------- */
document.querySelectorAll('[data-counter]').forEach((el) => {
  const target = Number(el.dataset.counter)
  const decimals = Number(el.dataset.decimals || 0)
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toLocaleString()
        },
      })
    },
  })
})

/* ---------------- Hero blob parallax (mouse) ---------------- */
const hero = document.getElementById('top')
const parallaxEls = document.querySelectorAll('[data-parallax]')
if (hero && window.matchMedia('(pointer: fine)').matches) {
  const setters = Array.from(parallaxEls).map((el) => ({
    x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    strength: Number(el.dataset.parallax || 0.5),
  }))
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width - 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5
    setters.forEach((s) => {
      s.x(relX * 60 * s.strength)
      s.y(relY * 60 * s.strength)
    })
  })
}

/* ---------------- Menu / location / review card stagger ---------------- */
gsap.utils.toArray('.menu-card').forEach((card, i) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        card,
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay: (i % 4) * 0.08 }
      )
    },
  })
})

/* ---------------- Gallery lightbox ---------------- */
const galleryLightbox = document.getElementById('gallery-lightbox')
if (galleryLightbox) {
  const lightboxImg = document.getElementById('gallery-lightbox-img')
  const lightboxCaption = document.getElementById('gallery-lightbox-caption')

  function openLightbox(item) {
    lightboxImg.src = item.dataset.full
    lightboxImg.alt = item.querySelector('img')?.alt || ''
    lightboxCaption.textContent = item.dataset.caption || ''
    galleryLightbox.classList.remove('hidden')
    gsap.fromTo(galleryLightbox, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(lightboxImg, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' })
    document.body.style.overflow = 'hidden'
  }

  function closeLightbox() {
    gsap.to(galleryLightbox, { opacity: 0, duration: 0.2 })
    setTimeout(() => {
      galleryLightbox.classList.add('hidden')
      document.body.style.overflow = ''
    }, 220)
  }

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => openLightbox(item))
  })
  document.getElementById('gallery-lightbox-close').addEventListener('click', closeLightbox)
  document.getElementById('gallery-lightbox-backdrop').addEventListener('click', closeLightbox)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !galleryLightbox.classList.contains('hidden')) closeLightbox()
  })
}

/* ---------------- Highlight card popup ---------------- */
const highlightModal = document.getElementById('highlight-modal')
if (highlightModal) {
  const modalCard = document.getElementById('highlight-modal-card')
  const modalPlatform = document.getElementById('highlight-modal-platform')
  const modalBody = document.getElementById('highlight-modal-body')
  const modalLink = document.getElementById('highlight-modal-link')

  function openHighlightModal(trigger) {
    modalPlatform.textContent = trigger.dataset.platform
    modalBody.innerHTML = trigger.dataset.body
    modalBody.classList.toggle('italic', trigger.dataset.quote === 'true')
    modalLink.href = trigger.dataset.link
    modalLink.textContent = `See It On ${trigger.dataset.platform}`
    highlightModal.classList.remove('hidden')
    gsap.fromTo(highlightModal, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    gsap.fromTo(modalCard, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' })
    document.body.style.overflow = 'hidden'
  }

  function closeHighlightModal() {
    gsap.to(highlightModal, { opacity: 0, duration: 0.2 })
    // Timeout, not the tween's onComplete: onComplete can stall indefinitely
    // if the tab is backgrounded, which would leave the modal stuck open.
    setTimeout(() => {
      highlightModal.classList.add('hidden')
      document.body.style.overflow = ''
    }, 220)
  }

  document.querySelectorAll('.highlight-card').forEach((card) => {
    card.addEventListener('click', () => openHighlightModal(card))
  })
  document.getElementById('highlight-modal-close').addEventListener('click', closeHighlightModal)
  document.getElementById('highlight-modal-backdrop').addEventListener('click', closeHighlightModal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !highlightModal.classList.contains('hidden')) closeHighlightModal()
  })
}

/* ---------------- Instagram tile stagger ---------------- */
gsap.utils.toArray('.ig-tile').forEach((tile, i) => {
  ScrollTrigger.create({
    trigger: tile,
    start: 'top 95%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        tile,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)', delay: i * 0.05 }
      )
    },
  })
})

/* ---------------- Live date + Hawaii clock ---------------- */
const dateEl = document.getElementById('live-date')
function updateClock() {
  if (!dateEl) return
  const now = new Date()
  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Pacific/Honolulu',
  }).format(now)
  dateEl.textContent = `${formatted} HST`
}
updateClock()
setInterval(updateClock, 30000)

/* ---------------- Live open/closed status per location ---------------- */
function updateLocationStatus() {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Pacific/Honolulu',
  }).formatToParts(new Date())
  const hstHour = Number(parts.find((p) => p.type === 'hour').value)
  const hstMinute = Number(parts.find((p) => p.type === 'minute').value)
  const nowMinutes = hstHour * 60 + hstMinute

  const baseClass = 'live-status shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full'
  document.querySelectorAll('.live-status').forEach((el) => {
    const [openH, openM] = el.dataset.open.split(':').map(Number)
    const [closeH, closeM] = el.dataset.close.split(':').map(Number)
    const isOpen = nowMinutes >= openH * 60 + openM && nowMinutes < closeH * 60 + closeM
    el.innerHTML = isOpen
      ? '<span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-soft"></span>Open Now'
      : '<span class="h-1.5 w-1.5 rounded-full bg-ink/30"></span>Closed'
    el.className = `${baseClass} ${isOpen ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink/50'}`
  })
}
updateLocationStatus()
setInterval(updateLocationStatus, 60000)

/* ---------------- Weather (Open-Meteo, keyless): Kahuku, O'ahu ---------------- */
const weatherTemp = document.getElementById('weather-temp')
const weatherIcon = document.getElementById('weather-icon')
// Inner SVG markup only. The wrapping <svg> tag/attrs stay fixed in the HTML; this maps to WMO weather codes.
const SUN_ICON = '<circle cx="12" cy="12" r="4.2" /><path stroke-linecap="round" d="M12 3v2.2M12 18.8V21M4.2 12H2M22 12h-2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />'
const CLOUD_ICON = '<path stroke-linecap="round" stroke-linejoin="round" d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5 4 4 0 0 1 17 18H7Z" />'
const PARTLY_CLOUDY_ICON = '<path stroke-linecap="round" d="M6 8.2V6.6M6 8.2l-1.3-1.1M6 8.2l1.3-1.1" /><path stroke-linecap="round" stroke-linejoin="round" d="M10 19a3.6 3.6 0 0 1-.4-7.18A5 5 0 0 1 19 13.5 3.6 3.6 0 0 1 19 19h-9Z" />'
const RAIN_ICON = '<path stroke-linecap="round" stroke-linejoin="round" d="M7 15.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9 4 4 0 0 1 17 15.5H7Z" /><path stroke-linecap="round" d="M8.5 18.5l-1 2M12 18.5l-1 2M15.5 18.5l-1 2" />'
const STORM_ICON = '<path stroke-linecap="round" stroke-linejoin="round" d="M7 14.5a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8 4 4 0 0 1 17 14.5H7Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 15l-2.5 4h2.5l-1.5 3.5" />'
const FOG_ICON = '<path stroke-linecap="round" d="M4 9h16M3 13h18M4 17h12" />'
const WEATHER_ICONS = {
  0: SUN_ICON, 1: SUN_ICON, 2: PARTLY_CLOUDY_ICON, 3: CLOUD_ICON,
  45: FOG_ICON, 48: FOG_ICON,
  51: RAIN_ICON, 53: RAIN_ICON, 55: RAIN_ICON,
  61: RAIN_ICON, 63: RAIN_ICON, 65: RAIN_ICON,
  80: RAIN_ICON, 81: RAIN_ICON, 82: STORM_ICON,
  95: STORM_ICON,
}
fetch('https://api.open-meteo.com/v1/forecast?latitude=21.68&longitude=-157.95&current=temperature_2m,weather_code&temperature_unit=fahrenheit')
  .then((res) => res.json())
  .then((data) => {
    const temp = Math.round(data?.current?.temperature_2m)
    const code = data?.current?.weather_code
    if (!Number.isNaN(temp) && weatherTemp) {
      weatherTemp.textContent = `Kahuku ${temp}°F`
    }
    if (weatherIcon && WEATHER_ICONS[code]) {
      weatherIcon.innerHTML = WEATHER_ICONS[code]
    }
  })
  .catch(() => {
    if (weatherTemp) weatherTemp.textContent = 'Kahuku 82°F'
  })

/* ---------------- Language switcher (i18n) ---------------- */
const I18N = {
  en: { flag: 'us', label: 'English' },
  es: { flag: 'es', label: 'Español' },
  vi: { flag: 'vn', label: 'Tiếng Việt' },
  'zh-CN': { flag: 'cn', label: '中文' },
  yue: { flag: 'hk', label: '廣東話' },
  ja: { flag: 'jp', label: '日本語' },
  ko: { flag: 'kr', label: '한국어' },
  de: { flag: 'de', label: 'Deutsch' },
  fr: { flag: 'fr', label: 'Français' },
  tl: { flag: 'ph', label: 'Tagalog' },
}

const STRINGS = {
  nav_menu: { en: 'Menu', es: 'Menú', vi: 'Thực Đơn', 'zh-CN': '菜单', yue: '餐牌', de: 'Speisekarte', ko: '메뉴', ja: 'メニュー', tl: 'Menu', fr: 'Menu' },
  nav_story: { en: 'Our Story', es: 'Nuestra Historia', vi: 'Câu Chuyện', 'zh-CN': '我们的故事', yue: '我哋嘅故事', de: 'Unsere Geschichte', ko: '우리 이야기', ja: '私たちの物語', tl: 'Aming Kwento', fr: 'Notre Histoire' },
  nav_history: { en: 'History', es: 'Historia', vi: 'Lịch Sử', 'zh-CN': '历史', yue: '歷史', de: 'Geschichte', ko: '역사', ja: '歴史', tl: 'Kasaysayan', fr: 'Histoire' },
  nav_locations: { en: 'Locations', es: 'Ubicaciones', vi: 'Địa Điểm', 'zh-CN': '地点', yue: '地點', de: 'Standorte', ko: '위치', ja: '店舗情報', tl: 'Mga Lokasyon', fr: 'Emplacements' },
  nav_press: { en: 'Press', es: 'Prensa', vi: 'Báo Chí', 'zh-CN': '媒体报道', yue: '媒體報導', de: 'Presse', ko: '언론 보도', ja: 'メディア掲載', tl: 'Balita', fr: 'Presse' },
  nav_cta: { en: 'Find a Truck', es: 'Encuentra un Camión', vi: 'Tìm Xe Bán Tôm', 'zh-CN': '寻找餐车', yue: '搵餐車', de: 'Truck Finden', ko: '트럭 찾기', ja: 'トラックを探す', tl: 'Hanapin Ang Truck', fr: 'Trouver Un Camion' },
  hero_badge: { en: "North Shore, O'ahu · Est. 1993", es: "North Shore, O'ahu · Desde 1993", vi: "North Shore, O'ahu · Từ Năm 1993", 'zh-CN': '北岸，瓦胡岛 · 始于1993年', yue: '北岸，瓦胡島 · 1993年開業', de: "North Shore, O'ahu · Seit 1993", ko: '노스쇼어, 오아후 · 1993년부터', ja: 'ノースショア、オアフ島・1993年創業', tl: "North Shore, O'ahu · Mula 1993", fr: "North Shore, O'ahu · Depuis 1993" },
  hero_sub: {
    en: 'A dozen jumbo shrimp, fresh garlic, and two scoops of rice, cooked truckside on O’ahu’s North Shore since 1993.',
    es: 'Una docena de camarones jumbo, ajo fresco y dos porciones de arroz, cocinados al momento en el North Shore de O’ahu desde 1993.',
    vi: 'Một tá tôm jumbo, tỏi tươi và hai phần cơm, chế biến ngay tại xe từ năm 1993 ở North Shore, O’ahu.',
    'zh-CN': '一打特大虾、新鲜大蒜和两份米饭。自1993年起在瓦胡岛北岸现场烹制。',
    yue: '一打大蝦、新鮮蒜蓉同兩份米飯。1993年起喺瓦胡島北岸即叫即煮。',
    de: 'Ein Dutzend Riesengarnelen, frischer Knoblauch und zwei Portionen Reis, seit 1993 direkt am Truck zubereitet, North Shore O’ahu.',
    ko: '점보 새우 12마리, 신선한 마늘, 밥 두 스쿱. 1993년부터 오아후 노스쇼어에서 트럭 즉석 조리.',
    ja: 'ジャンボシュリンプ12尾、新鮮なガーリック、ライス2スクープ。1993年からオアフ島ノースショアでトラック調理。',
    tl: 'Isang dosenang jumbo shrimp, sariwang bawang, at dalawang kutsara ng kanin, niluluto sa truck simula 1993 sa North Shore ng O’ahu.',
    fr: 'Une douzaine de crevettes géantes, de l’ail frais et deux portions de riz, cuisinés sur le camion depuis 1993 sur la North Shore d’O’ahu.',
  },
  hero_cta1: { en: 'View The Menu', es: 'Ver El Menú', vi: 'Xem Thực Đơn', 'zh-CN': '查看菜单', yue: '睇餐牌', de: 'Speisekarte Ansehen', ko: '메뉴 보기', ja: 'メニューを見る', tl: 'Tingnan Ang Menu', fr: 'Voir Le Menu' },
  hero_cta2: { en: 'Truck Locations', es: 'Ubicaciones del Camión', vi: 'Địa Điểm Xe Tôm', 'zh-CN': '餐车地点', yue: '餐車地點', de: 'Standorte', ko: '트럭 위치', ja: 'トラックの場所', tl: 'Mga Lokasyon Ng Truck', fr: 'Emplacements Des Camions' },
  eyebrow_story: { en: 'Our Story', es: 'Nuestra Historia', vi: 'Câu Chuyện Của Chúng Tôi', 'zh-CN': '我们的故事', yue: '我哋嘅故事', de: 'Unsere Geschichte', ko: '우리 이야기', ja: '私たちの物語', tl: 'Aming Kwento', fr: 'Notre Histoire' },
  eyebrow_menu: { en: 'The Menu', es: 'El Menú', vi: 'Thực Đơn', 'zh-CN': '菜单', yue: '餐牌', de: 'Speisekarte', ko: '메뉴', ja: 'メニュー', tl: 'Ang Menu', fr: 'Le Menu' },
  eyebrow_history: { en: 'Our History', es: 'Nuestra Historia', vi: 'Lịch Sử', 'zh-CN': '我们的历史', yue: '我哋嘅歷史', de: 'Unsere Geschichte', ko: '우리의 역사', ja: '私たちの歴史', tl: 'Aming Kasaysayan', fr: 'Notre Histoire' },
  eyebrow_locations: { en: 'Find The Truck', es: 'Encuentra El Camión', vi: 'Tìm Xe Bán Tôm', 'zh-CN': '寻找餐车', yue: '搵餐車', de: 'Truck Finden', ko: '트럭 찾기', ja: 'トラックを探す', tl: 'Hanapin Ang Truck', fr: 'Trouver Le Camion' },
  eyebrow_press: { en: 'As Seen In', es: 'En Los Medios', vi: 'Được Nhắc Đến', 'zh-CN': '媒体报道', yue: '媒體報導', de: 'In Den Medien', ko: '언론 보도', ja: 'メディア掲載', tl: 'Napabalita', fr: 'Dans Les Médias' },
  eyebrow_reviews: { en: 'Real Guest Reviews', es: 'Reseñas De Clientes', vi: 'Đánh Giá Thực Tế', 'zh-CN': '真实顾客评价', yue: '真實顧客評價', de: 'Echte Kundenbewertungen', ko: '실제 고객 리뷰', ja: 'お客様の声', tl: 'Tunay Na Review Ng Customer', fr: 'Avis Clients Vérifiés' },
  cta_hungry: { en: 'HUNGRY YET?', es: '¿TIENES HAMBRE?', vi: 'ĐÓI BỤNG CHƯA?', 'zh-CN': '饿了吗？', yue: '肚餓未？', de: 'HUNGRIG?', ko: '배고프세요?', ja: 'お腹すきましたか？', tl: 'GUTOM KA NA BA?', fr: 'UNE PETITE FAIM?' },
  cta_find: { en: 'Find a Truck Near You', es: 'Encuentra Tu Camión Más Cercano', vi: 'Tìm Xe Gần Bạn Nhất', 'zh-CN': '寻找附近的餐车', yue: '搵最近嘅餐車', de: 'Nächsten Truck Finden', ko: '가까운 트럭 찾기', ja: '近くのトラックを探す', tl: 'Hanapin Ang Pinakamalapit Na Truck', fr: 'Trouver Le Camion Le Plus Proche' },
}

function applyLanguage(lang) {
  const targets = document.querySelectorAll('[data-i18n]')
  targets.forEach((el) => {
    const key = el.dataset.i18n
    const entry = STRINGS[key]
    if (entry) el.textContent = entry[lang] || entry.en
  })
  // Cosmetic fade-in only. The text swap above is immediate and does not depend on this running.
  gsap.fromTo(targets, { opacity: 0.3 }, { opacity: 1, duration: 0.35 })

  renderMenu(lang)
  const menuEls = [...document.querySelectorAll('#menu-grid .menu-card'), document.getElementById('menu-extras')]
  gsap.fromTo(menuEls, { opacity: 0.3 }, { opacity: 1, duration: 0.35 })

  const info = I18N[lang] || I18N.en
  const flagEl = document.getElementById('lang-flag')
  const labelEl = document.getElementById('lang-label')
  if (flagEl) flagEl.src = `/assets/flags/${info.flag}.svg`
  if (labelEl) labelEl.textContent = info.label
  try {
    localStorage.setItem('giovannis_lang', lang)
  } catch (e) {
    /* private browsing / storage blocked */
  }
}

const langToggle = document.getElementById('lang-toggle')
const langMenu = document.getElementById('lang-menu')
if (langToggle && langMenu) {
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = !langMenu.classList.contains('hidden')
    langMenu.classList.toggle('hidden')
    langToggle.setAttribute('aria-expanded', String(!isOpen))
  })
  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang)
      langMenu.classList.add('hidden')
    })
  })
  document.addEventListener('click', (e) => {
    if (!langMenu.contains(e.target) && e.target !== langToggle) {
      langMenu.classList.add('hidden')
    }
  })

  let savedLang = 'en'
  try {
    savedLang = localStorage.getItem('giovannis_lang') || 'en'
  } catch (e) {
    /* ignore */
  }
  if (savedLang !== 'en') applyLanguage(savedLang)
}

/* ---------------- Printable menu QR ---------------- */
const qrCanvas = document.getElementById('menu-qr')
if (qrCanvas) {
  const menuUrl = `${window.location.origin}${window.location.pathname}#menu`
  QRCode.toCanvas(qrCanvas, menuUrl, { width: 180, margin: 1, color: { dark: '#1a1410', light: '#fffaf2' } }, (err) => {
    if (err) console.error('QR generation failed:', err)
  })
}

const printBtn = document.getElementById('print-qr-btn')
if (printBtn) {
  printBtn.addEventListener('click', () => {
    document.body.classList.add('printing-qr')
    window.print()
  })
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-qr')
  })
}

/* ---------------- Party platter request -> prefilled SMS ---------------- */
const partyForm = document.getElementById('party-form')
if (partyForm) {
  const statusEl = document.getElementById('party-form-status')
  partyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(partyForm)
    const name = data.get('name').trim()
    const date = data.get('date')
    const headcount = data.get('headcount')
    const phone = data.get('phone').trim()

    const dateFormatted = date
      ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'a date TBD'
    const body = `Hi! This is ${name}. I'd like a party platter quote for ${headcount} guests on ${dateFormatted}.${phone ? ` Callback number: ${phone}.` : ''}`

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const separator = isIOS ? '&' : '?'
    const smsLink = `sms:+18082931839${separator}body=${encodeURIComponent(body)}`

    statusEl.textContent = 'Opening your messages app with the request filled in...'
    statusEl.classList.remove('hidden')
    gsap.fromTo(statusEl, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35 })
    window.location.href = smsLink
  })
}

/* ---------------- Text alert signup (preview only, not wired to a real SMS service) ---------------- */
const alertForm = document.getElementById('alert-form')
if (alertForm) {
  const statusEl = document.getElementById('alert-form-status')
  alertForm.addEventListener('submit', (e) => {
    e.preventDefault()
    statusEl.textContent = 'Saved for this demo. Wire this up to a texting service before launch to send real alerts.'
    statusEl.classList.remove('hidden')
    gsap.fromTo(statusEl, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35 })
    alertForm.reset()
  })
}
