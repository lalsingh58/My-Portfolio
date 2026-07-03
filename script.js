"use strict";

/**
 * Security notes for this file:
 * - No use of eval, Function(), or document.write.
 * - Any value that could ever originate from a user (terminal input,
 *   contact form fields) is inserted using textContent / createElement,
 *   never innerHTML, so it can never be interpreted as markup or script
 *   (prevents DOM-based XSS).
 * - innerHTML is used only for small, fully hard-coded strings that never
 *   contain interpolated user data (e.g. the static terminal "help" text).
 * - The contact form validates and length-limits input before building a
 *   mailto: link, and every part is passed through encodeURIComponent.
 * - External links open with rel="noopener noreferrer" (set in HTML) to
 *   prevent reverse-tabnabbing.
 */

/* ============ Small escaping helper (defense in depth) ============ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

/* ============ CLOCK ============ */
function tick() {
  const d = new Date();
  const clockEl = document.getElementById("clock");
  if (clockEl) {
    clockEl.textContent = d.toLocaleTimeString("en-IN", { hour12: false });
  }
}
tick();
setInterval(tick, 1000);
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ============ MOBILE MENU ============ */
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
}
document.querySelectorAll(".navlist a").forEach((a) => {
  a.addEventListener("click", () => {
    if (sidebar) sidebar.classList.remove("open");
    document
      .querySelectorAll(".navlist a")
      .forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
  });
});

/* ============ MATRIX RAIN ============ */
const canvas = document.getElementById("matrix-canvas");
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const chars = "01アイウエオカキクケコサシスセソ$#@%&";
  const fontSize = 15;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);
  function drawMatrix() {
    ctx.fillStyle = "rgba(6,10,17,0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2dd4f0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
        drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 60);
}

/* ============ ANIMATION LAYER (resilient to CDN failures) ============ */
/* Everything below is progressive enhancement: if GSAP fails to load
   (blocked CDN, offline, ad-blocker, strict CSP), content still renders
   correctly and the rest of this script keeps working. */
const gsapReady =
  typeof window.gsap !== "undefined" &&
  typeof window.ScrollTrigger !== "undefined";
if (gsapReady) {
  gsap.registerPlugin(ScrollTrigger);
}

/* Counters */
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = parseFloat(el.getAttribute("data-count"));
  const suffix = el.getAttribute("data-suffix") || "";
  if (gsapReady) {
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.floor(obj.val) + suffix;
          },
        }),
    });
  } else {
    el.textContent = target + suffix;
  }
});

/* Reveals */
if (gsapReady) {
  gsap.utils.toArray(".reveal").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: (i % 3) * 0.05,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
}

/* Nav active on scroll */
const navLinks = document.querySelectorAll(".navlist a");
const sections = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
function updateActiveNav() {
  let current = sections[0];
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s;
  });
  if (current) {
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id),
    );
  }
}
if (gsapReady) {
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: updateActiveNav,
  });
} else {
  window.addEventListener("scroll", updateActiveNav, { passive: true });
}

/* ============ SKILL / STACK / DSA / TOOLS DATA ============
   All of the following arrays are hard-coded by the site author (not user
   input), so building elements from them is safe. Even so, DOM APIs
   (createElement/textContent) are used instead of string-concatenated
   innerHTML, so there is no template-injection surface at all. */
const skills = [
  ["Linux", "LX", "#2dd4f0"],
  ["Kali Linux", "K", "#4d7fff"],
  ["Nmap", "NM", "#3ddc97"],
  ["Burp Suite", "BS", "#ff5c72"],
  ["Metasploit", "MSF", "#9b6bff"],
  ["SQLMap", "SQL", "#ffb454"],
  ["John the Ripper", "JTR", "#2dd4f0"],
  ["Hashcat", "HC", "#ff5c72"],
  ["Python", "PY", "#4d7fff"],
  ["Wireshark", "WS", "#3ddc97"],
  ["BloodHound", "BH", "#9b6bff"],
  ["Git", "GIT", "#ffb454"],
];
const skillGrid = document.getElementById("skillGrid");
if (skillGrid) {
  skills.forEach(([name, ic, color]) => {
    const item = document.createElement("div");
    item.className = "skill-item";
    const icon = document.createElement("div");
    icon.className = "ic";
    icon.style.background = color + "22";
    icon.style.color = color;
    icon.style.border = `1px solid ${color}55`;
    icon.textContent = ic;
    const label = document.createElement("span");
    label.textContent = name;
    item.append(icon, label);
    skillGrid.appendChild(item);
  });
}

const viewAllBtn = document.getElementById("viewAllSkillsBtn");
if (viewAllBtn) {
  viewAllBtn.addEventListener("click", () => {
    const toolsEl = document.getElementById("tools");
    if (toolsEl) toolsEl.scrollIntoView({ behavior: "smooth" });
  });
}

const stack = [
  ["HTML5", "H5", "#e04e2c"],
  ["CSS3", "C3", "#2b6cd4"],
  ["JavaScript", "JS", "#e8c547"],
  ["React", "⚛", "#4dd0e1"],
  ["Node.js", "N", "#3ddc97"],
  ["Express.js", "EX", "#dbe6f3"],
  ["Django", "DJ", "#2b6a3d"],
  ["MongoDB", "M", "#4faa4c"],
  ["MySQL", "SQL", "#4d7fff"],
  ["Tailwind CSS", "TW", "#38bdf8"],
];
const stackGrid = document.getElementById("stackGrid");
if (stackGrid) {
  stack.forEach(([name, ic, color]) => {
    const item = document.createElement("div");
    item.className = "stack-item";
    const icon = document.createElement("div");
    icon.className = "ic";
    icon.style.background = color;
    icon.textContent = ic;
    const label = document.createElement("span");
    label.textContent = name;
    item.append(icon, label);
    stackGrid.appendChild(item);
  });
}

const dsaTopics = [
  ["Arrays", "M3 9h18M9 21V3"],
  ["Linked List", "M4 12h16M4 6h10M4 18h10"],
  ["Stacks", "M6 3h12v18H6z"],
  ["Trees", "M12 2l8 8-8 12-8-12z"],
  [
    "Graphs",
    "M6 6a3 3 0 100 6 3 3 0 000-6zM18 6a3 3 0 100 6 3 3 0 000-6zM12 18a3 3 0 100-6 3 3 0 000 6z",
  ],
  ["Recursion", "M21 12a9 9 0 11-6.22-8.56"],
  ["Sorting", "M4 6h16M4 12h10M4 18h6"],
  ["Searching", "M11 3a8 8 0 105.29 14.03l4.84 4.84"],
  ["Hashing", "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"],
  ["Dynamic Programming", "M3 3v18h18"],
  [
    "Greedy",
    "M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z",
  ],
];
const dsaGrid = document.getElementById("dsaGrid");
if (dsaGrid) {
  const svgNS = "http://www.w3.org/2000/svg";
  dsaTopics.forEach(([name, path]) => {
    const item = document.createElement("div");
    item.className = "dsa-item";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    const p = document.createElementNS(svgNS, "path");
    p.setAttribute("d", path);
    svg.appendChild(p);
    const label = document.createElement("span");
    label.textContent = name;
    item.append(svg, label);
    dsaGrid.appendChild(item);
  });
}

const toolIcons = [
  "NM",
  "BS",
  "MSF",
  "SQL",
  "HC",
  "JTR",
  "WS",
  "GB",
  "FFUF",
  "NC",
];
const ring = document.getElementById("toolsRing");
if (ring) {
  const n = toolIcons.length;
  toolIcons.forEach((t, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const r = 42; // percent radius
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    const div = document.createElement("div");
    div.className = "t-ic";
    div.style.left = `calc(${x}% - 15px)`;
    div.style.top = `calc(${y}% - 15px)`;
    div.textContent = t;
    ring.appendChild(div);
  });
}

/* ============ CASE FILES CAROUSEL ============ */
const cases = [
  {
    title: "Cybersecurity Portfolio Website",
    threat: "Medium",
    desc: "A fully animated hacker-themed portfolio with a live terminal, matrix backdrop, and scroll-triggered GSAP animations.",
    tags: ["HTML", "CSS", "JS", "GSAP"],
  },
  {
    title: "Visitor Management System",
    threat: "High",
    desc: "Role-based visitor approval platform with JWT authentication, security & principal dashboards, and full visitor history.",
    tags: ["React", "Django REST", "SQLite", "JWT"],
  },
  {
    title: "Attendance Management System",
    threat: "Medium",
    desc: "Teacher-based attendance tracking system with secure login, student records, and admin reporting.",
    tags: ["React", "Django", "SQLite"],
  },
  {
    title: "Fake News Detection System",
    threat: "High",
    desc: "AI-powered platform that flags misinformation in real time using NLP and logistic regression, with a browser extension.",
    tags: ["React", "Node.js", "MongoDB", "NLP"],
  },
  {
    title: "HealthAI",
    threat: "Medium",
    desc: "Healthcare assistant that predicts possible conditions and offers guidance through an AI chat interface.",
    tags: ["React", "Flask", "Python", "ML"],
  },
];
let caseIdx = 0;
const caseNum = document.getElementById("caseNum");
const caseTitle = document.getElementById("caseTitle");
const caseDesc = document.getElementById("caseDesc");
const caseTags = document.getElementById("caseTags");
const caseThreat = document.getElementById("caseThreat");
const caseDots = document.getElementById("caseDots");

if (caseDots) {
  cases.forEach((_, i) => {
    const dot = document.createElement("i");
    if (i === 0) dot.classList.add("on");
    caseDots.appendChild(dot);
  });
}

const threatColors = {
  High: ["#ff5c72", "rgba(255,92,114,.4)", "rgba(255,92,114,.08)"],
  Medium: ["#ffb454", "rgba(255,180,84,.4)", "rgba(255,180,84,.08)"],
};

function renderCase() {
  const c = cases[caseIdx];
  if (caseNum) caseNum.textContent = String(caseIdx + 1).padStart(2, "0");
  if (caseTitle) caseTitle.textContent = c.title;
  if (caseDesc) caseDesc.textContent = c.desc;
  if (caseTags) {
    caseTags.innerHTML = "";
    c.tags.forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      caseTags.appendChild(span);
    });
  }
  if (caseThreat) {
    caseThreat.textContent = c.threat;
    const col = threatColors[c.threat];
    if (col) {
      caseThreat.style.color = col[0];
      caseThreat.style.borderColor = col[1];
      caseThreat.style.background = col[2];
    }
  }
  if (caseDots) {
    [...caseDots.children].forEach((d, i) =>
      d.classList.toggle("on", i === caseIdx),
    );
  }
}

const caseNextBtn = document.getElementById("caseNext");
const casePrevBtn = document.getElementById("casePrev");
if (caseNextBtn) {
  caseNextBtn.addEventListener("click", () => {
    caseIdx = (caseIdx + 1) % cases.length;
    renderCase();
  });
}
if (casePrevBtn) {
  casePrevBtn.addEventListener("click", () => {
    caseIdx = (caseIdx - 1 + cases.length) % cases.length;
    renderCase();
  });
}

/* ============ CTF RING ANIMATION ============ */
const ctfCircle = document.getElementById("ctfCircle");
if (ctfCircle) {
  if (gsapReady) {
    ScrollTrigger.create({
      trigger: "#achievements",
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(ctfCircle, {
          strokeDashoffset: 402 * 0.35,
          duration: 1.6,
          ease: "power2.out",
        });
      },
    });
  } else {
    ctfCircle.style.strokeDashoffset = String(402 * 0.35);
  }
}

/* ============ TERMINAL ============
   Security-critical section: the visitor fully controls what they type
   here. Nothing derived from that input is ever written via innerHTML.
   Only the fixed, developer-authored command replies below (which contain
   no interpolated data) use innerHTML. */
const termBody = document.getElementById("termBody");
const termInput = document.getElementById("termInput");

const staticCommandReplies = {
  help: `Available commands:<br><span class="cy">whoami</span> - About me<br><span class="cy">skills</span> - My skills<br><span class="cy">projects</span> - My projects<br><span class="cy">learning</span> - Learning paths<br><span class="cy">resume</span> - Download resume<br><span class="cy">contact</span> - Get in touch<br><span class="cy">clear</span> - Clear terminal`,
  whoami: `<span class="ok">Lal Singh Dharmi</span><br>Cybersecurity Enthusiast · Full Stack Web Developer<br>Chennai, Tamil Nadu, India`,
  skills: `Listing skills...<br><span class="vi">Frontend:</span> HTML5, CSS3, JavaScript, React, Tailwind CSS<br><span class="vi">Backend:</span> Node.js, Express.js, Django<br><span class="vi">Security:</span> Nmap, Burp Suite, Metasploit, Wireshark, SQLMap`,
  learning: `Loading learning paths...<br>TryHackMe (Active) · BTLO (Blue Team) · CTF Practice · Active Directory Labs`,
  resume: `Preparing download link...<br><span class="ok">→ Add your resume file and link it via the "Download Resume" button.</span>`,
  contact: `Opening secure contact gateway...<br>Scroll to the <span class="cy">Contact</span> section or email lalsinghdharmi@example.com`,
};

// "projects" is built dynamically from the (trusted, hard-coded) cases
// array above, using textContent so no injection is possible even if that
// array is edited carelessly in the future.
function printProjectsReply() {
  const wrap = document.createElement("div");
  wrap.appendChild(document.createTextNode("Accessing case files..."));
  cases.forEach((c, i) => {
    wrap.appendChild(document.createElement("br"));
    wrap.appendChild(document.createTextNode(`[${i + 1}] ${c.title}`));
  });
  termBody.appendChild(wrap);
  termBody.scrollTop = termBody.scrollHeight;
}

function printStaticReply(html) {
  const line = document.createElement("div");
  line.innerHTML = html; // safe: fixed strings only, defined above
  termBody.appendChild(line);
  termBody.scrollTop = termBody.scrollHeight;
}

// Echoes the raw command the visitor typed. Built entirely with
// textContent/createElement so it can never execute as markup.
function printEcho(userText) {
  const line = document.createElement("div");
  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = "user@LSD-Portfolio:~$";
  line.append(prompt, document.createTextNode(" " + userText));
  termBody.appendChild(line);
  termBody.scrollTop = termBody.scrollHeight;
}

function printUnknown(userText) {
  const line = document.createElement("div");
  const err = document.createElement("span");
  err.className = "err";
  err.textContent = "command not found:";
  line.append(
    err,
    document.createTextNode(` ${userText}. Type 'help' for options.`),
  );
  termBody.appendChild(line);
  termBody.scrollTop = termBody.scrollHeight;
}

if (termInput && termBody) {
  const MAX_COMMAND_LENGTH = 200; // basic input-length hardening
  termInput.setAttribute("maxlength", String(MAX_COMMAND_LENGTH));

  termInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = termInput.value.trim().slice(0, MAX_COMMAND_LENGTH);
    if (!raw) return;

    printEcho(raw);
    const cmd = raw.toLowerCase();

    if (cmd === "clear") {
      termBody.textContent = "";
    } else if (cmd === "projects") {
      printProjectsReply();
    } else if (
      Object.prototype.hasOwnProperty.call(staticCommandReplies, cmd)
    ) {
      printStaticReply(staticCommandReplies[cmd]);
    } else {
      printUnknown(raw);
    }
    termInput.value = "";
  });
}

/* ============ CONTACT FORM ============
   Security-critical section: validates and bounds all fields before
   building a mailto: link, so no malformed/oversized/malicious input can
   be used to manipulate the outgoing message. */
const contactForm = document.getElementById("contactForm");
const encryptLog = document.getElementById("encryptLog");
const nameInput = document.getElementById("cName");
const emailInput = document.getElementById("cEmail");
const msgInput = document.getElementById("cMsg");
const submitBtn = document.getElementById("contactSubmitBtn");

const FIELD_LIMITS = { name: 100, email: 254, message: 2000 };
// Conservative, widely-used email pattern for client-side sanity checking.
// Real verification always happens server-side / via the mail client;
// this only prevents obviously malformed input from being sent.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || "";
}

function sanitizeControlChars(str) {
  // Strip CR/LF and other control characters to prevent header-style
  // injection into the mailto: subject/body construction.
  return str.replace(/[\r\n\u0000-\u001F\u007F]+/g, " ").trim();
}

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    setFieldError("cNameError", "");
    setFieldError("cEmailError", "");
    setFieldError("cMsgError", "");

    const rawName = sanitizeControlChars(nameInput.value).slice(
      0,
      FIELD_LIMITS.name,
    );
    const rawEmail = sanitizeControlChars(emailInput.value).slice(
      0,
      FIELD_LIMITS.email,
    );
    const rawMsg = msgInput.value
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .slice(0, FIELD_LIMITS.message);

    let valid = true;
    if (!rawName) {
      setFieldError("cNameError", "Please enter your name.");
      valid = false;
    }
    if (!EMAIL_PATTERN.test(rawEmail)) {
      setFieldError("cEmailError", "Please enter a valid email address.");
      valid = false;
    }
    if (!rawMsg.trim()) {
      setFieldError("cMsgError", "Please enter a message.");
      valid = false;
    }
    if (!valid) return;

    if (submitBtn) submitBtn.disabled = true;

    const steps = [
      "Encrypting message...",
      "Generating secure key...",
      "Transmitting data packets...",
      "Delivery successful ✓",
    ];
    encryptLog.innerHTML = ""; // clear, then build with safe DOM nodes
    const stepEls = steps.map((s) => {
      const div = document.createElement("div");
      div.className = "step";
      div.textContent = s;
      encryptLog.appendChild(div);
      return div;
    });

    stepEls.forEach((s, i) => {
      setTimeout(() => {
        s.classList.add("active");
        if (i === steps.length - 1) {
          setTimeout(() => {
            const subject = `Portfolio Contact from ${rawName}`;
            const body = `${rawMsg}\n\nReply to: ${rawEmail}`;
            const mailto =
              "mailto:lalsinghdharmi@example.com" +
              "?subject=" +
              encodeURIComponent(subject) +
              "&body=" +
              encodeURIComponent(body);
            window.location.href = mailto;
            if (submitBtn) submitBtn.disabled = false;
          }, 500);
        }
      }, i * 550);
    });
  });
}
