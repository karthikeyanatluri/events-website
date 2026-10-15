// @ts-nocheck
import { getDepartmentEvents, resolveDepartmentId, getDepartmentInfo, validateEventData, type CanonicalEvent } from "./data/eventsData";
import { useEffect } from "react";
import { schoolBySlug, schoolForDepartment } from "./pages/EventsPage/schools";
import "./MidwayNights.scss";

type ScriptWindow = Window & { __midwayNightsCleanup?: () => void };

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-midway-dependency="${src}"]`);
    if (existing?.dataset.loaded === "true") { resolve(); return; }
    const script = existing ?? document.createElement("script");
    const onLoad = () => { script.dataset.loaded = "true"; resolve(); };
    const onError = () => reject(new Error(`Failed to load ${src}`));
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.src = src;
      script.async = false;
      script.dataset.midwayDependency = src;
      document.head.appendChild(script);
    }
  });
}

export default function MidwayNights() {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const rawTent = (params.get('tent') || params.get('department') || '').trim();
  const tentKey = rawTent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const deptInfo = tentKey ? getDepartmentInfo(tentKey) : null;
  const tentDisplayName = deptInfo ? deptInfo.id : (rawTent ? rawTent.toUpperCase() : 'SUPRAGNA');
  const tentTitle = tentDisplayName;
  const deptFullName = deptInfo?.name || '';

  // Resolve the particular school selected by the user
  const explicitSchoolSlug = params.get('school');
  const resolvedSchool = (explicitSchoolSlug ? schoolBySlug(explicitSchoolSlug) : null)
    || schoolForDepartment(tentKey)
    || schoolForDepartment(deptInfo?.id || '')
    || schoolBySlug('engineering');
  const schoolSlug = resolvedSchool?.slug || 'engineering';
  const schoolReturnPath = `/events/${schoolSlug}`;

  useEffect(() => {
    let cancelled = false;
    const win = window as ScriptWindow;

    const start = async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");
        if (cancelled) return;
        initializeMidwayNights();
      } catch (error) {
        console.error("Events could not initialize its animation libraries.", error);
      }
    };

    start();
    return () => {
      cancelled = true;
      win.__midwayNightsCleanup?.();
    };
  }, []);

  return (
    <div className="midway-nights-page">
            <header className="nav">
        <a className="brand" href={schoolReturnPath} onClick={(e) => { e.preventDefault(); window.location.assign(schoolReturnPath); }} title="Back to School Department Tents">
          <span className="bulb" aria-hidden="true"></span>Events
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#about" className="nav-link" id="navAbout">About Us</a>
          <a href="#contact" className="nav-link" id="navContact">Contact Us</a>
        </nav>
      </header>

      <main id="top">
        <section id="showcase" className="showcase" aria-label="Event showcase">
          <canvas id="gl" aria-hidden="true"></canvas>
          <div className="shade" aria-hidden="true"></div>
          <div className="hero" id="hero">
            <p className="kicker" id="heroKicker">SUPRAGNA 2K27</p>
            <h1 id="heroTitle">{tentTitle}</h1>
            {deptFullName && <p className="dept-sub" id="heroSub">{deptFullName}</p>}
            <p className="cue">Scroll to board the ride <span className="chev" aria-hidden="true"></span></p>
          </div>
          <div className="cards" id="cards"></div>
          <nav className="hud" id="hud" aria-label="Ride stops">
            <p className="now"><span className="now-n" id="nowN"></span><span className="now-t" id="nowT"></span></p>
            <div className="track"><span className="fill" id="fill"></span><ol className="stops" id="stops"></ol></div>
            <a className="btn primary small" id="rideReturn" href={schoolReturnPath} onClick={(e) => { e.preventDefault(); window.location.assign(schoolReturnPath); }}>Back to Events</a>
          </nav>
          <p className="sr" id="live" aria-live="polite"></p>
        </section>


      </main>

      <dialog id="sheet" className="sheet" aria-labelledby="sheetTitle">
        <div className="sheet-card">
          <img id="sheetImg" alt="" />
          <div className="sheet-body">
            <p className="chip" id="sheetCat"></p>
            <h2 id="sheetTitle"></h2>
            <dl className="meta" id="sheetMeta"></dl>
            <p id="sheetText"></p>
            <div className="actions">
              <button className="btn primary" id="sheetClose" type="button">Close</button>
            </div>
          </div>
        </div>
      </dialog>
      {/* Registration Modal Dialog */}
      <dialog id="register" className="sheet info-sheet" aria-labelledby="regModalTitle">
        <div className="sheet-card">
          <div className="sheet-body">
            <p className="chip">SUPRAGNA 2K27 • Registration</p>
            <h2 id="regModalTitle">Register for SUPRAGNA 2K27</h2>
            <p className="sheet-sub">
              Secure your spot for departmental hackathons, technical challenges, and live carnival attractions.
            </p>
            <form id="regForm" className="sheet-form">
              <div className="form-group">
                <label htmlFor="regName">Full Name</label>
                <input type="text" id="regName" placeholder="e.g. Alex Morgan" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="regEmail">Email Address</label>
                  <input type="email" id="regEmail" placeholder="alex@university.edu" required />
                </div>
                <div className="form-group">
                  <label htmlFor="regDept">Select Department</label>
                  <select id="regDept">
                    <option value="ALL">All-Access Carnival Pass</option>
                    <option value="AI">AI &amp; Machine Learning</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="CSE">Computer Science &amp; Engineering</option>
                    <option value="ECE">Electronics &amp; Communication</option>
                    <option value="EEE">Electrical &amp; Electronics</option>
                    <option value="EIE">Electronics &amp; Instrumentation</option>
                    <option value="MECHANICAL">Mechanical Engineering</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="regPassType">Pass Type</label>
                <select id="regPassType">
                  <option value="single">Single Event Entry — Free / Nominal</option>
                  <option value="carnival">All-Access Carnival Wristband — ₹499</option>
                  <option value="hackathon">Hackathon &amp; Tech Dual Pass — ₹299</option>
                </select>
              </div>
              <div className="actions">
                <button className="btn primary" type="submit" id="regSubmit">Confirm Registration</button>
                <button className="btn ghost" type="button" id="regClose">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* About Us Modal Dialog */}
      <dialog id="about" className="sheet info-sheet" aria-labelledby="aboutModalTitle">
        <div className="sheet-card">
          <div className="sheet-body">
            <p className="chip">About The Carnival</p>
            <h2 id="aboutModalTitle">About Midway Nights</h2>
            <dl className="meta">
              <div><dt>Dates</dt><dd>6–8 Nov 2026</dd></div>
              <div><dt>Venue</dt><dd>Riverside Fairgrounds</dd></div>
              <div><dt>Arenas</dt><dd>7 Engineering Depts</dd></div>
              <div><dt>Events</dt><dd>38+ Tech &amp; Non-Tech</dd></div>
            </dl>
            <p>
              Midway Nights is our premier inter-departmental technical and cultural carnival. Illuminated by neon lights, vibrant tents, and night rides, the festival brings together students, innovators, and creators across 7 engineering disciplines for competitive hackathons, robotics challenges, laser arenas, and grand stage performances.
            </p>
            <div className="highlights-grid">
              <div className="highlight-item">
                <h3>🎢 3D Coaster Experience</h3>
                <p>Traverse departmental hubs in real-time on our interactive roller coaster showcase.</p>
              </div>
              <div className="highlight-item">
                <h3>🤖 Inter-Dept Robo-Nexus</h3>
                <p>Cross-disciplinary robotics cup uniting AI vision, CSE systems, and ECE hardware.</p>
              </div>
            </div>
            <div className="actions">
              <button className="btn primary" type="button" id="aboutExplore">Ride Coaster</button>
              <button className="btn ghost" type="button" id="aboutClose">Close</button>
            </div>
          </div>
        </div>
      </dialog>

      {/* Contact Us Modal Dialog */}
      <dialog id="contact" className="sheet info-sheet" aria-labelledby="contactModalTitle">
        <div className="sheet-card">
          <div className="sheet-body">
            <p className="chip">Support &amp; Inquiries</p>
            <h2 id="contactModalTitle">Contact Us</h2>
            <dl className="meta">
              <div><dt>Email</dt><dd>midwaynights@carnival.edu</dd></div>
              <div><dt>Helpline</dt><dd>+91 98765 43210</dd></div>
              <div><dt>Desk</dt><dd>Riverside Pavilion 4</dd></div>
              <div><dt>Hours</dt><dd>9:00 AM – 10:00 PM</dd></div>
            </dl>
            <form id="contactForm" className="sheet-form">
              <div className="form-group">
                <label htmlFor="contactName">Your Name</label>
                <input type="text" id="contactName" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Email Address</label>
                <input type="email" id="contactEmail" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="contactMsg">Message / Inquiry</label>
                <textarea id="contactMsg" rows={3} placeholder="Ask about registrations, event rules, or venue directions..." required></textarea>
              </div>
              <div className="actions">
                <button className="btn primary" type="submit" id="contactSubmit">Send Message</button>
                <button className="btn ghost" type="button" id="contactClose">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <div className="toast" id="toast" role="status"></div>
    </div>
  );
}

function initializeMidwayNights() {

  'use strict';

  /* =====================================================================
     Events: scroll-driven carnival coaster showcase
     Sections: 1 data + UI  |  2 3D carnival scene  |  3 scroll controller
     ===================================================================== */

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* The department tent page links here with ?tent=<slug>&color=<hex>.
     Palette colors intentionally follow the exact tent colors for all schools. */
  const TENT_PALETTES = {
    // School of Engineering:
    'ai': { name: 'AI', primary: '#4d2b63', secondary: '#d8c3e5', accent: '#ffd37a', deep: '#21132b', highlight: '#c39bdf' },
    'ce': { name: 'CE', primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },
    'civil': { name: 'Civil', primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },
    'cse': { name: 'CSE', primary: '#03176b', secondary: '#c5d2ff', accent: '#ffd37a', deep: '#020a32', highlight: '#8198ff' },
    'computer-science': { name: 'Computer Science', primary: '#03176b', secondary: '#c5d2ff', accent: '#ffd37a', deep: '#020a32', highlight: '#8198ff' },
    'ece': { name: 'ECE', primary: '#3b0c3c', secondary: '#e0c3e0', accent: '#ffd37a', deep: '#1b061c', highlight: '#c48ac6' },
    'electronics': { name: 'Electronics', primary: '#3b0c3c', secondary: '#e0c3e0', accent: '#ffd37a', deep: '#1b061c', highlight: '#c48ac6' },
    'eee': { name: 'EEE', primary: '#342875', secondary: '#d1cbf2', accent: '#ffd37a', deep: '#171238', highlight: '#a89ae8' },
    'electrical': { name: 'Electrical', primary: '#342875', secondary: '#d1cbf2', accent: '#ffd37a', deep: '#171238', highlight: '#a89ae8' },
    'eie': { name: 'EIE', primary: '#5a0a2e', secondary: '#edc5d6', accent: '#ffd37a', deep: '#280515', highlight: '#e28bb1' },
    'me': { name: 'ME', primary: '#1a2a6b', secondary: '#c8d4f2', accent: '#ffd37a', deep: '#0b1232', highlight: '#8ea9ed' },
    'mechanical': { name: 'Mechanical', primary: '#1a2a6b', secondary: '#c8d4f2', accent: '#ffd37a', deep: '#0b1232', highlight: '#8ea9ed' },

    // School of Science:
    'mca': { name: 'MCA', primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },
    'bsc': { name: 'BSC', primary: '#1a2a6b', secondary: '#c8d4f2', accent: '#ffd37a', deep: '#0b1232', highlight: '#8ea9ed' },

    // School of Management:
    'business-administration': { name: 'Business Administration', primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },
    'management': { name: 'Management', primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },

    // School of Arts & Commerce:
    'arts-and-commerce': { name: 'Arts & Commerce', primary: '#5a0a2e', secondary: '#edc5d6', accent: '#ffd37a', deep: '#280515', highlight: '#e28bb1' },
    'arts-commerce': { name: 'Arts & Commerce', primary: '#5a0a2e', secondary: '#edc5d6', accent: '#ffd37a', deep: '#280515', highlight: '#e28bb1' },

    // School of Law:
    'law': { name: 'Law', primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },
  };

  const COLOR_SHADE_MAP = {
    '#4d2b63': { primary: '#4d2b63', secondary: '#d8c3e5', accent: '#ffd37a', deep: '#21132b', highlight: '#c39bdf' },
    '#50041d': { primary: '#50041d', secondary: '#edc7d1', accent: '#ffd37a', deep: '#26020e', highlight: '#d77b97' },
    '#03176b': { primary: '#03176b', secondary: '#c5d2ff', accent: '#ffd37a', deep: '#020a32', highlight: '#8198ff' },
    '#3b0c3c': { primary: '#3b0c3c', secondary: '#e0c3e0', accent: '#ffd37a', deep: '#1b061c', highlight: '#c48ac6' },
    '#342875': { primary: '#342875', secondary: '#d1cbf2', accent: '#ffd37a', deep: '#171238', highlight: '#a89ae8' },
    '#5a0a2e': { primary: '#5a0a2e', secondary: '#edc5d6', accent: '#ffd37a', deep: '#280515', highlight: '#e28bb1' },
    '#1a2a6b': { primary: '#1a2a6b', secondary: '#c8d4f2', accent: '#ffd37a', deep: '#0b1232', highlight: '#8ea9ed' },
  };

  const params = new URLSearchParams(window.location.search);
  const tentKey = (params.get('tent') || params.get('department') || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  /* Authoritative Department-Aware Events Pipeline */
  validateEventData();
  const canonicalDeptId = resolveDepartmentId(tentKey);
  const deptInfo = getDepartmentInfo(tentKey);
  const EVENTS = getDepartmentEvents(canonicalDeptId);
  const TENT_PALETTE = Object.assign({}, TENT_PALETTES[tentKey] || {
    name: 'SUPRAGNA 2K27', primary: '#8e44ff', secondary: '#ff3aa8', accent: '#ffc65c', deep: '#17103d', highlight: '#3ae3ff'
  });
  const customColor = params.get('color');
  if (customColor) {
    const hex = (customColor.startsWith('#') ? customColor : '#' + customColor).toLowerCase();
    if (COLOR_SHADE_MAP[hex]) {
      Object.assign(TENT_PALETTE, COLOR_SHADE_MAP[hex]);
    } else if (/^#[0-9a-f]{6}$/i.test(hex)) {
      TENT_PALETTE.primary = hex;
    }
  }
  const explicitSchool = params.get('school');
  const resolvedSchool = (explicitSchool ? schoolBySlug(explicitSchool) : null)
    || schoolForDepartment(tentKey)
    || schoolForDepartment(deptInfo?.id || '')
    || schoolBySlug('engineering');
  const schoolSlug = resolvedSchool?.slug || 'engineering';
  const schoolReturnPath = `/events/${schoolSlug}`;

  const returnCandidate = params.get('return') || document.referrer;
  let returnUrl = new URL(schoolReturnPath, window.location.origin);
  try {
    const candidate = returnCandidate ? new URL(returnCandidate, window.location.href) : null;
    if (candidate && candidate.origin === window.location.origin && candidate.pathname !== window.location.pathname) returnUrl = candidate;
  } catch (_) { }
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--violet', TENT_PALETTE.primary);
  rootStyle.setProperty('--magenta', TENT_PALETTE.secondary);
  rootStyle.setProperty('--cyan', TENT_PALETTE.highlight);
  rootStyle.setProperty('--gold', TENT_PALETTE.accent);
  rootStyle.setProperty('--night-700', TENT_PALETTE.deep);
  rootStyle.setProperty('--line', 'color-mix(in srgb, ' + TENT_PALETTE.secondary + ' 28%, transparent)');
  rootStyle.setProperty('--glass', 'color-mix(in srgb, ' + TENT_PALETTE.deep + ' 82%, #080718)');
  const heroKicker = document.getElementById('heroKicker');
  const heroTitle = document.getElementById('heroTitle');
  const heroSub = document.getElementById('heroSub');
  const tentDisplayName = deptInfo ? deptInfo.id : (tentKey ? tentKey.toUpperCase() : 'SUPRAGNA');
  const tentTitle = tentDisplayName;

  if (heroKicker) heroKicker.textContent = 'SUPRAGNA 2K27';
  if (heroTitle) heroTitle.textContent = tentTitle;
  if (heroSub && deptInfo?.name) heroSub.textContent = deptInfo.name;
  document.title = `${tentDisplayName} | SUPRAGNA 2K27`;
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const pad2 = n => String(n).padStart(2, '0');
  const $ = (s, r = document) => r.querySelector(s);
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------------------
     CONFIG + EVENTS
     Replace EVENTS with your real data source (same fields). If your app has its own
     details view or router, set onOpenEvent / onRegister and they replace the built-in sheet and demo toast.
     --------------------------------------------------------------------- */
  const CONFIG = {
    onOpenEvent: null,   // (event) => void
    onRegister: null     // (event) => void
  };

// Events pipeline initialized above

  /* Generated poster art, used when an event has no image of its own */
  function poster(i) {
    const PAL = [['#8e44ff', '#ff3aa8', '#3ae3ff'], ['#ffc65c', '#ff3aa8', '#8e44ff'], ['#3ae3ff', '#8e44ff', '#ffc65c'],
    ['#ff3aa8', '#8e44ff', '#ffc65c'], ['#3ae3ff', '#ff3aa8', '#8e44ff'], ['#ffc65c', '#3ae3ff', '#ff3aa8']];
    const [a, b, c] = PAL[i % 6];
    const r = mulberry32(i * 977 + 13);
    let g = '';
    switch (i % 6) {
      case 0:
        for (let k = 1; k < 9; k++) g += `<circle cx="560" cy="210" r="${k * 38}" fill="none" stroke="${k % 2 ? c : '#fff'}" stroke-opacity="${(0.55 - k * 0.05).toFixed(2)}" stroke-width="3"/>`;
        g += `<circle cx="560" cy="210" r="46" fill="${b}"/>`;
        break;
      case 1:
        for (let k = 0; k < 11; k++) {
          const x = 40 + k * 72 + (r() * 20 - 10), y = 60 + r() * 190;
          g += `<line x1="${x}" y1="0" x2="${x}" y2="${y}" stroke="#fff" stroke-opacity=".35"/><ellipse cx="${x}" cy="${y + 26}" rx="22" ry="30" fill="${k % 2 ? a : b}"/><rect x="${x - 9}" y="${y - 4}" width="18" height="8" fill="${c}"/>`;
        }
        break;
      case 2:
        for (let k = 0; k < 36; k++) {
          const t = Math.PI * (k / 35);
          g += `<line x1="400" y1="440" x2="${400 + Math.cos(t) * 620}" y2="${440 - Math.sin(t) * 620}" stroke="${k % 3 ? '#fff' : c}" stroke-opacity="${k % 3 ? 0.18 : 0.6}" stroke-width="${k % 3 ? 2 : 5}"/>`;
        }
        g += `<polygon points="400,120 470,230 400,340 330,230" fill="${b}"/>`;
        break;
      case 3:
        g += `<circle cx="560" cy="170" r="92" fill="${c}"/><circle cx="600" cy="150" r="86" fill="#0b0d2a"/>`;
        for (let k = 0; k < 26; k++) g += `<circle cx="${(r() * 800).toFixed(0)}" cy="${(r() * 400).toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="#fff" fill-opacity="${(0.4 + r() * 0.5).toFixed(2)}"/>`;
        break;
      case 4:
        for (let k = 0; k < 7; k++) {
          const y = 110 + k * 38;
          g += `<path d="M0 ${y} Q 100 ${y - 46} 200 ${y} T 400 ${y} T 600 ${y} T 800 ${y}" fill="none" stroke="${[a, b, c][k % 3]}" stroke-width="7" stroke-opacity="${(0.9 - k * 0.08).toFixed(2)}"/>`;
        }
        break;
      default:
        for (let k = 0; k < 3; k++) {
          const cx = 170 + k * 230 + (r() * 40 - 20), cy = 130 + r() * 110;
          for (let j = 0; j < 22; j++) {
            const t = j / 22 * Math.PI * 2, l = 46 + r() * 50;
            g += `<line x1="${(cx + Math.cos(t) * 14).toFixed(1)}" y1="${(cy + Math.sin(t) * 14).toFixed(1)}" x2="${(cx + Math.cos(t) * l).toFixed(1)}" y2="${(cy + Math.sin(t) * l).toFixed(1)}" stroke="${[a, b, c][(j + k) % 3]}" stroke-width="4" stroke-linecap="round"/>`;
          }
        }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0d2a"/><stop offset="1" stop-color="${a}" stop-opacity=".55"/></linearGradient></defs><rect width="800" height="420" fill="url(#g)"/>${g}</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------------------------------------------------------------------
     DOM: cards, HUD, sheet, toast (built once; nothing re-renders during scroll)
     --------------------------------------------------------------------- */
  const N_EV = EVENTS.length;
  const showcase = $('#showcase');
  const cardsEl = $('#cards');
  const stopsEl = $('#stops');
  cardsEl.innerHTML = '';
  stopsEl.innerHTML = '';
  const nowN = $('#nowN'), nowT = $('#nowT'), fillEl = $('#fill'), liveEl = $('#live'), heroEl = $('#hero');
  const returnEvents = $('#returnEvents'), rideReturn = $('#rideReturn');
  if (returnEvents) returnEvents.href = returnUrl.href;
  if (rideReturn) rideReturn.href = returnUrl.href;

  if (N_EV === 0) {
    const emptyCard = document.createElement('article');
    emptyCard.className = 'card is-live';
    emptyCard.setAttribute('aria-label', 'No events scheduled');
    emptyCard.innerHTML = `
      <div class="card-body" style="text-align: center; padding: 2.5rem 1.5rem;">
        <div class="info">
          <h2>No Events Scheduled</h2>
          <p style="margin-top: 1rem; color: #d8c3e5;">There are currently no events registered for this department. Please check back later or explore other departments!</p>
        </div>
        <div class="actions" style="justify-content: center; margin-top: 2rem;">
          <a class="btn primary" href="${returnUrl.pathname}" id="emptyBackBtn">Back to Departments</a>
        </div>
      </div>
    `;
    cardsEl.appendChild(emptyCard);
    const emptyBackBtn = emptyCard.querySelector('#emptyBackBtn');
    if (emptyBackBtn) on(emptyBackBtn, 'click', returnToEvents);
    nowN.textContent = 'No events';
    nowT.textContent = 'Explore other departments';
  } else {
    EVENTS.forEach((ev, i) => {
      const art = document.createElement('article');
      art.className = 'card';
      art.dataset.i = i;
      art.dataset.eventId = ev.id;
      art.setAttribute('data-event-id', ev.id);
      art.setAttribute('aria-label', ev.title || ev.name);
      art.inert = true;
      const dateText = ev.date ? esc(ev.date) : 'TBA';
      const timeText = ev.time ? esc(ev.time) : 'TBA';
      const venueText = ev.venue ? esc(ev.venue) : 'TBA';
      const priceText = ev.price ? esc(ev.price) : 'Free';
      const blurbText = esc(ev.blurb || ev.description || '');
      const regUrl = esc(ev.registerUrl || ev.registrationUrl || '#');
      const regBtnText = (ev.registerUrl || ev.registrationUrl) ? 'Register' : 'Coming Soon';

      art.innerHTML =
        `<div class="card-body">
         <div class="marquee" aria-hidden="true"></div>
         <div class="poster">
           <img src="${esc(ev.image || ev.image_url || poster(i))}" alt="" loading="eager" decoding="async">
           <span class="tag cat">${esc(ev.category || 'Event')}</span>
           <span class="tag stop">Stop ${pad2(i + 1)}</span>
         </div>
         <div class="perf" aria-hidden="true"></div>
         <div class="info">
           <h2>${esc(ev.title || ev.name)}</h2>
           <dl class="meta">
             <div><dt>Date</dt><dd>${dateText}</dd></div>
             <div><dt>Time</dt><dd>${timeText}</dd></div>
             <div><dt>Venue</dt><dd>${venueText}</dd></div>
             <div><dt>Entry</dt><dd>${priceText}</dd></div>
           </dl>
           <p>${blurbText}</p>
         </div>
         <div class="actions">
           <button class="btn primary" type="button" data-details="${i}">Details</button>
         </div>
         <div class="marquee bottom" aria-hidden="true"></div>
       </div>`;
      cardsEl.appendChild(art);

      const li = document.createElement('li');
      li.innerHTML = `<button class="dot" type="button" data-stop="${i}" data-event-id="${esc(ev.id)}" aria-label="Go to stop ${i + 1}: ${esc(ev.title || ev.name)}"></button>`;
      stopsEl.appendChild(li);
    });
  }
  const cardEls = [...cardsEl.querySelectorAll('.card')];
  const dotEls = [...stopsEl.querySelectorAll('.dot')];

  const sheet = $('#sheet');
  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3800);
  }

  function openEvent(i) {
    const ev = EVENTS[i];
    if (!ev) return;
    if (CONFIG.onOpenEvent) { CONFIG.onOpenEvent(ev); return; }
    $('#sheetImg').src = ev.image || ev.image_url || poster(i);
    $('#sheetCat').textContent = ev.category || 'Event';
    $('#sheetTitle').textContent = ev.title || ev.name;

    const metaList = [];
    if (ev.departmentId) {
      const dName = Array.isArray(ev.departmentId) ? ev.departmentId.join(', ') : ev.departmentId;
      metaList.push(['Department', dName]);
    }
    if (ev.date) metaList.push(['Date', ev.date]);
    if (ev.time) metaList.push(['Time', ev.time]);
    if (ev.venue) metaList.push(['Venue', ev.venue]);
    if (ev.price) metaList.push(['Entry', ev.price]);
    if (ev.club_name) metaList.push(['Club', ev.club_name]);

    $('#sheetMeta').innerHTML = metaList
      .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    $('#sheetText').textContent = ev.details || ev.description || ev.blurb || '';
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
  }

  function onRegister(e) {
    const a = e.target.closest('[data-register]');
    if (!a) return;
    const ev = EVENTS[+a.dataset.i];
    if (!ev) return;
    if (CONFIG.onRegister) { e.preventDefault(); CONFIG.onRegister(ev); return; }
    const href = a.getAttribute('href') || '';
    if (href === '#' || href.startsWith('#')) {
      e.preventDefault();
      if (!ev.registerUrl && !ev.registrationUrl) {
        toast(`Registrations for ${ev.title || ev.name} will open soon!`);
      } else {
        toast(`Registration link for ${ev.title || ev.name}: ${ev.registerUrl || ev.registrationUrl}`);
      }
    }
  }

  const listeners = [];
  function on(target, type, fn, opts) { if (!target) return () => {}; target.addEventListener(type, fn, opts); const cleanup = () => target.removeEventListener(type, fn, opts); listeners.push(cleanup); return cleanup; }

  function returnToEvents(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    clearTimeout(finalRedirectTimer);
    finalRedirectTimer = 0;
    const dest = returnUrl.pathname.startsWith('/events/') ? (returnUrl.pathname + returnUrl.search) : schoolReturnPath;
    window.location.assign(dest);
  }

  if (returnEvents) on(returnEvents, 'click', returnToEvents);
  if (rideReturn) on(rideReturn, 'click', returnToEvents);

  on(cardsEl, 'click', e => {
    const d = e.target.closest('[data-details]');
    if (d) { openEvent(+d.dataset.details); return; }
  });
  if (sheet) on(sheet, 'click', e => {
    if (e.target === sheet) sheet.close();
  });
  const sheetCloseBtn = $('#sheetClose'); if (sheetCloseBtn) on(sheetCloseBtn, 'click', () => sheet?.close?.());

  let jumpTo = () => { };
  let finalRedirectTimer = 0;
  on(stopsEl, 'click', e => {
    const b = e.target.closest('[data-stop]');
    if (b) jumpTo(+b.dataset.stop);
  });

  /* HUD + interactivity only change when the nearest stop changes, never per frame */
  let nearest = -1, liveIdx = -1;
  function setNearest(i) {
    if (i === nearest) return;
    nearest = i;
    if (N_EV > 0 && EVENTS[i]) {
      nowN.textContent = `STOP ${pad2(i + 1)}\u00A0/\u00A0${pad2(N_EV)}`;
      nowT.textContent = EVENTS[i].title || EVENTS[i].name;
    } else if (N_EV === 0) {
      nowN.textContent = 'No events';
      nowT.textContent = 'Explore other departments';
    }
    dotEls.forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('seen', k < i); });
  }
  function setLive(i) {
    if (i === liveIdx) return;
    liveIdx = i;
    cardEls.forEach((c, k) => {
      const on_ = k === i;
      c.classList.toggle('is-live', on_);
      c.inert = !on_;
    });
    if (i >= 0 && EVENTS[i]) liveEl.textContent = `Stop ${i + 1} of ${N_EV}: ${EVENTS[i].title || EVENTS[i].name}`;
  }

  /* =====================================================================
     2. THREE.JS CARNIVAL: track, supports, station, attractions, lights, rider camera
     ===================================================================== */
  const TIER = (() => {
    const small = Math.min(innerWidth, innerHeight) < 700 || matchMedia('(pointer:coarse)').matches;
    const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    const low = small || weak;
    return {
      low, samples: low ? 520 : 900, radial: low ? 4 : 6, dpr: Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2),
      stars: low ? 240 : 600, props: low ? 0.55 : 1, dust: low ? 280 : 760
    };
  })();

  let UPV, _m4, _q, _s, _p, _d;
  function initThreeHelpers() {
    UPV = new THREE.Vector3(0, 1, 0);
    _m4 = new THREE.Matrix4(); _q = new THREE.Quaternion(); _s = new THREE.Vector3(); _p = new THREE.Vector3(); _d = new THREE.Vector3();
  }

  function glowTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  class Bulbs {
    constructor() { this.p = []; this.c = []; }
    add(v, col, k = 1) { this.p.push(v.x, v.y, v.z); this.c.push(col.r * k, col.g * k, col.b * k); }
    build(tex, size, opacity = 1) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
      const m = new THREE.PointsMaterial({ size, map: tex, vertexColors: true, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
      const pts = new THREE.Points(g, m); pts.frustumCulled = false; return pts;
    }
  }

  /* A cylinder between two points, for instanced steel members */
  function memberMatrix(a, b, r) {
    _d.subVectors(b, a);
    const len = _d.length() || 1e-4;
    _p.addVectors(a, b).multiplyScalar(0.5);
    _q.setFromUnitVectors(UPV, _d.divideScalar(len));
    _s.set(r, len, r);
    return _m4.compose(_p, _q, _s);
  }
  function membersMesh(list, mat, seg = 5) {
    const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, seg, 1, false), mat, list.length);
    list.forEach((m, k) => mesh.setMatrixAt(k, memberMatrix(m[0], m[1], m[2])));
    mesh.instanceMatrix.needsUpdate = true; mesh.frustumCulled = false;
    return mesh;
  }

  function stripeTexture(c1, c2, n = 14) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 8;
    const g = c.getContext('2d'), w = 256 / n;
    for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? c2 : c1; g.fillRect(i * w, 0, w + 1, 8); }
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
  }

  function disposeScene(scene) {
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      mats.forEach(m => { ['map', 'emissiveMap', 'alphaMap'].forEach(k => m[k] && m[k].dispose()); m.dispose(); });
    });
  }

  function buildCarnival() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1b0f40, 30, 520);
    const glow = glowTexture();
    const rng = mulberry32(2026);
    const bulbs = new Bulbs();      // small lights: track, strings, tents
    const beacons = new Bulbs();    // large lights: pole tops, tower tips
    const members = [];             // steel tubes between two points: [a, b, radius]
    const V = (x, y, z) => new THREE.Vector3(x, y, z);
    const C = { gold: new THREE.Color(TENT_PALETTE.accent), cyan: new THREE.Color(TENT_PALETTE.highlight), mag: new THREE.Color(TENT_PALETTE.primary), vio: new THREE.Color(TENT_PALETTE.secondary), warm: new THREE.Color(TENT_PALETTE.secondary) };
    const cycle = [C.gold, C.mag, C.cyan, C.gold, C.vio];

    /* ---- sky, stars (follow the camera so they never parallax) ---- */
    const skyGroup = new THREE.Group(); scene.add(skyGroup);
    const sc = document.createElement('canvas'); sc.width = 8; sc.height = 512;
    const sg = sc.getContext('2d'), grd = sg.createLinearGradient(0, 0, 0, 512);
    [[0, '#03041a'], [0.32, '#0a0a30'], [0.46, '#2a1262'], [0.495, '#4a1a78'], [0.505, '#1b0f40'], [1, '#0a0620']].forEach(s => grd.addColorStop(s[0], s[1]));
    sg.fillStyle = grd; sg.fillRect(0, 0, 8, 512);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 24, 16), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), side: THREE.BackSide, fog: false, depthWrite: false }));
    sky.renderOrder = -10; skyGroup.add(sky);
    const sp = [], sCol = [];
    for (let i = 0; i < TIER.stars; i++) {
      let x, y, z;
      do { x = rng() * 2 - 1; y = rng(); z = rng() * 2 - 1; } while (x * x + y * y + z * z > 1 || y < 0.06);
      const k = 1200 / Math.hypot(x, y, z), b = 0.45 + rng() * 0.55;
      sp.push(x * k, y * k, z * k); sCol.push(b, b, b * (0.85 + rng() * 0.15));
    }
    const sgeo = new THREE.BufferGeometry();
    sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); sgeo.setAttribute('color', new THREE.Float32BufferAttribute(sCol, 3));
    const stars = new THREE.Points(sgeo, new THREE.PointsMaterial({ size: 2.6, map: glow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false, fog: false }));
    stars.frustumCulled = false; skyGroup.add(stars);

    /* ---- lights ---- */
    scene.add(new THREE.HemisphereLight(0x6a57d9, 0x0d0a26, 0.8));
    const moon = new THREE.DirectionalLight(0x7fb4ff, 0.55); moon.position.set(-80, 120, 40); scene.add(moon);

    /* ---- track path: stations, lift hill, drop, banked turns, brake run ---- */
    const CTRL = [[0, 4, 12], [0, 4, -20], [0, 9, -52], [0, 20, -86], [5, 24, -112], [19, 22, -132], [35, 8, -152], [49, 5, -178], [46, 12, -208],
    [29, 18, -228], [5, 9, -243], [-19, 4, -258], [-39, 7, -288], [-35, 15, -318], [-12, 10, -338], [14, 5, -348], [31, 4, -372], [31, 4, -402]].map(a => V(a[0], a[1], a[2]));
    const curve = new THREE.CatmullRomCurve3(CTRL, false, 'centripetal');
    const N = TIER.samples;
    const pts = curve.getSpacedPoints(N - 1);
    const ds = curve.getLength() / (N - 1);
    const T = [], R = [], U = [];
    for (let i = 0; i < N; i++) T.push(pts[Math.min(N - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize());
    let bank = new Float32Array(N);
    for (let i = 1; i < N - 1; i++) bank[i] = clamp(new THREE.Vector3().crossVectors(T[i - 1], T[i + 1]).y / (2 * ds) * 18, -0.65, 0.65);
    const brad = Math.max(2, Math.round(7 / ds));
    for (let pass = 0; pass < 3; pass++) {
      const nb = new Float32Array(N);
      for (let i = 0; i < N; i++) { let s = 0, c = 0; for (let j = Math.max(0, i - brad); j <= Math.min(N - 1, i + brad); j++) { s += bank[j]; c++; } nb[i] = s / c; }
      bank = nb;
    }
    for (let i = 0; i < N; i++) {
      const r0 = new THREE.Vector3().crossVectors(T[i], UPV).normalize();
      const u0 = new THREE.Vector3().crossVectors(r0, T[i]).normalize();
      const ub = u0.addScaledVector(r0, -bank[i]).normalize();   // tilt toward the inside of the turn
      const rb = new THREE.Vector3().crossVectors(T[i], ub).normalize();
      R.push(rb); U.push(new THREE.Vector3().crossVectors(rb, T[i]).normalize());
    }

    /* ---- rails, spine, ties ---- */
    const GAUGE = 1.3;
    const railMat = new THREE.MeshStandardMaterial({ color: TENT_PALETTE.primary, metalness: 0.6, roughness: 0.35, emissive: TENT_PALETTE.primary, emissiveIntensity: 0.6 });
    const spineMat = new THREE.MeshStandardMaterial({ color: TENT_PALETTE.deep, metalness: 0.5, roughness: 0.5, emissive: TENT_PALETTE.primary, emissiveIntensity: 0.5 });
    const tieMat = new THREE.MeshStandardMaterial({ color: TENT_PALETTE.deep, metalness: 0.3, roughness: 0.6, emissive: TENT_PALETTE.primary, emissiveIntensity: 0.34 });
    const supMat = new THREE.MeshStandardMaterial({ color: TENT_PALETTE.primary, metalness: 0.35, roughness: 0.55, emissive: TENT_PALETTE.deep, emissiveIntensity: 0.45 });
    const tube = (off, radius, mat) => {
      const arr = pts.map((p, i) => off(p, i));
      return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arr, false, 'catmullrom', 0.5), N - 1, radius, TIER.radial, false), mat);
    };
    scene.add(tube((p, i) => p.clone().addScaledVector(R[i], GAUGE / 2), 0.07, railMat));
    scene.add(tube((p, i) => p.clone().addScaledVector(R[i], -GAUGE / 2), 0.07, railMat));
    scene.add(tube((p, i) => p.clone().addScaledVector(U[i], -0.5), 0.17, spineMat));

    const tieStep = Math.max(2, Math.round(1.5 / ds));
    const tieIdx = []; for (let i = 0; i < N; i += tieStep) tieIdx.push(i);
    const ties = new THREE.InstancedMesh(new THREE.BoxGeometry(GAUGE + 0.55, 0.08, 0.2), tieMat, tieIdx.length);
    const zA = new THREE.Vector3();
    tieIdx.forEach((i, k) => {
      zA.crossVectors(R[i], U[i]); _m4.makeBasis(R[i], U[i], zA); _m4.setPosition(pts[i]); ties.setMatrixAt(k, _m4);
      if (k % (TIER.low ? 3 : 2) === 0) {
        const col = k % 10 === 0 ? C.cyan : C.gold;
        [-1, 1].forEach(s => bulbs.add(pts[i].clone().addScaledVector(R[i], s * (GAUGE / 2 + 0.34)).addScaledVector(U[i], 0.14), col, 0.9));
      }
    });
    ties.instanceMatrix.needsUpdate = true; ties.frustumCulled = false; scene.add(ties);

    /* truss under the track */
    const trussStep = Math.max(2, Math.round(2.2 / ds));
    for (let i = 0; i < N; i += trussStep) {
      const sp0 = pts[i].clone().addScaledVector(U[i], -0.5);
      members.push([sp0, pts[i].clone().addScaledVector(R[i], 0.62), 0.045], [sp0, pts[i].clone().addScaledVector(R[i], -0.62), 0.045]);
    }
    /* support towers: two columns, cross beams and X bracing, down to the ground */
    const supStep = Math.max(4, Math.round(11 / ds));
    for (let i = Math.round(3 / ds); i < N; i += supStep) {
      const sp0 = pts[i].clone().addScaledVector(U[i], -0.5);
      const top = sp0.y - 0.2;
      if (top < 1.5) continue;
      const hl = Math.hypot(R[i].x, R[i].z) || 1, rx = R[i].x / hl * 1.15, rz = R[i].z / hl * 1.15;
      const lx = sp0.x - rx, lz = sp0.z - rz, rrx = sp0.x + rx, rrz = sp0.z + rz;
      members.push([V(lx, top, lz), V(lx, 0, lz), 0.17], [V(rrx, top, rrz), V(rrx, 0, rrz), 0.17], [V(lx, top, lz), V(rrx, top, rrz), 0.12], [sp0, V(sp0.x, top, sp0.z), 0.1],
        [V(lx, 0, lz), V(lx, 0.35, lz), 0.4], [V(rrx, 0, rrz), V(rrx, 0.35, rrz), 0.4]);
      const ys = [top]; for (let y = top - 4.5; y > 0.9; y -= 4.5) ys.push(y); ys.push(0.35);
      for (let k = 0; k < ys.length - 1; k++) {
        const y0 = ys[k], y1 = ys[k + 1];
        members.push([V(lx, y0, lz), V(rrx, y1, rrz), 0.06], [V(rrx, y0, rrz), V(lx, y1, lz), 0.06]);
        if (y1 > 0.5) members.push([V(lx, y1, lz), V(rrx, y1, rrz), 0.09]);
      }
    }

    /* ---- station at the start of the ride ---- */
    const stMat = new THREE.MeshStandardMaterial({ color: 0x1d1f58, metalness: 0.4, roughness: 0.6, emissive: 0x140f3d, emissiveIntensity: 0.8 });
    const addBox = (w, h, l, x, y, z, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), mat); m.position.set(x, y, z); scene.add(m); return m; };
    [-1, 1].forEach(s => {
      addBox(3.2, 0.5, 38, s * 3.6, 3.25, -6, stMat);
      [12, -6, -24].forEach(z => members.push([V(s * 3.6, 3, z), V(s * 3.6, 0, z), 0.2]));
      [11, -1, -13, -24].forEach(z => members.push([V(s * 6.6, 9.4, z), V(s * 6.6, 0, z), 0.16]));
      for (let z = 12; z > -24; z -= 2.2) bulbs.add(V(s * 5.4, 9.1, z), z % 4.4 < 2.2 ? C.gold : C.warm, 1);
    });
    addBox(14, 0.35, 38, 0, 9.6, -6, stMat);
    addBox(14.4, 0.16, 38.4, 0, 9.3, -6, new THREE.MeshBasicMaterial({ color: TENT_PALETTE.primary }));

    /* ---- ground + midway path ---- */
    const ground = new THREE.Mesh(new THREE.CircleGeometry(900, 48), new THREE.MeshStandardMaterial({ color: 0x0c0a26, roughness: 0.95, metalness: 0 }));
    ground.rotation.x = -Math.PI / 2; scene.add(ground);
    {
      const pos = [], idx = []; let k = 0;
      for (let i = 0; i < N; i += 3) {
        const hl = Math.hypot(R[i].x, R[i].z) || 1, hx = R[i].x / hl * 7, hz = R[i].z / hl * 7;
        pos.push(pts[i].x - hx, 0.04, pts[i].z - hz, pts[i].x + hx, 0.04, pts[i].z + hz);
        if (k > 0) { const a = (k - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        k++;
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      scene.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x13103a, roughness: 0.9, emissive: 0x0a0826, emissiveIntensity: 0.8, side: THREE.DoubleSide })));
    }

    /* ---- scatter helpers for attractions ---- */
    const occ = [];
    const clear = (x, z, minD) => { for (let j = 0; j < N; j += 3) { const dx = pts[j].x - x, dz = pts[j].z - z; if (dx * dx + dz * dz < minD * minD) return false; } return true; };
    const spaced = (x, z, r) => occ.every(o => Math.hypot(o[0] - x, o[1] - z) > o[2] + r + 3);
    function scatter(count, minOff, maxOff, minD, rad, make) {
      let placed = 0, tries = 0;
      while (placed < count && tries < count * 60) {
        tries++;
        const i = Math.floor(rng() * N), side = rng() < 0.5 ? -1 : 1, off = minOff + rng() * (maxOff - minOff);
        const hl = Math.hypot(R[i].x, R[i].z) || 1;
        const x = pts[i].x + R[i].x / hl * side * off, z = pts[i].z + R[i].z / hl * side * off;
        if (!clear(x, z, minD) || !spaced(x, z, rad)) continue;
        occ.push([x, z, rad]); make(x, z); placed++;
      }
    }
    const stripes = [stripeTexture(TENT_PALETTE.primary, TENT_PALETTE.deep), stripeTexture(TENT_PALETTE.secondary, TENT_PALETTE.primary), stripeTexture(TENT_PALETTE.accent, TENT_PALETTE.deep)];
    const stripeMat = k => new THREE.MeshStandardMaterial({ map: stripes[k % 3], emissiveMap: stripes[k % 3], emissive: 0xffffff, emissiveIntensity: 0.42, roughness: 0.8, side: THREE.DoubleSide });
    const ring = (cx, y, cz, r, n, col, k = 1) => { for (let a = 0; a < n; a++) { const t = a / n * Math.PI * 2; bulbs.add(V(cx + Math.cos(t) * r, y, cz + Math.sin(t) * r), col(a), k); } };

    const tent = (x, z) => {
      const rad = 4 + rng() * 2.2, h = 5.5 + rng() * 2.5, mat = stripeMat(Math.floor(rng() * 3));
      const body = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h * 0.38, 20, 1, true), mat); body.position.set(x, h * 0.19, z);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.15, rad * 1.1, h * 0.62, 20, 1, true), mat); roof.position.set(x, h * 0.38 + h * 0.31, z);
      scene.add(body, roof);
      ring(x, h * 0.38, z, rad * 1.08, 22, a => cycle[a % 5]);
      beacons.add(V(x, h + 0.4, z), C.mag, 0.9);
    };
    const carousel = (x, z) => {
      const mat = stripeMat(Math.floor(rng() * 3));
      const base = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.4, 0.5, 24), stMat); base.position.set(x, 0.25, z);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 6.2, 3, 24, 1, true), mat); roof.position.set(x, 6.6, z);
      scene.add(base, roof);
      members.push([V(x, 0.4, z), V(x, 5.2, z), 0.35]);
      for (let a = 0; a < 8; a++) { const t = a / 8 * Math.PI * 2; members.push([V(x + Math.cos(t) * 4.6, 0.4, z + Math.sin(t) * 4.6), V(x + Math.cos(t) * 4.6, 5.2, z + Math.sin(t) * 4.6), 0.1]); }
      ring(x, 5.1, z, 6.1, 26, a => (a % 2 ? C.gold : C.warm));
      ring(x, 3.4, z, 4.6, 12, () => C.mag, 0.8);
      beacons.add(V(x, 8.4, z), C.gold, 1);
    };
    const tower = (x, z) => {
      members.push([V(x, 0, z), V(x, 40, z), 0.6]);
      const car = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.7, 18), new THREE.MeshStandardMaterial({ color: 0x2a2f6e, emissive: 0x1fc6e8, emissiveIntensity: 0.4 }));
      car.position.set(x, 33, z); scene.add(car);
      ring(x, 33.5, z, 3.2, 18, () => C.cyan);
      for (let y = 2; y < 40; y += 1.8) { bulbs.add(V(x + 0.9, y, z), y % 3.6 < 1.8 ? C.cyan : C.vio, 1); bulbs.add(V(x - 0.9, y, z), y % 3.6 < 1.8 ? C.vio : C.cyan, 1); }
      beacons.add(V(x, 41.5, z), C.gold, 1);
    };
    const awnCols = [TENT_PALETTE.primary, TENT_PALETTE.secondary, TENT_PALETTE.highlight, TENT_PALETTE.accent].map(c => new THREE.Color(c).getHex());
    const booths = (x, z) => {
      const ang = rng() * Math.PI * 2, cnt = 5;
      for (let k = 0; k < cnt; k++) {
        const g = new THREE.Group();
        g.position.set(x + Math.cos(ang) * k * 4.4, 0, z + Math.sin(ang) * k * 4.4); g.rotation.y = -ang;
        const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 2.4), stMat); b.position.y = 1.2;
        const a = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 1.6), new THREE.MeshStandardMaterial({ color: awnCols[(k + Math.floor(rng() * 4)) % 4], emissive: awnCols[k % 4], emissiveIntensity: 0.55 }));
        a.position.set(0, 2.6, 1.1); a.rotation.x = 0.25; g.add(b, a);
        scene.add(g); g.updateMatrixWorld(true);
        for (let q = -2; q <= 2; q++) bulbs.add(g.localToWorld(V(q * 0.7, 2.25, 1.85)), cycle[(q + k + 5) % 5], 1);
        beacons.add(g.localToWorld(V(0, 1.8, 1.4)), C.warm, 0.5);
      }
    };
    const P = TIER.props;
    scatter(Math.round(10 * P), 18, 62, 14, 6.5, tent);
    scatter(Math.max(1, Math.round(2 * P)), 24, 60, 14, 7, carousel);
    scatter(Math.max(1, Math.round(3 * P)), 30, 70, 14, 3, tower);
    scatter(Math.round(4 * P), 16, 55, 14, 11, booths);

    /* ---- light poles, string lights, light pools on the ground ---- */
    const poolList = [], segs = [];
    const poleIdx = []; for (let i = Math.round(8 / ds); i < N - 4; i += Math.round(28 / ds)) poleIdx.push(i);
    [-1, 1].forEach(side => {
      let prev = null;
      poleIdx.forEach(i => {
        const hl = Math.hypot(R[i].x, R[i].z) || 1;
        const x = pts[i].x + R[i].x / hl * side * 9, z = pts[i].z + R[i].z / hl * side * 9;
        members.push([V(x, 0, z), V(x, 7.2, z), 0.1]);
        beacons.add(V(x, 7.4, z), C.warm, 0.9);
        poolList.push([x, z]);
        const top = V(x, 7.2, z);
        if (prev) {
          const dist = prev.distanceTo(top), cnt = Math.max(6, Math.round(dist / 1.5));
          let last = null;
          for (let k = 0; k <= cnt; k++) {
            const t = k / cnt, v = prev.clone().lerp(top, t); v.y -= 1.4 * 4 * t * (1 - t);
            if (k % 1 === 0) bulbs.add(v, cycle[(k + i) % 5], 0.85);
            if (last) segs.push(last.x, last.y, last.z, v.x, v.y, v.z);
            last = v;
          }
        }
        prev = top;
      });
    });
    if (segs.length) {
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
      scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x4a4390 })));
    }
    if (poolList.length) {
      const pool = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }), poolList.length);
      const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2), one = new THREE.Vector3(18, 18, 1);
      poolList.forEach((p, k) => { pool.setMatrixAt(k, _m4.compose(V(p[0], 0.08, p[1]), qx, one)); pool.setColorAt(k, C.warm); });
      pool.instanceMatrix.needsUpdate = true; pool.frustumCulled = false; scene.add(pool);
    }

    /* ---- dust motes + distant skyline ---- */
    const dust = new Bulbs();
    for (let k = 0; k < TIER.dust; k++) {
      const i = Math.floor(rng() * N);
      dust.add(V(pts[i].x + (rng() - 0.5) * 90, 1 + rng() * 38, pts[i].z + (rng() - 0.5) * 90), cycle[k % 5], 0.35 + rng() * 0.35);
    }
    scene.add(dust.build(glow, 0.55, 0.7));
    const skyMat = new THREE.MeshBasicMaterial({ color: 0x120a30 });
    for (let k = 0; k < 64; k++) {
      const a = rng() * Math.PI * 2, rr = 300 + rng() * 110, h = 10 + rng() * 44;
      const b = new THREE.Mesh(new THREE.BoxGeometry(10 + rng() * 20, h, 10 + rng() * 20), skyMat);
      b.position.set(Math.cos(a) * rr, h / 2, -190 + Math.sin(a) * rr); scene.add(b);
      if (rng() < 0.4) beacons.add(V(b.position.x, h + 0.5, b.position.z), C.mag, 0.7);
    }

    scene.add(membersMesh(members, supMat));
    scene.add(bulbs.build(glow, 0.62));
    scene.add(beacons.build(glow, 2.0, 0.9));

    /* ---- rider camera: car nose, headlamp ---- */
    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 2500);
    scene.add(camera);
    const headlamp = new THREE.PointLight(0xffd9a8, 0.5, 45, 1.6); headlamp.position.set(0, 1.4, -9); camera.add(headlamp);
    const rim = new THREE.PointLight(TENT_PALETTE.secondary, 0.3, 40, 1.8); rim.position.set(0, -0.2, 3); camera.add(rim);
    const car = new THREE.Group();
    car.add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 3), new THREE.MeshStandardMaterial({ color: 0x0b0c26, metalness: 0.2, roughness: 0.85, emissive: 0x120a38, emissiveIntensity: 0.6 })));
    const trim = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.07), new THREE.MeshBasicMaterial({ color: TENT_PALETTE.accent })); trim.position.set(0, 0.29, -1.45); car.add(trim);
    car.position.set(0, -1.75, -2.6); camera.add(car);

    const fp = V(0, 0, 0), ft = V(0, 0, 0), fu = V(0, 0, 0), la = V(0, 0, 0), lt = V(0, 0, 0), lu = V(0, 0, 0);
    function frame(u, oP, oT, oU) {
      const f = clamp(u, 0, 1) * (N - 1), i = Math.min(N - 2, Math.floor(f)), k = f - i;
      oP.lerpVectors(pts[i], pts[i + 1], k); oT.lerpVectors(T[i], T[i + 1], k).normalize(); oU.lerpVectors(U[i], U[i + 1], k).normalize();
    }
    let baseFov = 62;
    /* p: scroll progress 0..1. The camera is a pure function of p, so scrolling up reverses the ride. */
    function setRide(p) {
      const u = clamp(p, 0, 1) * 0.965;
      frame(u, fp, ft, fu);
      frame(u + 0.035, la, lt, lu);
      camera.position.copy(fp).addScaledVector(fu, 1.2);
      camera.up.copy(UPV).lerp(fu, 0.45).normalize();
      la.addScaledVector(lu, 1.2); la.y -= 0.9;
      camera.lookAt(la);
      camera.fov = baseFov + clamp(-ft.y * 11, -2, 7);
      camera.updateProjectionMatrix();
      skyGroup.position.copy(camera.position);
    }
    function resize(w, h) { camera.aspect = w / h; baseFov = w / h < 1 ? 78 : 62; camera.updateProjectionMatrix(); }

    return { scene, camera, setRide, resize, dispose: () => disposeScene(scene) };
  }

  /* =====================================================================
     Scroll controller: carnival coaster scene only (Ferris wheel removed).
     ===================================================================== */
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const A_START = -2.2, A_END = Math.max(0, N_EV - 1);
  const BEATS = Math.max(1, A_END - A_START);     // finish with the final event card centered and interactive
  const FINAL_VIEW_MS = 10000;

  function boot() {
    const canvas = $('#gl');
    const offs = [];
    const listen = (t, ty, fn, o) => { t.addEventListener(ty, fn, o); offs.push(() => t.removeEventListener(ty, fn, o)); };
    const hasLibs = !!(window.THREE && window.gsap && window.ScrollTrigger);
    const motion = hasLibs && !reduceMQ.matches;
    let renderer = null, world = null;

    if (hasLibs) {
      try {
        initThreeHelpers();
        renderer = new THREE.WebGLRenderer({ canvas, antialias: !TIER.low, powerPreference: 'high-performance' });
        renderer.setPixelRatio(TIER.dpr); renderer.autoClear = false; renderer.setClearColor(0x0a0620, 1);
        world = buildCarnival();
      } catch (err) {
        console.warn('3D scene unavailable, showing the static layout.', err);
        if (renderer) renderer.dispose();
        renderer = null; world = null;
      }
    }
    const useMotion = motion && !!renderer;

    /* ---- sizing ---- */
    let W = 1, H = 1, vw = 1, vh = 1, fit = 1, prog = 0;
    const vis = new Array(N_EV).fill(false), nearArr = new Array(N_EV).fill(false);
    function measure() {
      vw = showcase.clientWidth; vh = showcase.clientHeight;
      let mh = 0; cardEls.forEach(c => { mh = Math.max(mh, c.offsetHeight); });
      fit = clamp((vh - 150) / (mh || 1), 0.55, 1);
    }
    function resize() {
      if (!renderer) return;
      W = canvas.clientWidth || innerWidth; H = canvas.clientHeight || innerHeight;
      renderer.setSize(W, H, false);
      world.resize(W, H);
      measure();
    }
    function draw(t, still) {
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, W, H);
      renderer.clear();
      renderer.render(world.scene, world.camera);

    }

    /* ---- static layout: reduced motion, or no WebGL/libraries ---- */
    if (!useMotion) {
      showcase.classList.add('is-static');
      cardEls.forEach(c => { c.removeAttribute('style'); c.inert = false; c.classList.add('near'); });
      heroEl.removeAttribute('style');
      if (renderer) {
        prog = 0.1;
        world.setRide(prog);
        const redraw = () => { resize(); draw(0, true); };
        redraw();
        listen(window, 'resize', redraw);
      } else {
        canvas.style.display = 'none';
        showcase.style.background = 'radial-gradient(120% 80% at 50% 0%,#2a1262 0%,#0b0d2a 55%,#060716 100%)';
      }
      return () => {
        offs.forEach(f => f());
        if (renderer) { world.dispose(); renderer.dispose(); }
        showcase.classList.remove('is-static'); canvas.style.display = ''; showcase.style.background = '';
      };
    }

    /* ---- animated layout ---- */
    showcase.classList.remove('is-static');
    liveIdx = -2; nearest = -2; setLive(-1);
    const DWELL = 0.16;

    function layoutCards(A) {
      if (N_EV === 0) return;
      for (let i = 0; i < N_EV; i++) {
        const el = cardEls[i];
        if (!el) continue;
        const ph = i - A;
        if (ph > 4.2 || ph < -1.15) { if (vis[i]) { el.style.visibility = 'hidden'; vis[i] = false; } continue; }
        if (!vis[i]) { el.style.visibility = 'visible'; vis[i] = true; }
        const a = Math.sign(ph) * Math.max(0, Math.abs(ph) - DWELL);
        const side = i % 2 ? 1 : -1;
        let s, x, y, o, dim, ry;
        if (a >= 0) {                         // approaching: small and far, sweeping in from beside the track
          s = 1 / (1 + 1.35 * a);
          const f = 1 - s;
          x = side * f * vw * (vw < 700 ? 0.34 : 0.40);
          y = -f * vh * 0.1;
          o = clamp((3.8 - a) / 1.4, 0, 1);
          dim = clamp(a * 0.3, 0, 0.62);
          ry = -side * f * 22;
        } else {                              // passed: swells and slides out to its side
          const q = -a;
          s = 1 + q * 0.8; x = side * q * vw * 0.55; y = q * vh * 0.1;
          o = clamp(1 - q / 0.85, 0, 1); dim = q * 0.4; ry = side * q * 24;
        }
        const nr = Math.abs(ph) < 1.25;
        if (nr !== nearArr[i]) { nearArr[i] = nr; el.classList.toggle('near', nr); }
        el.style.opacity = o.toFixed(3);
        el.style.zIndex = String(100 - Math.round(Math.abs(ph) * 10));
        el.style.setProperty('--dim', dim.toFixed(3));
        el.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotateY(${ry.toFixed(1)}deg) scale(${(s * fit).toFixed(4)})`;
      }
    }

    /* One function maps scroll progress to everything: camera, cards, hero, HUD. */
    const scheduleFinalRedirect = () => {
      finalRedirectTimer = window.setTimeout(() => {
        finalRedirectTimer = 0;
        if (sheet.open) {
          scheduleFinalRedirect();
          return;
        }
        returnToEvents();
      }, FINAL_VIEW_MS);
    };

    function apply(p) {
      prog = p;
      world.setRide(p);
      const A = lerp(A_START, A_END, p);
      layoutCards(A);
      const h = 1 - smooth(p / 0.08);
      heroEl.style.opacity = h.toFixed(3);
      heroEl.style.visibility = h > 0.01 ? 'visible' : 'hidden';
      heroEl.style.transform = `translateY(${(-p * 60).toFixed(1)}px)`;
      fillEl.style.setProperty('--p', p.toFixed(4));
      setNearest(clamp(Math.round(A), 0, N_EV - 1));
      let live = -1;
      for (let i = 0; i < N_EV; i++) if (Math.abs(i - A) < 0.4) live = i;
      setLive(live);
      rideReturn.hidden = false;
      if (p >= 0.999) {
        if (!finalRedirectTimer) scheduleFinalRedirect();
      } else {
        clearTimeout(finalRedirectTimer);
        finalRedirectTimer = 0;
      }
    }

    gsap.registerPlugin(ScrollTrigger);
    const proxy = { p: 0 };
    let st = null;
    const ctx = gsap.context(() => {
      const tw = gsap.to(proxy, {
        p: 1, ease: 'none', onUpdate: () => apply(proxy.p),
        scrollTrigger: {
          trigger: showcase, start: 'top top', pin: true, anticipatePin: 1, scrub: 0.7, invalidateOnRefresh: true,
          end: () => '+=' + Math.round(innerHeight * BEATS * (TIER.low ? 0.8 : 0.95)),
          onRefresh: () => { measure(); apply(proxy.p); }
        }
      });
      st = tw.scrollTrigger;
    });
    jumpTo = i => {
      if (!st || N_EV === 0) return;
      const span = Math.max(0.001, A_END - A_START);
      const target = st.start + ((i - A_START) / span) * (st.end - st.start);
      window.scrollTo({ top: target, behavior: 'smooth' });
    };

    resize();
    apply(0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); apply(proxy.p); });
    if (window.ResizeObserver) { const ro = new ResizeObserver(() => { resize(); apply(proxy.p); }); ro.observe(canvas); offs.push(() => ro.disconnect()); }
    else listen(window, 'resize', () => { resize(); apply(proxy.p); });

    /* ---- render loop: runs only while the stage is on screen and the tab is visible ---- */
    const t0 = performance.now();
    let raf = 0, inView = true, running = false;
    const frame = now => { raf = requestAnimationFrame(frame); draw((now - t0) / 1000, false); };
    const sync = () => {
      const want = inView && !document.hidden;
      if (want && !running) { running = true; raf = requestAnimationFrame(frame); }
      else if (!want && running) { running = false; cancelAnimationFrame(raf); }
    };
    const io = new IntersectionObserver(es => { inView = es[0].isIntersecting; sync(); }, { threshold: 0 });
    io.observe(showcase);
    offs.push(() => io.disconnect());
    listen(document, 'visibilitychange', sync);
    listen(canvas, 'webglcontextlost', e => { e.preventDefault(); inView = false; sync(); });
    listen(canvas, 'webglcontextrestored', () => { inView = true; sync(); });
    sync();

    return () => {
      running = false; cancelAnimationFrame(raf);
      clearTimeout(finalRedirectTimer);
      offs.forEach(f => f());
      ctx.revert();
      jumpTo = () => { };
      world.dispose(); renderer.dispose();
      cardEls.forEach(c => { c.removeAttribute('style'); c.classList.remove('near', 'is-live'); });
      cardsEl.innerHTML = '';
      stopsEl.innerHTML = '';
      heroEl.removeAttribute('style');
    };
  }

  
  /* ---------------------------------------------------------------------
     Navigation Modal Handlers (Register, About Us, Contact Us)
     --------------------------------------------------------------------- */
  const regModal = $('#register');
  const aboutModal = $('#about');
  const contactModal = $('#contact');

  function openSheet(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function closeSheet(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (_) {}
    }
  }

  const navReg = $('#navRegister');
  const navAbout = $('#navAbout');
  const navContact = $('#navContact');
  if (navReg) on(navReg, 'click', (e) => { e.preventDefault(); openSheet(regModal); });
  if (navAbout) on(navAbout, 'click', (e) => { e.preventDefault(); openSheet(aboutModal); });
  if (navContact) on(navContact, 'click', (e) => { e.preventDefault(); openSheet(contactModal); });

  const regClose = $('#regClose');
  const aboutClose = $('#aboutClose');
  const contactClose = $('#contactClose');
  const aboutExplore = $('#aboutExplore');
  if (regClose) on(regClose, 'click', () => closeSheet(regModal));
  if (aboutClose) on(aboutClose, 'click', () => closeSheet(aboutModal));
  if (contactClose) on(contactClose, 'click', () => closeSheet(contactModal));
  if (aboutExplore) on(aboutExplore, 'click', () => { closeSheet(aboutModal); jumpTo(0); });

  [regModal, aboutModal, contactModal].forEach(dlg => {
    if (dlg) {
      on(dlg, 'click', (e) => {
        if (e.target === dlg) closeSheet(dlg);
      });
    }
  });

  const regForm = $('#regForm');
  if (regForm) {
    on(regForm, 'submit', (e) => {
      e.preventDefault();
      closeSheet(regModal);
      toast('🎉 Registration confirmed! Your pass has been issued.');
    });
  }

  const contactForm = $('#contactForm');
  if (contactForm) {
    on(contactForm, 'submit', (e) => {
      e.preventDefault();
      closeSheet(contactModal);
      toast('✉️ Message sent! Our team will contact you shortly.');
    });
  }

  const regDept = $('#regDept');
  if (regDept && canonicalDeptId) {
    regDept.value = canonicalDeptId;
  }

  const checkInitialHash = () => {
    const h = window.location.hash;
    if (h === '#register') openSheet(regModal);
    else if (h === '#about') openSheet(aboutModal);
    else if (h === '#contact') openSheet(contactModal);
  };
  checkInitialHash();
  on(window, 'hashchange', checkInitialHash);

  let teardown = boot();
  const onMotionPreferenceChange = () => { teardown(); teardown = boot(); };
  reduceMQ.addEventListener('change', onMotionPreferenceChange);
  (window as any).__midwayNightsCleanup = () => {
    teardown();
    reduceMQ.removeEventListener('change', onMotionPreferenceChange);
    delete (window as any).__midwayNightsCleanup;
  };

}
