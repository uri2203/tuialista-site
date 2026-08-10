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

  // Idioma actual normalizado a las 6 lenguas soportadas (fallback a es).
  function curLang() {
    try {
      var l = (localStorage.getItem("tuialista_lang") || "es").slice(0, 2).toLowerCase();
      return ["es", "en", "pt", "fr", "de", "it"].indexOf(l) >= 0 ? l : "es";
    } catch (e) { return "es"; }
  }
  function pick(o) { return o[curLang()] || o.es; }

  function T() {
    return {
      title: pick({ es: "Empieza tu suscripción", en: "Start your subscription", pt: "Comece sua assinatura", fr: "Commencez votre abonnement", de: "Starte dein Abo", it: "Inizia il tuo abbonamento" }),
      sub: pick({ es: "7 días de prueba gratis. Cancela cuando quieras desde tu panel.", en: "7-day free trial. Cancel anytime from your portal.", pt: "7 dias de teste grátis. Cancele quando quiser no seu painel.", fr: "7 jours d'essai gratuit. Annulez quand vous voulez depuis votre espace.", de: "7 Tage kostenlos testen. Jederzeit in deinem Portal kündbar.", it: "7 giorni di prova gratis. Annulla quando vuoi dal tuo pannello." }),
      emailLbl: pick({ es: "Tu correo", en: "Your email", pt: "Seu e-mail", fr: "Votre e-mail", de: "Deine E-Mail", it: "La tua e-mail" }),
      emailPh: pick({ es: "tu@empresa.com", en: "you@company.com", pt: "voce@empresa.com", fr: "vous@entreprise.com", de: "du@firma.com", it: "tu@azienda.com" }),
      legal: pick({
        es: 'Acepto los <a href="/legal/terminos" target="_blank" rel="noopener">Términos</a>, el <a href="/legal/privacidad" target="_blank" rel="noopener">Aviso de Privacidad</a> y el <a href="/legal/deslinde-ia" target="_blank" rel="noopener">Deslinde de IA</a>.',
        en: 'I accept the <a href="/legal/terminos" target="_blank" rel="noopener">Terms</a>, the <a href="/legal/privacidad" target="_blank" rel="noopener">Privacy Notice</a> and the <a href="/legal/deslinde-ia" target="_blank" rel="noopener">AI Disclaimer</a>.',
        pt: 'Aceito os <a href="/legal/terminos" target="_blank" rel="noopener">Termos</a>, o <a href="/legal/privacidad" target="_blank" rel="noopener">Aviso de Privacidade</a> e o <a href="/legal/deslinde-ia" target="_blank" rel="noopener">Aviso sobre IA</a>.',
        fr: 'J\'accepte les <a href="/legal/terminos" target="_blank" rel="noopener">Conditions</a>, l\'<a href="/legal/privacidad" target="_blank" rel="noopener">Avis de confidentialité</a> et l\'<a href="/legal/deslinde-ia" target="_blank" rel="noopener">Avertissement IA</a>.',
        de: 'Ich akzeptiere die <a href="/legal/terminos" target="_blank" rel="noopener">AGB</a>, die <a href="/legal/privacidad" target="_blank" rel="noopener">Datenschutzerklärung</a> und den <a href="/legal/deslinde-ia" target="_blank" rel="noopener">KI-Haftungsausschluss</a>.',
        it: 'Accetto i <a href="/legal/terminos" target="_blank" rel="noopener">Termini</a>, l\'<a href="/legal/privacidad" target="_blank" rel="noopener">Informativa sulla privacy</a> e il <a href="/legal/deslinde-ia" target="_blank" rel="noopener">Disclaimer IA</a>.'
      }),
      pay: pick({ es: "Continuar al pago", en: "Continue to payment", pt: "Continuar para o pagamento", fr: "Continuer vers le paiement", de: "Weiter zur Zahlung", it: "Continua al pagamento" }),
      wait: pick({ es: "Redirigiendo…", en: "Redirecting…", pt: "Redirecionando…", fr: "Redirection…", de: "Weiterleitung…", it: "Reindirizzamento…" }),
      cancel: pick({ es: "Cancelar", en: "Cancel", pt: "Cancelar", fr: "Annuler", de: "Abbrechen", it: "Annulla" }),
      refNote: pick({ es: "Referido por", en: "Referred by", pt: "Indicado por", fr: "Parrainé par", de: "Empfohlen von", it: "Segnalato da" }),
      errEmail: pick({ es: "Escribe un correo válido.", en: "Enter a valid email.", pt: "Digite um e-mail válido.", fr: "Saisissez un e-mail valide.", de: "Gib eine gültige E-Mail ein.", it: "Inserisci un'e-mail valida." }),
      errLegal: pick({ es: "Debes aceptar los términos.", en: "You must accept the terms.", pt: "Você deve aceitar os termos.", fr: "Vous devez accepter les conditions.", de: "Du musst die Bedingungen akzeptieren.", it: "Devi accettare i termini." }),
      errAgent: pick({ es: "Ese agente no está disponible.", en: "That agent is not available.", pt: "Esse agente não está disponível.", fr: "Cet agent n'est pas disponible.", de: "Dieser Agent ist nicht verfügbar.", it: "Questo agente non è disponibile." }),
      errProvider: pick({ es: "Los pagos aún no están habilitados. Inténtalo en un momento.", en: "Payments are not enabled yet. Try again shortly.", pt: "Os pagamentos ainda não estão habilitados. Tente em instantes.", fr: "Les paiements ne sont pas encore activés. Réessayez bientôt.", de: "Zahlungen sind noch nicht aktiviert. Versuche es gleich erneut.", it: "I pagamenti non sono ancora abilitati. Riprova tra poco." }),
      errNet: pick({ es: "Error de conexión. Inténtalo de nuevo.", en: "Connection error. Try again.", pt: "Erro de conexão. Tente novamente.", fr: "Erreur de connexion. Réessayez.", de: "Verbindungsfehler. Versuche es erneut.", it: "Errore di connessione. Riprova." }),
      errGeneric: pick({ es: "Algo salió mal. Inténtalo de nuevo.", en: "Something went wrong. Try again.", pt: "Algo deu errado. Tente novamente.", fr: "Une erreur s'est produite. Réessayez.", de: "Etwas ist schiefgelaufen. Versuche es erneut.", it: "Qualcosa è andato storto. Riprova." })
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
      (priceUsd || priceUsd === 0) ? ("$" + Number(priceUsd).toFixed(0) + pick({ es: " /mes", en: " /mo", pt: " /mês", fr: " /mois", de: " /Mon.", it: " /mese" })) : "";
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
      lang: curLang()
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
