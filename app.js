/* Rishika's birthday dinner: interactive menu. Builds the pages, runs the animations and the landing-screen play. */
(function () {
  "use strict";

  var C = { red: "#B3123E", pink: "#E24C82", pinkTxt: "#C2306A", teal: "#0E8C8F", mari: "#EFA112", green: "#4D9A3C",
            indigo: "#283A72", ink: "#2B1A17", pinkT: "#FBD3E1", tealT: "#C9ECEB", greenT: "#DCEFD1", mariT: "#FCE6B4" };
  var TINTS = [C.pinkT, C.mariT, C.tealT, C.greenT];
  var PAIRS = [[C.pink, C.pinkT], [C.mari, C.mariT], [C.teal, C.tealT], [C.green, C.greenT]];
  var CONFETTI = [C.pink, C.mari, C.teal, C.green, C.red, "#8E5BB5"];
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ the menu */
  var CHAPTERS = [
    { title: "Starters", sub: "Served at the food stalls", items: [
      { slug: "coffee", name: "Coffee" },
      { slug: "chicken-pakora", name: "Chicken Pakora" },
      { slug: "cheese-balls", name: "Cheese Balls" },
      { slug: "french-fries", name: "French Fries" }
    ] },
    { title: "Dinner", sub: "The birthday feast", items: [
      { slug: "mineral-water", name: "Mineral Water" },
      { slug: "lemon-salt-kasundi", name: "Salt, Lemon & Mustard Sauce" },
      { slug: "salad", name: "Salad" },
      { slug: "topse-fry", name: "Topse Fry", desc: "Crisp-fried mango fish" },
      { slug: "jhuri-aloo-bhaja", name: "Jhuri Aloo Bhaja", desc: "Crispy shoestring potato fry" },
      { slug: "white-rice", name: "Steamed Rice" },
      { slug: "veg-dal", name: "Veg Dal" },
      { slug: "phulkopi-roast", name: "Cauliflower Roast" },
      { slug: "katla-kalia", name: "Katla Kalia", desc: "Katla fish in a rich Bengali gravy" },
      { slug: "basanti-pulao", name: "Basanti Pulao", desc: "Fragrant sweet yellow pulao" },
      { combo: [
        { slug: "mutton-korma", name: "Mutton Korma" },
        { slug: "chicken-kosha", name: "Chicken Kosha" },
        { slug: "katla-kalia-2", name: "Katla Kalia" },
        { slug: "paneer-butter-masala", name: "Paneer Butter Masala" }
      ] },
      { slug: "chutney", name: "Chutney" },
      { slug: "papad", name: "Papad" },
      { slug: "payesh", name: "Payesh", desc: "Bengali rice pudding" },
      { slug: "rasgulla", name: "Rasgulla", desc: "Soft cottage-cheese balls in syrup" },
      { slug: "sandesh", name: "Sandesh", desc: "Classic Bengali milk sweet" },
      { slug: "ice-cream", name: "Ice Cream" },
      { slug: "jowan", name: "Jowan", desc: "Carom seeds, the after-meal digestive" }
    ] }
  ];

  var CATERER = { label: "Hospitality by", name: "Friendship Caterer", sub: "& Event Management",
                  phone: "97756 84208", tel: "+919775684208", fb: "Friendship Caterer", addr: "Deora, Howrah" };
  var RISHIKA = ["img/rishika-1.webp", "img/rishika-2.webp", "img/rishika-3.webp", "img/rishika-4.webp"];

  /* frame shapes in a 100 x 125 box */
  var SHAPES = [
    "M8 121V50A42 42 0 0 1 92 50V121Z",
    "M50 20.5A42 42 0 1 1 49.99 20.5Z",
    "M50 5C77 38 92 60 92 80A42 42 0 0 1 8 80C8 60 23 38 50 5Z",
    "M8 121V60C8 42 28 36 39 24C44 18 47.5 11 50 4C52.5 11 56 18 61 24C72 36 92 42 92 60V121Z"
  ];

  function img(slug) { return "img/" + slug + ".webp"; }
  function words(t) {
    return t.split(" ").map(function (w, i) { return '<span class="w" style="--i:' + i + '">' + w + "</span>"; }).join(" ");
  }

  /* ------------------------------------------------------------ svg helpers */
  function stitch(col, w, dash) {
    return 'fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-dasharray="' + dash + '"';
  }
  function petal(cx, cy, r0, r1, hw, ang) {
    var a = r1 - r0;
    return '<path transform="rotate(' + ang + " " + cx + " " + cy + ')" d="M' + cx + " " + (cy - r0) +
      "C" + (cx - hw) + " " + (cy - r0 - a * .35) + " " + (cx - hw * .7) + " " + (cy - r0 - a * .8) + " " + cx + " " + (cy - r1) +
      "C" + (cx + hw * .7) + " " + (cy - r0 - a * .8) + " " + (cx + hw) + " " + (cy - r0 - a * .35) + " " + cx + " " + (cy - r0) + 'Z"';
  }
  function flower(cx, cy, r, col, fill) {
    var s = "";
    for (var k = 0; k < 6; k++) {
      s += '<ellipse cx="' + cx + '" cy="' + (cy - r * .55) + '" rx="' + (r * .3) + '" ry="' + (r * .45) +
        '" transform="rotate(' + (k * 60) + " " + cx + " " + cy + ')" fill="' + fill + '" stroke="' + col +
        '" stroke-width="1" stroke-dasharray="1.7 1.4" stroke-linecap="round"/>';
    }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * .2) + '" fill="' + C.mari + '"/>';
  }
  function fishSVG(scale) {
    var body = "M0 0C10 -11 30 -13 46 -3L58 -12L55 0L58 12L46 3C30 13 10 11 0 0Z", rows = "";
    for (var i = 0; i < 4; i++) rows += '<path d="M' + (14 + i * 7) + " -8Q" + (17 + i * 7) + " 0 " + (14 + i * 7) + ' 8" ' + stitch(C.pink, 1.2, "1.8 1.6") + "/>";
    return '<g transform="scale(' + (scale || 1) + ')"><path d="' + body + '" fill="' + C.tealT + '"/><path d="M46 -3L58 -12L55 0L58 12L46 3Z" fill="' + C.mari + '"/>' +
      '<path d="' + body + '" ' + stitch(C.teal, 1.3, "3.2 2.3") + "/>" + '<path d="M3 0C12 -6 30 -7 44 -1" ' + stitch(C.mari, 1, "2 2") + "/>" + rows +
      '<circle cx="8" cy="-2.5" r="1.8" fill="' + C.indigo + '"/></g>';
  }

  /* ------------------------------------------------------------ landing: medallion with Rishika's photos */
  function buildIntro() {
    var cx = 100, cy = 100, r = 62, s = "", p = "";
    s += '<circle cx="100" cy="100" r="' + (r + 34) + '" fill="' + C.mariT + '" opacity=".55"/>';
    for (var k = 0; k < 16; k++) {
      var pr = PAIRS[k % 4];
      p += '<g class="petal" style="--i:' + k + '">' + petal(cx, cy, r + 4, r + 28, 10.5, k * 22.5) + ' fill="' + pr[1] + '" stroke="' + pr[0] +
        '" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="3.2 2.3"/></g>';
    }
    for (k = 0; k < 16; k++) p += '<g class="petal" style="--i:' + (k + 3) + '">' + petal(cx, cy, r + 4, r + 15, 4.6, k * 22.5 + 11.25) + ' fill="' + C.red + '" opacity=".85"/></g>';
    s += '<g class="petals" id="petals">' + p + "</g>";
    s += '<circle class="ring" cx="100" cy="100" r="' + (r + 32) + '" fill="none" stroke="' + C.red + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 4.6"/>';
    s += '<g class="face"><clipPath id="faceClip"><circle cx="100" cy="100" r="' + r + '"/></clipPath>';
    s += '<circle cx="100" cy="100" r="' + (r + 3) + '" fill="#fff" stroke="' + C.teal + '" stroke-width="1.4" stroke-dasharray="3 2.2" stroke-linecap="round"/>';
    s += '<g clip-path="url(#faceClip)">' + RISHIKA.map(function (src, i) {
      return '<image class="pic' + (i === 0 ? " on" : "") + '" href="' + (i === 0 ? src : "") + '" data-src="' + src + '" x="' + (cx - r) + '" y="' + (cy - r) + '" width="' + (2 * r) + '" height="' + (2 * r) + '" preserveAspectRatio="xMidYMid slice"/>';
    }).join("") + "</g></g>";
    s += '<g class="badge"><circle cx="166" cy="164" r="20" fill="' + C.pinkTxt + '"/><circle cx="166" cy="164" r="16" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2 1.6" opacity=".8"/>' +
      '<text x="166" y="172.5" text-anchor="middle" font-family="DM Serif" font-size="24" fill="#fff">6</text></g>';
    document.getElementById("medal").innerHTML = '<svg viewBox="0 0 200 200" aria-hidden="true">' + s + "</svg>";
    document.getElementById("dots").innerHTML = RISHIKA.map(function (_, i) { return "<i" + (i === 0 ? ' class="on"' : "") + "></i>"; }).join("");
    var fish = document.querySelectorAll(".intro .fish");
    for (var i = 0; i < fish.length; i++) fish[i].innerHTML = fishSVG(1);
  }

  /* ------------------------------------------------------------ confetti (canvas) */
  var cv, cx2d, parts = [], raf = 0;
  function sizeCanvas() {
    var host = document.getElementById("intro"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = host.clientWidth * dpr; cv.height = host.clientHeight * dpr;
    cx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function burst(x, y, n, power) {
    if (REDUCED) return;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = (Math.random() * .7 + .3) * (power || 9);
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (power || 9) * .45, g: .32 + Math.random() * .12,
        s: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: CONFETTI[i % CONFETTI.length],
        shape: i % 3, life: 70 + Math.random() * 40 });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    cx2d.clearRect(0, 0, cv.width, cv.height);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.vx *= .985; p.vy = p.vy * .985 + p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      cx2d.save(); cx2d.globalAlpha = Math.min(1, p.life / 25); cx2d.translate(p.x, p.y); cx2d.rotate(p.r); cx2d.fillStyle = p.c;
      if (p.shape === 0) cx2d.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      else if (p.shape === 1) { cx2d.beginPath(); cx2d.arc(0, 0, p.s / 2.6, 0, 6.283); cx2d.fill(); }
      else { cx2d.beginPath(); cx2d.moveTo(0, -p.s / 2); cx2d.lineTo(p.s / 2, p.s / 2); cx2d.lineTo(-p.s / 2, p.s / 2); cx2d.fill(); }
      cx2d.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
  }
  function burstAt(el, n, power) {
    var host = document.getElementById("intro").getBoundingClientRect(), r = el.getBoundingClientRect();
    burst(r.left + r.width / 2 - host.left, r.top + r.height / 2 - host.top, n, power);
  }

  /* ------------------------------------------------------------ balloons */
  var balloonTimer = null, bCount = 0;
  function balloonSVG(col, light) {
    var id = "bg" + (bCount++);
    return '<svg viewBox="0 0 40 70"><defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="' + light +
      '"/><stop offset=".55" stop-color="' + col + '"/><stop offset="1" stop-color="' + col + '"/></radialGradient></defs>' +
      '<path d="M20 46q4 6 0 12t0 12" fill="none" stroke="#B89A6A" stroke-width=".9"/>' +
      '<ellipse cx="20" cy="22" rx="17" ry="21" fill="url(#' + id + ')"/>' +
      '<ellipse cx="20" cy="22" rx="14" ry="18" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".9" stroke-dasharray="2.4 2"/>' +
      '<path d="M17 45l3-3 3 3z" fill="' + col + '"/><ellipse cx="13" cy="13" rx="3.4" ry="5.2" fill="#fff" opacity=".5" transform="rotate(-25 13 13)"/></svg>';
  }
  function spawnBalloon() {
    var layer = document.getElementById("balloons"), pair = PAIRS[Math.floor(Math.random() * 4)];
    var b = document.createElement("div");
    b.className = "balloon";
    var w = 36 + Math.random() * 20;
    // mostly along the edges so the title stays readable; now and then one rises through the middle
    var r = Math.random(), x = r < .4 ? 2 + Math.random() * 16 : r < .8 ? 72 + Math.random() * 16 : 20 + Math.random() * 50;
    b.style.cssText = "left:" + x + "%;--w:" + w + "px;--t:" + (6.5 + Math.random() * 3.5) + "s";
    b.innerHTML = balloonSVG(pair[0], "#fff");
    b.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      if (b.classList.contains("popped")) return;
      b.classList.add("popped");
      burstAt(b, 26, 7);
      if (navigator.vibrate) navigator.vibrate(12);
      setTimeout(function () { b.remove(); }, 220);
    });
    b.addEventListener("animationend", function (e) { if (e.animationName === "float") b.remove(); });
    layer.appendChild(b);
  }
  function startBalloons() {
    if (REDUCED || balloonTimer) return;
    spawnBalloon();
    balloonTimer = setInterval(function () { if (document.querySelectorAll(".balloon").length < 7) spawnBalloon(); }, 1100);
  }
  function stopBalloons() { clearInterval(balloonTimer); balloonTimer = null; }

  /* ------------------------------------------------------------ photo carousel in the medallion */
  var picIdx = 0, picTimer = null, spin = 0;
  function showPic(i, fromTap) {
    var pics = document.querySelectorAll(".medal .pic"), dots = document.querySelectorAll("#dots i");
    picIdx = (i + pics.length) % pics.length;
    var im = pics[picIdx];
    if (!im.getAttribute("href")) im.setAttribute("href", im.getAttribute("data-src"));
    for (var k = 0; k < pics.length; k++) { pics[k].classList.toggle("on", k === picIdx); dots[k].classList.toggle("on", k === picIdx); }
    spin += 45;
    document.getElementById("petals").style.transform = "rotate(" + spin + "deg)";
    if (fromTap) {
      var m = document.getElementById("medal");
      m.classList.remove("tap"); void m.offsetWidth; m.classList.add("tap");
      burstAt(m, 40, 10);
    }
  }
  function startPics() { stopPics(); if (!REDUCED) picTimer = setInterval(function () { showPic(picIdx + 1); }, 3200); }
  function stopPics() { clearInterval(picTimer); picTimer = null; }

  /* ------------------------------------------------------------ page builders */
  var pages = [], uid = 0;

  function driftBits(seed) {
    var out = "", cols = [C.pink, C.teal, C.mari, C.green];
    for (var i = 0; i < 6; i++) {
      var x = (seed * 37 + i * 61) % 88 + 4, y = (seed * 23 + i * 47) % 70 + 22, c = cols[(seed + i) % 4];
      var t = 6 + (i % 3) * 2, dl = (i * 1.1) % 5, sz = 10 + (i % 3) * 4;
      var inner = i % 2 ? '<svg viewBox="0 0 12 12" width="' + (sz - 2) + '" height="' + (sz - 2) + '"><path d="M2 2L10 10M10 2L2 10" stroke="' + c + '" stroke-width="2" stroke-linecap="round"/></svg>'
                        : '<svg viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '">' + flower(12, 12, 10, c, "#fff") + "</svg>";
      out += '<span class="drift" style="left:' + x + "%;top:" + y + "%;--t:" + t + "s;--dl:" + dl + 's">' + inner + "</span>";
    }
    return out;
  }

  function frameSVG(shape, photos, tint, lineCol, dotCol) {
    var id = "f" + (uid++);
    var imgs = photos.map(function (p, i) {
      return '<g class="kb photo' + (i === 0 ? " on" : "") + '"><image data-src="' + img(p.slug) + '" x="0" y="0" width="100" height="125" preserveAspectRatio="xMidYMid slice"><title>' + p.name + "</title></image></g>";
    }).join("");
    var ring = function (sc) { return 'transform="translate(50 62.5) scale(' + sc + ') translate(-50 -62.5)"'; };
    return '<svg viewBox="0 0 100 125" role="img" aria-label="' + photos.map(function (p) { return p.name; }).join(", ") + '">' +
      '<defs><clipPath id="c' + id + '"><path d="' + shape + '"/></clipPath>' +
      '<mask id="m' + id + '" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="165">' +
      "<g " + ring(1.075) + '><path class="sew" pathLength="100" d="' + shape + '" fill="none" stroke="#fff" stroke-width="8"/></g>' +
      "<g " + ring(1.15) + '><path class="sew" pathLength="100" d="' + shape + '" fill="none" stroke="#fff" stroke-width="8"/></g></mask></defs>' +
      '<path d="' + shape + '" fill="' + tint + '"/>' +
      '<g clip-path="url(#c' + id + ')">' + imgs + "</g>" +
      '<path d="' + shape + '" fill="none" stroke="#fff" stroke-width="1.4"/>' +
      '<g mask="url(#m' + id + ')">' +
      "<g " + ring(1.075) + '><path d="' + shape + '" ' + stitch(lineCol, 1.1, "2.6 1.9") + "/></g>" +
      "<g " + ring(1.15) + '><path d="' + shape + '" fill="none" stroke="' + dotCol + '" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.1 3.2"/></g>' +
      "</g></svg>";
  }

  function nextCue() {
    return '<div class="next" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" fill="none" stroke="#2B1A17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  }

  function chapterPage(ch, idx) {
    var el = document.createElement("section");
    el.className = "screen chapter";
    el.setAttribute("aria-label", ch.title);
    el.style.setProperty("--tint", idx === 0 ? C.tealT : C.pinkT);
    var ring = "";
    for (var k = 0; k < 24; k++) {
      ring += '<circle cx="' + (100 + 92 * Math.cos(k * Math.PI / 12)).toFixed(1) + '" cy="' + (100 + 92 * Math.sin(k * Math.PI / 12)).toFixed(1) + '" r="2.2" fill="' + PAIRS[k % 4][0] + '"/>';
    }
    el.innerHTML = '<div class="orbit"><svg viewBox="0 0 200 200" aria-hidden="true">' +
      '<circle cx="100" cy="100" r="76" fill="#FFFDF8" stroke="' + C.teal + '" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="3.4 2.4"/>' +
      '<circle cx="100" cy="100" r="68" ' + stitch(C.pink, 1.1, "2.4 2") + "/>" + ring +
      '<g class="swim"><g transform="translate(100 12)">' + fishSVG(.62) + '</g><g transform="translate(100 188) rotate(180)">' + fishSVG(.62) + "</g></g>" +
      '</svg><span class="word">' + ch.title + "</span></div>" +
      '<p class="sub">' + ch.sub + "</p>" + driftBits(idx + 3) + nextCue();
    return el;
  }

  function dishPage(item, k) {
    var el = document.createElement("section");
    var combo = !!item.combo, photos = combo ? item.combo : [item];
    var pair = PAIRS[k % 4], pair2 = PAIRS[(k + 2) % 4];
    el.className = "screen dish" + (combo ? " combo" : "");
    el.setAttribute("aria-label", photos.map(function (p) { return p.name; }).join(", "));
    el.style.setProperty("--tint", TINTS[k % 4]);
    var html = '<div class="frame">' + frameSVG(SHAPES[k % 4], photos, pair[1], pair[0], pair2[0]) +
      '<svg class="flower" viewBox="0 0 24 24" aria-hidden="true">' + flower(12, 12, 11, pair2[0], "#fff") + "</svg></div>";
    if (combo) {
      html += '<ul class="combo-names">' + photos.map(function (p, i) { return '<li style="--i:' + i + '"' + (i === 0 ? ' class="on"' : "") + ">" + p.name + "</li>"; }).join("") + "</ul>";
    } else {
      html += '<h2 class="name">' + words(item.name) + "</h2>" + (item.desc ? '<p class="desc">' + item.desc + "</p>" : "");
    }
    el.innerHTML = html + driftBits(k + 1) + nextCue();
    return el;
  }

  function endPage() {
    var el = document.createElement("section");
    el.className = "screen end";
    el.setAttribute("aria-label", "Thank you");
    el.innerHTML = '<div class="thanks">Thank You</div>' +
      '<div class="host"><div class="lbl">' + CATERER.label + '</div><div class="cn">' + CATERER.name + '</div><div class="cs">' + CATERER.sub + "</div>" +
      '<div class="rows">' +
      '<a href="tel:' + CATERER.tel + '"><svg viewBox="0 0 24 24"><path fill="' + C.indigo + '" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>' + CATERER.phone + "</a>" +
      '<span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="' + C.indigo + '"/><path d="M11.2 16.5v-5.6h1.9l.3-2.2h-2.2V7.3c0-.6.2-1.1 1.1-1.1h1.2V4.3c-.2 0-.9-.1-1.7-.1-1.7 0-2.9 1-2.9 2.9v1.6H7v2.2h1.9v5.6z" fill="#fff"/></svg>' + CATERER.fb + "</span>" +
      '<span><svg viewBox="0 0 20 20"><path d="M10 19C7.5 15 3 11.5 3 7.8A7 7 0 1 1 17 7.8C17 11.5 12.5 15 10 19Z" fill="none" stroke="' + C.indigo + '" stroke-width="1.8"/><circle cx="10" cy="7.8" r="2.6" fill="' + C.indigo + '"/></svg>' + CATERER.addr + "</span>" +
      "</div></div>" +
      '<button class="again" type="button" id="again"><svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" fill="none" stroke="#C2306A" stroke-width="2.2" stroke-linecap="round"/></svg>Back to the start</button>' +
      driftBits(9);
    return el;
  }

  /* ------------------------------------------------------------ build */
  function build() {
    buildIntro();
    var reel = document.getElementById("reel"), k = 0;
    pages.push({ el: document.getElementById("intro"), type: "intro" });
    CHAPTERS.forEach(function (ch, ci) {
      var cp = chapterPage(ch, ci);
      reel.appendChild(cp);
      pages.push({ el: cp, type: "chapter", chapter: ch.title });
      ch.items.forEach(function (it, i) {
        var dp = dishPage(it, k++);
        reel.appendChild(dp);
        pages.push({ el: dp, type: "dish", chapter: ch.title, n: i + 1, total: ch.items.length, item: it });
      });
    });
    var ep = endPage();
    reel.appendChild(ep);
    pages.push({ el: ep, type: "end" });
    buildList();
  }

  function buildList() {
    var body = "";
    CHAPTERS.forEach(function (ch) {
      body += "<h3>" + ch.title + "</h3><ul>";
      ch.items.forEach(function (it) {
        var p = it.combo ? it.combo : [it];
        body += '<li><button class="item" type="button" data-slug="' + p[0].slug + '"><img alt="" loading="lazy" src="' + img(p[0].slug) + '"><span>' +
          p.map(function (x) { return x.name; }).join(" / ") + '</span><span class="arrow">›</span></button></li>';
      });
      body += "</ul>";
    });
    document.getElementById("listBody").innerHTML = body;
  }

  /* ------------------------------------------------------------ behaviour */
  var reel, active = -1, comboTimer = null, greeted = false;

  function loadAround(i) {
    for (var j = Math.max(0, i - 1); j <= Math.min(pages.length - 1, i + 2); j++) {
      var ims = pages[j].el.querySelectorAll(".frame image[data-src]");
      for (var q = 0; q < ims.length; q++) { ims[q].setAttribute("href", ims[q].getAttribute("data-src")); ims[q].removeAttribute("data-src"); }
    }
  }

  function startCombo(el) {
    var photos = el.querySelectorAll(".photo"), names = el.querySelectorAll(".combo-names li"), n = 0;
    function show(i) { for (var j = 0; j < photos.length; j++) { photos[j].classList.toggle("on", j === i); names[j].classList.toggle("on", j === i); } }
    show(0);
    comboTimer = setInterval(function () { n = (n + 1) % photos.length; show(n); }, 2000);
  }

  function setActive(i) {
    if (i === active) return;
    if (active >= 0) pages[active].el.classList.remove("is-active");
    active = i;
    var pg = pages[i];
    pg.el.classList.add("is-active");
    loadAround(i);
    clearInterval(comboTimer);
    if (pg.el.classList.contains("combo")) startCombo(pg.el);
    if (pg.type === "intro") {
      startBalloons(); startPics();
      if (!greeted) { greeted = true; setTimeout(function () { burstAt(document.getElementById("medal"), 70, 12); }, 650); }
    } else { stopBalloons(); stopPics(); }
    document.body.classList.toggle("in-menu", pg.type === "dish" || pg.type === "chapter");
    if (pg.chapter) document.getElementById("chip").textContent = pg.chapter;
    document.getElementById("count").textContent = pg.type === "dish" ? pg.n + " / " + pg.total : "";
    var dishIdx = pages.filter(function (p, j) { return p.type === "dish" && j <= i; }).length;
    var allDish = pages.filter(function (p) { return p.type === "dish"; }).length;
    document.querySelector(".thread i").style.setProperty("--p", (100 * dishIdx / allDish).toFixed(1) + "%");
  }

  function goTo(i, smooth) { reel.scrollTo({ top: pages[i].el.offsetTop, behavior: smooth === false ? "auto" : "smooth" }); }

  function sheet(id, open) {
    var s = document.getElementById(id);
    s.classList.toggle("open", open);
    s.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function wire() {
    reel = document.getElementById("reel");
    cv = document.getElementById("confetti"); cx2d = cv.getContext("2d");
    sizeCanvas(); window.addEventListener("resize", sizeCanvas);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= .6) setActive(pages.findIndex(function (p) { return p.el === e.target; }));
      });
    }, { root: reel, threshold: [.6] });
    pages.forEach(function (p) { io.observe(p.el); });
    var m = /^#p(\d+)$/.exec(location.hash);
    var start = m ? Math.min(+m[1], pages.length - 1) : 0;
    setActive(start);
    if (start) goTo(start, false);

    document.getElementById("medal").addEventListener("click", function () { showPic(picIdx + 1, true); startPics(); });
    document.getElementById("cta").addEventListener("click", function () { goTo(1); });
    document.getElementById("listBtn").addEventListener("click", function () { sheet("listSheet", true); });
    document.getElementById("listBody").addEventListener("click", function (e) {
      var b = e.target.closest(".item");
      if (!b) return;
      var slug = b.getAttribute("data-slug");
      var i = pages.findIndex(function (p) { return p.item && (p.item.slug === slug || (p.item.combo && p.item.combo[0].slug === slug)); });
      sheet("listSheet", false);
      if (i >= 0) setTimeout(function () { goTo(i, false); }, 200);
    });
    document.getElementById("again").addEventListener("click", function () { goTo(0); });
    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", function () { sheet("listSheet", false); });
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stopBalloons(); stopPics(); } else if (active === 0) { startBalloons(); startPics(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") sheet("listSheet", false);
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goTo(Math.min(active + 1, pages.length - 1)); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); goTo(Math.max(active - 1, 0)); }
    });
  }

  build();
  wire();
})();
