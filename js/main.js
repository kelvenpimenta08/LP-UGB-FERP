/* =============================================================
   MEDICINA UGB/FERP · Lógica da Landing Page
   Formulário, validação, WhatsApp, tracking e Google Sheets
   ============================================================= */
(function () {
  "use strict";
  var CFG = window.LP_CONFIG || {};

  /* ---------- Rastreamento (GTM / Meta Pixel / GA4) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    params = params || {};
    // Google Tag Manager / GA4 dataLayer
    try { window.dataLayer.push(Object.assign({ event: event }, params)); } catch (e) {}
    // Meta Pixel
    try {
      if (typeof window.fbq === "function") {
        var map = { generate_lead: "Lead", whatsapp_click: "Contact", view_content: "ViewContent" };
        window.fbq("track", map[event] || "CustomEvent", params);
      }
    } catch (e) {}
    // GA4 direto (gtag), se existir
    try { if (typeof window.gtag === "function") window.gtag("event", event, params); } catch (e) {}
  }
  window.lpTrack = track;

  // Evento de visualização de página (conteúdo)
  track("view_content", { content_name: "LP Medicina UGB", page_location: location.href });

  /* ---------- Captura de UTMs / origem ---------- */
  function getUTMs() {
    var p = new URLSearchParams(location.search), o = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"]
      .forEach(function (k) { if (p.get(k)) o[k] = p.get(k); });
    return o;
  }

  /* ---------- WhatsApp ---------- */
  function waLink(customMsg) {
    var num = (CFG.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    var msg = encodeURIComponent(customMsg || CFG.WHATSAPP_MESSAGE || "Olá! Tenho interesse no curso de Medicina.");
    return "https://wa.me/" + num + "?text=" + msg;
  }
  function bindWhatsApp() {
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      el.setAttribute("href", waLink(el.getAttribute("data-wa-msg") || ""));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.addEventListener("click", function () {
        track("whatsapp_click", { location: el.getAttribute("data-loc") || "geral" });
      });
    });
  }

  /* ---------- Máscara de telefone BR ---------- */
  function maskPhone(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 2) return v.length ? "(" + v : v;
    if (v.length <= 6) return "(" + v.slice(0, 2) + ") " + v.slice(2);
    if (v.length <= 10) return "(" + v.slice(0, 2) + ") " + v.slice(2, 6) + "-" + v.slice(6);
    return "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
  }

  /* ---------- Validação ---------- */
  function setError(field, on) {
    var wrap = field.closest(".field");
    if (wrap) wrap.classList.toggle("invalid", !!on);
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function validPhone(v) { return v.replace(/\D/g, "").length >= 10; }

  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (el) {
      var v = (el.value || "").trim(), good = !!v;
      if (el.type === "email") good = good && validEmail(v);
      if (el.name === "telefone") good = good && validPhone(v);
      if (el.type === "checkbox") good = el.checked;
      setError(el, !good);
      if (!good && ok) el.focus();
      if (!good) ok = false;
    });
    return ok;
  }

  /* ---------- Envio ---------- */
  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (val, key) { data[key] = val; });
    delete data.consent;
    Object.assign(data, getUTMs());
    data.pagina = location.href;
    data.enviado_em = new Date().toISOString();
    return data;
  }

  function saveLocal(data) {
    try {
      var k = "ugb_leads", arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push(data); localStorage.setItem(k, JSON.stringify(arr));
    } catch (e) {}
  }

  function sendToSheets(data) {
    if (!CFG.LEADS_ENDPOINT) return Promise.resolve({ demo: true });
    // Apps Script aceita POST simples (text/plain evita preflight CORS)
    return fetch(CFG.LEADS_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return { ok: true }; }); });
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    if (!validate(form)) return;

    var btn = form.querySelector(".btn-submit");
    btn.classList.add("loading"); btn.disabled = true;

    var data = serialize(form);
    saveLocal(data);

    var done = function () {
      track("generate_lead", {
        currency: "BRL", value: 1,
        interesse: data.interesse || "", cidade: data.cidade || ""
      });
      // Sucesso visual
      var card = form.closest(".form-card") || form.parentElement;
      var success = document.getElementById("formSuccess");
      form.style.display = "none";
      if (success) {
        success.classList.add("show");
        var waBtn = success.querySelector("[data-whatsapp]");
        if (waBtn) {
          var nome = (data.nome || "").split(" ")[0];
          waBtn.setAttribute("href", waLink(
            "Olá! Sou " + (data.nome || "") + " e acabei de me inscrever pela LP de Medicina do UGB/FERP. " +
            "Meu interesse é: " + (data.interesse || "Mais informações") + "."));
        }
      }
      if (CFG.OPEN_WHATSAPP_AFTER_SUBMIT) {
        var nome2 = data.nome || "";
        setTimeout(function () {
          window.open(waLink("Olá! Sou " + nome2 + " e me inscrevi pela LP de Medicina do UGB/FERP. Interesse: " +
            (data.interesse || "Mais informações") + "."), "_blank");
        }, 900);
      }
    };

    sendToSheets(data)
      .then(done)
      .catch(function () { done(); }) // mesmo se o endpoint falhar, o lead fica salvo localmente
      .finally(function () { btn.classList.remove("loading"); btn.disabled = false; });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Contadores nas estatísticas ---------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute("data-count")),
          suffix = el.getAttribute("data-suffix") || "", dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var val = Math.floor(p * target);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
        }
        requestAnimationFrame(step); io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Navegação mobile ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle"),
      links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () { links.classList.toggle("open"); });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { links.classList.remove("open"); });
      });
    }
    // CTAs internos que levam ao formulário
    document.querySelectorAll('[data-scroll="form"]').forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById("inscricao");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        var first = document.querySelector("#leadForm input[name=nome]");
        if (first) setTimeout(function () { first.focus(); }, 500);
      });
    });
  }

  /* ---------- Barra fixa mobile: aparece só ao rolar além do topo ---------- */
  function initStickyCTA() {
    var hero = document.getElementById("topo");
    if (!hero) return;
    if (!("IntersectionObserver" in window)) { document.body.classList.add("cta-visible"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        // topo visível => esconde a barra; topo fora da tela => mostra
        document.body.classList.toggle("cta-visible", !en.isIntersecting);
      });
    }, { threshold: 0, rootMargin: "0px 0px -40% 0px" });
    io.observe(hero);
  }

  /* ---------- Conteúdo editável (config.js -> LP_CONTENT) ---------- */
  function applyContent() {
    var C = window.LP_CONTENT || {};
    // Banners do carrossel
    if (C.BANNERS && C.BANNERS.length) {
      var imgs = document.querySelectorAll(".promo-banner img");
      C.BANNERS.forEach(function (src, i) { if (imgs[i] && src) imgs[i].setAttribute("src", src); });
    }
    // Cards de financiamento (título + texto)
    if (C.FINANCIAMENTO) {
      var cards = document.querySelectorAll("#bolsas .glass-card");
      C.FINANCIAMENTO.forEach(function (item, i) {
        var c = cards[i]; if (!c) return;
        var h = c.querySelector("h3"), p = c.querySelector("p");
        if (h && item.titulo != null) h.textContent = item.titulo;
        if (p && item.texto != null) p.innerHTML = item.texto;
      });
    }
    // Depoimentos (frase, nome, papel)
    if (C.DEPOIMENTOS) {
      var tc = document.querySelectorAll("#depoimentos .tcard");
      C.DEPOIMENTOS.forEach(function (d, i) {
        var c = tc[i]; if (!c) return;
        var p = c.querySelector("p"), b = c.querySelector(".who b"), s = c.querySelector(".who small");
        if (p && d.texto != null) p.textContent = d.texto;
        if (b && d.nome != null) b.textContent = d.nome;
        if (s && d.papel != null) s.textContent = d.papel;
      });
    }
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyContent();
    bindWhatsApp();
    initReveal();
    initCounters();
    initNav();
    initStickyCTA();

    var phone = document.querySelector('input[name="telefone"]');
    if (phone) phone.addEventListener("input", function () { this.value = maskPhone(this.value); });

    // limpar erro ao digitar
    document.querySelectorAll("#leadForm [required]").forEach(function (el) {
      el.addEventListener("input", function () { setError(el, false); });
      el.addEventListener("change", function () { setError(el, false); });
    });

    var form = document.getElementById("leadForm");
    if (form) form.addEventListener("submit", handleSubmit);

    // Ano no rodapé
    var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
  });
})();
