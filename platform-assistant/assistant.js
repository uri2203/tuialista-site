/* ══════════════════════════════════════════════════════════════════════════
   TuIAlista · Asistente de plataforma — WIDGET DE CHAT (JS vanilla, sin libs)
   ──────────────────────────────────────────────────────────────────────────
   Widget integrable en cualquier pantalla. Dos modos: "client" (portal) y
   "affiliate" (afiliados). Envía las preguntas al motor de IA con el MISMO
   patrón que los agentes (system prompt + contexto fijo + instrucción de
   idioma + historial). Si la IA no está disponible, responde con la base de
   conocimiento local (fallback FAQ) para dar siempre algo útil.

   Uso:
     <script src="../platform-assistant/knowledge_base.js"></script>
     <script src="../platform-assistant/assistant.js"></script>
     <script>TuiaAssistant.init({ mode: "client" });</script>

   Opciones de init():
     mode     "client" | "affiliate"   (por defecto "client")
     apiBase  base del endpoint del motor de IA. "" = mismo origen → /api/assistant
              (en producción, si la API está en otro host, pasar su origen aquí)
     lang     forzar idioma; si se omite, se detecta (localStorage → navegador)
   ══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  var KB = global.TUIA_KB;
  var STORE_KEY = "tuialista_lang"; // misma clave que el resto del sistema
  var API_PATH = "/api/assistant";
  var REQUEST_TIMEOUT = 15000;

  /* ── Detección de idioma ligera (para cambiar según lo que escribe) ─────── */
  var STOPWORDS = {
    es: ["que", "como", "cuanto", "es", "el", "la", "y", "para", "hola", "gracias", "precio", "puedo"],
    en: ["what", "how", "much", "the", "and", "for", "hello", "thanks", "price", "can", "is", "do"],
    pt: ["que", "como", "quanto", "o", "a", "e", "para", "ola", "obrigado", "preco", "posso"],
    fr: ["que", "comment", "combien", "le", "la", "et", "pour", "bonjour", "merci", "prix", "puis"],
    de: ["was", "wie", "viel", "der", "die", "und", "für", "hallo", "danke", "preis", "kann", "ist"],
    it: ["che", "come", "quanto", "il", "la", "e", "per", "ciao", "grazie", "prezzo", "posso"],
  };
  function detectFromText(text) {
    var q = KB.normalize(text);
    var toks = q.split(/\s+/).filter(Boolean);
    if (!toks.length) return null;
    var best = null, bestScore = 0;
    for (var lang in STOPWORDS) {
      if (!STOPWORDS.hasOwnProperty(lang)) continue;
      var score = 0, list = STOPWORDS[lang];
      for (var i = 0; i < list.length; i++) if (toks.indexOf(list[i]) >= 0) score++;
      if (score > bestScore) { bestScore = score; best = lang; }
    }
    return bestScore >= 1 ? best : null;
  }
  function initialLang(forced) {
    if (forced && KB.SUPPORTED.indexOf(forced) >= 0) return forced;
    try {
      var s = localStorage.getItem(STORE_KEY);
      if (s && KB.SUPPORTED.indexOf(s) >= 0) return s;
    } catch (e) {}
    var n = (navigator.language || "en").slice(0, 2).toLowerCase();
    return KB.SUPPORTED.indexOf(n) >= 0 ? n : KB.FALLBACK_LANG;
  }

  /* ── Estilos (inyectados una sola vez, scope bajo #tuia-asst-root) ──────── */
  var CSS = [
    "#tuia-asst-root{",
    "  --s900:#0f1922;--s800:#16242f;--s700:#1f3543;--s600:#2c4a5c;",
    "  --paper:#f5f6f4;--paper2:#eceee9;--ink:#0f1922;--muted:#5a6b73;",
    "  --signal:#e8821e;--signaldim:#c46a12;--line:#d4d8d2;--ok:#1d9e75;",
    "  position:fixed;z-index:2147483000;bottom:0;right:0;",
    "  font-family:'Inter',system-ui,sans-serif;line-height:1.5;",
    "}",
    "#tuia-asst-root *{box-sizing:border-box;margin:0;padding:0}",
    /* Bubble */
    "#tuia-asst-bubble{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;",
    "  background:var(--s900);color:var(--signal);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;",
    "  box-shadow:0 6px 22px rgba(15,25,34,.32);transition:transform .18s ease,background .18s ease}",
    "#tuia-asst-bubble:hover{transform:translateY(-2px) scale(1.04);background:var(--s800)}",
    "#tuia-asst-bubble .ti{font-size:27px}",
    "#tuia-asst-bubble .badge{position:absolute;top:-3px;right:-3px;width:15px;height:15px;border-radius:50%;background:var(--signal);border:2.5px solid var(--paper2)}",
    /* Panel */
    "#tuia-asst-panel{position:fixed;bottom:92px;right:24px;width:382px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 120px);",
    "  background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:0 18px 50px rgba(15,25,34,.28);",
    "  display:none;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px);transition:opacity .2s ease,transform .2s ease}",
    "#tuia-asst-panel.open{display:flex;opacity:1;transform:translateY(0)}",
    /* Header */
    "#tuia-asst-head{background:var(--s900);color:var(--paper);padding:16px 18px;display:flex;align-items:center;gap:12px}",
    "#tuia-asst-head .avatar{width:38px;height:38px;border-radius:10px;background:var(--s700);display:flex;align-items:center;justify-content:center;color:var(--signal);flex-shrink:0}",
    "#tuia-asst-head .avatar .ti{font-size:21px}",
    "#tuia-asst-head .ht{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:15px;letter-spacing:-.01em}",
    "#tuia-asst-head .hs{font-size:11.5px;color:#9fb0b8;display:flex;align-items:center;gap:6px;margin-top:1px}",
    "#tuia-asst-head .hs .dot{width:7px;height:7px;border-radius:50%;background:var(--ok)}",
    "#tuia-asst-head .close{margin-left:auto;background:none;border:none;color:#9fb0b8;cursor:pointer;font-size:20px;display:flex;padding:4px;border-radius:7px;transition:.15s}",
    "#tuia-asst-head .close:hover{background:var(--s700);color:var(--paper)}",
    /* Messages */
    "#tuia-asst-body{flex:1;overflow-y:auto;padding:18px;background:var(--paper2);display:flex;flex-direction:column;gap:12px}",
    ".tuia-msg{max-width:85%;font-size:13.5px;padding:10px 13px;border-radius:13px;white-space:pre-wrap;word-wrap:break-word}",
    ".tuia-msg.bot{background:var(--paper);border:1px solid var(--line);color:var(--ink);align-self:flex-start;border-bottom-left-radius:4px}",
    ".tuia-msg.user{background:var(--s900);color:var(--paper);align-self:flex-end;border-bottom-right-radius:4px}",
    ".tuia-msg .offline{display:block;margin-top:7px;font-size:11px;color:var(--muted);font-style:italic}",
    /* Suggestions */
    "#tuia-asst-sugg{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}",
    ".tuia-chip{font-size:12px;padding:7px 12px;border:1px solid var(--line);background:var(--paper);color:var(--s600);border-radius:20px;cursor:pointer;transition:.15s;font-family:'Inter',sans-serif}",
    ".tuia-chip:hover{border-color:var(--signal);color:var(--signaldim);background:rgba(232,130,30,.06)}",
    /* Typing */
    ".tuia-typing{align-self:flex-start;background:var(--paper);border:1px solid var(--line);border-radius:13px;border-bottom-left-radius:4px;padding:12px 14px;display:flex;gap:4px}",
    ".tuia-typing span{width:7px;height:7px;border-radius:50%;background:var(--muted);opacity:.4;animation:tuiablink 1.2s infinite}",
    ".tuia-typing span:nth-child(2){animation-delay:.2s}.tuia-typing span:nth-child(3){animation-delay:.4s}",
    "@keyframes tuiablink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}",
    /* Input */
    "#tuia-asst-foot{border-top:1px solid var(--line);background:var(--paper);padding:12px 14px}",
    "#tuia-asst-inputrow{display:flex;align-items:flex-end;gap:9px}",
    "#tuia-asst-input{flex:1;resize:none;border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-family:'Inter',sans-serif;font-size:13.5px;color:var(--ink);background:var(--paper);max-height:96px;line-height:1.4;outline:none;transition:.15s}",
    "#tuia-asst-input:focus{border-color:var(--signal);box-shadow:0 0 0 3px rgba(232,130,30,.14)}",
    "#tuia-asst-send{width:40px;height:40px;border-radius:10px;background:var(--signal);color:#1a1206;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.15s}",
    "#tuia-asst-send:hover{background:var(--signaldim)}",
    "#tuia-asst-send:disabled{opacity:.5;cursor:default}",
    "#tuia-asst-send .ti{font-size:19px}",
    "#tuia-asst-powered{text-align:center;font-size:10.5px;color:var(--muted);margin-top:8px;letter-spacing:.02em}",
    "#tuia-asst-powered b{color:var(--signaldim);font-weight:600}",
    /* Responsive */
    "@media(max-width:480px){",
    "  #tuia-asst-panel{right:12px;left:12px;bottom:84px;width:auto;height:calc(100vh - 104px)}",
    "  #tuia-asst-bubble{bottom:16px;right:16px}",
    "}",
  ].join("\n");

  function injectStyle() {
    if (document.getElementById("tuia-asst-style")) return;
    var st = document.createElement("style");
    st.id = "tuia-asst-style";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ── Widget ────────────────────────────────────────────────────────────── */
  function Assistant(opts) {
    opts = opts || {};
    this.mode = opts.mode === "affiliate" ? "affiliate" : "client";
    this.apiBase = (opts.apiBase != null ? opts.apiBase : "").replace(/\/$/, "");
    this.lang = initialLang(opts.lang);
    this.forcedLang = !!opts.lang;
    this.history = [];
    this.open = false;
    this.greeted = false;
    this.busy = false;
    this._build();
  }

  Assistant.prototype._t = function () {
    return KB.getUI(this.lang);
  };

  Assistant.prototype._build = function () {
    injectStyle();
    var self = this;

    var root = document.createElement("div");
    root.id = "tuia-asst-root";
    root.setAttribute("data-mode", this.mode);

    // Bubble
    var bubble = document.createElement("button");
    bubble.id = "tuia-asst-bubble";
    bubble.setAttribute("aria-label", this._t().open);
    bubble.innerHTML = '<i class="ti ti-message-chatbot"></i><span class="badge"></span>';
    bubble.addEventListener("click", function () { self.toggle(); });

    // Panel
    var panel = document.createElement("div");
    panel.id = "tuia-asst-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", this._t().title[this.mode]);
    panel.innerHTML =
      '<div id="tuia-asst-head">' +
        '<div class="avatar"><i class="ti ti-message-chatbot"></i></div>' +
        '<div><div class="ht" id="tuia-asst-title"></div>' +
        '<div class="hs"><span class="dot"></span><span id="tuia-asst-sub"></span></div></div>' +
        '<button class="close" id="tuia-asst-close" aria-label="Close"><i class="ti ti-x"></i></button>' +
      '</div>' +
      '<div id="tuia-asst-body"></div>' +
      '<div id="tuia-asst-foot">' +
        '<div id="tuia-asst-inputrow">' +
          '<textarea id="tuia-asst-input" rows="1"></textarea>' +
          '<button id="tuia-asst-send" aria-label="Send"><i class="ti ti-send"></i></button>' +
        '</div>' +
        '<div id="tuia-asst-powered"></div>' +
      '</div>';

    root.appendChild(bubble);
    root.appendChild(panel);
    document.body.appendChild(root);

    this.el = { root: root, bubble: bubble, panel: panel };
    this.el.body = panel.querySelector("#tuia-asst-body");
    this.el.input = panel.querySelector("#tuia-asst-input");
    this.el.send = panel.querySelector("#tuia-asst-send");

    panel.querySelector("#tuia-asst-close").addEventListener("click", function () { self.toggle(false); });
    this.el.send.addEventListener("click", function () { self._onSend(); });
    this.el.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); self._onSend(); }
    });
    this.el.input.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 96) + "px";
    });

    this._applyLangStatic();
  };

  Assistant.prototype._applyLangStatic = function () {
    var t = this._t();
    this.el.panel.querySelector("#tuia-asst-title").textContent = t.title[this.mode];
    this.el.panel.querySelector("#tuia-asst-sub").textContent = t.subtitle[this.mode];
    this.el.input.setAttribute("placeholder", t.placeholder);
    this.el.panel.querySelector("#tuia-asst-powered").innerHTML =
      '<i class="ti ti-shield-lock" style="font-size:11px"></i> <b>' + t.poweredBy + "</b>";
  };

  Assistant.prototype.toggle = function (force) {
    this.open = typeof force === "boolean" ? force : !this.open;
    this.el.panel.classList.toggle("open", this.open);
    if (this.open) {
      if (!this.greeted) this._greet();
      var self = this;
      setTimeout(function () { self.el.input.focus(); }, 60);
    }
  };

  Assistant.prototype._greet = function () {
    this.greeted = true;
    var t = this._t();
    this._addBot(t.greeting[this.mode]);
    this._renderSuggestions();
  };

  Assistant.prototype._renderSuggestions = function () {
    var self = this, t = this._t();
    var wrap = document.createElement("div");
    wrap.id = "tuia-asst-sugg";
    (t.suggestions[this.mode] || []).forEach(function (s) {
      var chip = document.createElement("button");
      chip.className = "tuia-chip";
      chip.textContent = s;
      chip.addEventListener("click", function () {
        self._removeSuggestions();
        self.el.input.value = s;
        self._onSend();
      });
      wrap.appendChild(chip);
    });
    this.el.body.appendChild(wrap);
    this._scroll();
  };
  Assistant.prototype._removeSuggestions = function () {
    var s = this.el.body.querySelector("#tuia-asst-sugg");
    if (s) s.remove();
  };

  Assistant.prototype._addBot = function (text, offline) {
    var d = document.createElement("div");
    d.className = "tuia-msg bot";
    d.textContent = text;
    if (offline) {
      var o = document.createElement("span");
      o.className = "offline";
      o.textContent = this._t().offline;
      d.appendChild(o);
    }
    this.el.body.appendChild(d);
    this._scroll();
    return d;
  };
  Assistant.prototype._addUser = function (text) {
    var d = document.createElement("div");
    d.className = "tuia-msg user";
    d.textContent = text;
    this.el.body.appendChild(d);
    this._scroll();
  };
  Assistant.prototype._showTyping = function () {
    var d = document.createElement("div");
    d.className = "tuia-typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    this.el.body.appendChild(d);
    this._scroll();
    this._typingEl = d;
  };
  Assistant.prototype._hideTyping = function () {
    if (this._typingEl) { this._typingEl.remove(); this._typingEl = null; }
  };
  Assistant.prototype._scroll = function () {
    var b = this.el.body;
    b.scrollTop = b.scrollHeight;
  };

  Assistant.prototype._onSend = function () {
    var text = (this.el.input.value || "").trim();
    if (!text || this.busy) return;
    this._removeSuggestions();
    this.el.input.value = "";
    this.el.input.style.height = "auto";
    this._addUser(text);

    // Auto-idioma: si el usuario escribe claramente en otro idioma, cambiamos.
    if (!this.forcedLang) {
      var det = detectFromText(text);
      if (det && det !== this.lang) { this.lang = det; this._applyLangStatic(); }
    }

    this._send(text);
  };

  Assistant.prototype._send = function (text) {
    var self = this;
    this.busy = true;
    this.el.send.disabled = true;
    this._showTyping();

    var payload = {
      mode: this.mode,
      message: text,
      lang: this.lang,
      history: this.history.slice(-10),
      // Mismo patrón que los agentes: rol + contexto fijo como system prompt.
      system_prompt: KB.fullSystemPrompt(this.mode),
    };

    var done = function (reply, offline) {
      self._hideTyping();
      self._addBot(reply, offline);
      self.history.push({ role: "user", content: text });
      self.history.push({ role: "assistant", content: reply });
      self.busy = false;
      self.el.send.disabled = false;
      self.el.input.focus();
    };

    // Fallback local: base de conocimiento offline (siempre da algo útil).
    var fallback = function () {
      var r = KB.searchFallback(self.mode, text, self.lang);
      done(r.text, true);
    };

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT);

    fetch(this.apiBase + API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) throw new Error("http " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.ok && data.text) done(data.text, false);
        else fallback();
      })
      .catch(function () {
        clearTimeout(timer);
        fallback();
      });
  };

  /* ── API pública ───────────────────────────────────────────────────────── */
  var _instance = null;
  global.TuiaAssistant = {
    init: function (opts) {
      if (!global.TUIA_KB) {
        console.error("[TuiaAssistant] Falta knowledge_base.js (window.TUIA_KB).");
        return null;
      }
      KB = global.TUIA_KB;
      if (_instance) return _instance;
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () { _instance = new Assistant(opts); });
      } else {
        _instance = new Assistant(opts);
      }
      return _instance;
    },
    open: function () { if (_instance) _instance.toggle(true); },
    close: function () { if (_instance) _instance.toggle(false); },
  };
})(typeof window !== "undefined" ? window : this);
