/*
 * TuIAlista — módulo de compra compartido (landing, /catalogo, /gracias, portal).
 *
 *  - Captura el ?ref=CÓDIGO de afiliado y lo guarda en localStorage (30 días) para
 *    atribuir la compra aunque el visitante pague minutos u horas después.
 *  - TuiaCheckout.open(agentId, agentName, priceUsd, prefillEmail?) abre un modal que
 *    pide el correo + aceptación legal, llama POST /api/checkout (provider: stripe) y
 *    redirige a la página de pago (checkout_url).
 *
 * Autocontenido: inyecta su propio CSS/DOM, no depende del CSS de la página. es/en.
 */
(function () {
  var API = (window.CHECKOUT_API_BASE || "https://tuialista-xrtd.onrender.com").replace(/\/$/, "");
  var REF_KEY = "tuialista_ref";
  var REF_TS_KEY = "tuialista_ref_ts";
  var REF_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

  // ── Captura/lectura del código de referido ────────────────────────────────
  try {
    var q = new URLSearchParams(location.search);
    var incoming = (q.get("ref") || "").trim();
    if (incoming) {
      localStorage.setItem(REF_KEY, incoming);
      localStorage.setItem(REF_TS_KEY, String(Date.now()));
    }
  } catch (e) { /* sin localStorage: no pasa nada */ }

  function storedRef() {
    try {
      var ts = parseInt(localStorage.getItem(REF_TS_KEY) || "0", 10);
      if (ts && (Date.now() - ts) > REF_TTL_MS) {
        localStorage.removeItem(REF_KEY); localStorage.removeItem(REF_TS_KEY);
        return "";
      }
      return localStorage.getItem(REF_KEY) || "";
    } catch (e) { return ""; }
  }

  function isEN() {
    try { return (localStorage.getItem("tuialista_lang") || "es").indexOf("en") === 0; }
    catch (e) { return false; }
  }

  function T() {
    var en = isEN();
    return {
      title: en ? "Start your subscription" : "Empieza tu suscripción",
      sub: en ? "7-day free trial. Cancel anytime from your portal."
              : "7 días de prueba gratis. Cancela cuando quieras desde tu panel.",
      emailLbl: en ? "Your email" : "Tu correo",
      emailPh: en ? "you@company.com" : "tu@empresa.com",
      legal: en
        ? 'I accept the <a href="/legal/terminos" target="_blank" rel="noopener">Terms</a>, the <a href="/legal/privacidad" target="_blank" rel="noopener">Privacy Notice</a> and the <a href="/legal/deslinde-ia" target="_blank" rel="noopener">AI Disclaimer</a>.'
        : 'Acepto los <a href="/legal/terminos" target="_blank" rel="noopener">Términos</a>, el <a href="/legal/privacidad" target="_blank" rel="noopener">Aviso de Privacidad</a> y el <a href="/legal/deslinde-ia" target="_blank" rel="noopener">Deslinde de IA</a>.',
      pay: en ? "Continue to payment" : "Continuar al pago",
      wait: en ? "Redirecting…" : "Redirigiendo…",
      cancel: en ? "Cancel" : "Cancelar",
      refNote: en ? "Referred by" : "Referido por",
      errEmail: en ? "Enter a valid email." : "Escribe un correo válido.",
      errLegal: en ? "You must accept the terms." : "Debes aceptar los términos.",
      errAgent: en ? "That agent is not available." : "Ese agente no está disponible.",
      errProvider: en ? "Payments are not enabled yet. Try again shortly."
                      : "Los pagos aún no están habilitados. Inténtalo en un momento.",
      errNet: en ? "Connection error. Try again." : "Error de conexión. Inténtalo de nuevo.",
      errGeneric: en ? "Something went wrong. Try again." : "Algo salió mal. Inténtalo de nuevo."
    };
  }

  function errFor(code, t) {
    return ({
      legal_not_accepted: t.errLegal,
      agent_not_found: t.errAgent,
      unknown_provider: t.errProvider,
      payment_provider_not_configured: t.errProvider,
      checkout_no_soportado: t.errProvider,
      price_mismatch: t.errGeneric,
      acceptance_not_recorded: t.errGeneric,
      checkout_failed: t.errGeneric
    })[code] || t.errGeneric;
  }

  // ── CSS (una vez) ─────────────────────────────────────────────────────────
  function injectCss() {
    if (document.getElementById("tuia-co-css")) return;
    var css = document.createElement("style");
    css.id = "tuia-co-css";
    css.textContent = [
      "#tuia-co{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(15,25,34,.55);font-family:'Inter',system-ui,-apple-system,sans-serif}",
      "#tuia-co.on{display:flex}",
      "#tuia-co .box{background:#fff;border-radius:16px;max-width:420px;width:100%;padding:26px;box-shadow:0 30px 70px -24px rgba(15,25,34,.6);color:#0f1922}",
      "#tuia-co h3{font-family:'Space Grotesk',sans-serif;font-size:20px;margin:0 0 4px}",
      "#tuia-co .sub{color:#5a6b73;font-size:13.5px;margin:0 0 18px}",
      "#tuia-co .agent{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#f5f6f4;border:1px solid #e2e6df;border-radius:10px;padding:11px 14px;margin-bottom:16px}",
      "#tuia-co .agent .n{font-weight:600;font-size:14.5px}",
      "#tuia-co .agent .p{font-family:'JetBrains Mono',monospace;font-size:14px;color:#c46a12;white-space:nowrap}",
      "#tuia-co label{display:block;font-size:12.5px;color:#5a6b73;font-weight:500;margin:0 0 5px}",
      "#tuia-co input[type=email]{width:100%;box-sizing:border-box;padding:11px 13px;border:1px solid #d4d8d2;border-radius:9px;font-size:14px;font-family:inherit}",
      "#tuia-co input[type=email]:focus{outline:none;border-color:#e8821e;box-shadow:0 0 0 3px rgba(232,130,30,.15)}",
      "#tuia-co .chk{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:#5a6b73;font-weight:400;margin:14px 0 0;cursor:pointer}",
      "#tuia-co .chk input{margin-top:2px}",
      "#tuia-co .chk a{color:#c46a12}",
      "#tuia-co .ref{font-size:12px;color:#0f6e56;background:rgba(29,158,117,.1);border-radius:7px;padding:7px 10px;margin-top:12px}",
      "#tuia-co .err{display:none;color:#c0392b;font-size:13px;margin-top:12px}",
      "#tuia-co .acts{display:flex;gap:10px;margin-top:20px}",
      "#tuia-co .pay{flex:1;padding:12px;border:none;border-radius:9px;background:#e8821e;color:#1a1206;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:14.5px;cursor:pointer}",
      "#tuia-co .pay:disabled{opacity:.6;cursor:default}",
      "#tuia-co .x{padding:12px 14px;border:1px solid #d4d8d2;border-radius:9px;background:#fff;color:#5a6b73;font-size:13.5px;cursor:pointer;font-family:inherit}"
    ].join("");
    document.head.appendChild(css);
  }

  var el = null, current = null;

  function ensureDom() {
    injectCss();
    if (el) return el;
    el = document.createElement("div");
    el.id = "tuia-co";
    el.innerHTML =
      '<div class="box" role="dialog" aria-modal="true">' +
      '<h3 id="tuia-co-title"></h3><p class="sub" id="tuia-co-sub"></p>' +
      '<div class="agent"><span class="n" id="tuia-co-agent"></span><span class="p" id="tuia-co-price"></span></div>' +
      '<label id="tuia-co-email-lbl"></label>' +
      '<input type="email" id="tuia-co-email" autocomplete="email">' +
      '<label class="chk"><input type="checkbox" id="tuia-co-accept"> <span id="tuia-co-legal"></span></label>' +
      '<div class="ref" id="tuia-co-ref" style="display:none"></div>' +
      '<div class="err" id="tuia-co-err"></div>' +
      '<div class="acts"><button class="pay" id="tuia-co-pay"></button>' +
      '<button class="x" id="tuia-co-cancel"></button></div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener("click", function (e) { if (e.target === el) close(); });
    document.getElementById("tuia-co-cancel").addEventListener("click", close);
    document.getElementById("tuia-co-pay").addEventListener("click", submit);
    document.getElementById("tuia-co-email").addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });
    return el;
  }

  function setErr(msg) {
    var e = document.getElementById("tuia-co-err");
    if (!msg) { e.style.display = "none"; return; }
    e.textContent = msg; e.style.display = "block";
  }

  function close() { if (el) el.classList.remove("on"); }

  function open(agentId, agentName, priceUsd, prefillEmail) {
    ensureDom();
    var t = T();
    current = { id: agentId, name: agentName, price: priceUsd };
    document.getElementById("tuia-co-title").textContent = t.title;
    document.getElementById("tuia-co-sub").textContent = t.sub;
    document.getElementById("tuia-co-agent").textContent = agentName || agentId;
    document.getElementById("tuia-co-price").textContent =
      (priceUsd || priceUsd === 0) ? ("$" + Number(priceUsd).toFixed(0) + (isEN() ? " /mo" : " /mes")) : "";
    document.getElementById("tuia-co-email-lbl").textContent = t.emailLbl;
    var emailInput = document.getElementById("tuia-co-email");
    emailInput.placeholder = t.emailPh;
    emailInput.value = prefillEmail || "";
    document.getElementById("tuia-co-accept").checked = false;
    document.getElementById("tuia-co-legal").innerHTML = t.legal;
    document.getElementById("tuia-co-pay").textContent = t.pay;
    document.getElementById("tuia-co-cancel").textContent = t.cancel;
    setErr("");
    var ref = storedRef();
    var refBox = document.getElementById("tuia-co-ref");
    if (ref) { refBox.style.display = "block"; refBox.textContent = t.refNote + ": " + ref; }
    else { refBox.style.display = "none"; }
    el.classList.add("on");
    if (!prefillEmail) setTimeout(function () { emailInput.focus(); }, 30);
  }

  function submit() {
    var t = T();
    var email = (document.getElementById("tuia-co-email").value || "").trim().toLowerCase();
    var accepted = document.getElementById("tuia-co-accept").checked;
    if (!email || email.indexOf("@") < 1 || email.indexOf(".") < 0) { setErr(t.errEmail); return; }
    if (!accepted) { setErr(t.errLegal); return; }
    setErr("");
    var btn = document.getElementById("tuia-co-pay");
    btn.disabled = true; btn.textContent = t.wait;
    var body = {
      email: email, agent_id: current.id, provider: "stripe", accepted: true,
      documents: ["terminos", "privacidad", "deslinde-ia"],
      lang: isEN() ? "en" : "es"
    };
    var ref = storedRef();
    if (ref) body.ref_code = ref;
    fetch(API + "/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    })
      .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (res) {
        if (res.s === 200 && res.j.checkout_url) { window.location.href = res.j.checkout_url; return; }
        setErr(errFor(res.j.error, t));
        btn.disabled = false; btn.textContent = t.pay;
      })
      .catch(function () { setErr(t.errNet); btn.disabled = false; btn.textContent = t.pay; });
  }

  window.TuiaCheckout = { open: open, close: close, ref: storedRef };
})();
