/* ══════════════════════════════════════════════════════════════════════════
   TuIAlista · Asistente de plataforma — BASE DE CONOCIMIENTO (contexto fijo)
   ──────────────────────────────────────────────────────────────────────────
   Opción 1 (contexto fijo): toda la base de conocimiento se pasa como contexto
   al motor de IA en el system prompt, según el modo (cliente / afiliado).

   Este archivo es la ÚNICA fuente de verdad del contenido del asistente:
     · systemPrompts  → el rol del asistente por modo (item 3 del encargo)
     · knowledge      → secciones modulares que forman el contexto fijo
     · fallbackFaq    → respuestas locales (6 idiomas) para cuando la IA no está
     · ui             → textos del widget en los 6 idiomas
     · langInstruction→ instrucción de idioma (espeja core-license/language_service.py)

   ┌────────────────────────────────────────────────────────────────────────┐
   │ 🔭 PUNTO DE MIGRACIÓN FUTURA A RAG                                        │
   │ Hoy `buildContext(mode)` vuelca TODAS las secciones al system prompt      │
   │ (contexto fijo). Funciona porque la base es pequeña. Si crece mucho:      │
   │   1. Cada objeto de `knowledge[mode]` YA es un "chunk" independiente       │
   │      (id + title + body) — es la unidad natural para embeddings.          │
   │   2. Reemplazar `buildContext()` por recuperación top-k: embeber cada      │
   │      chunk, embeber la pregunta, y pasar solo los N chunks más cercanos.   │
   │   3. Reutilizar la lógica del agente de Conocimiento Interno              │
   │      (agents/agent-conocimiento) para el pipeline chunk→embed→buscar.      │
   │ La interfaz pública (buildContext / fullSystemPrompt) no cambiaría, así    │
   │ que el widget seguiría igual. Solo cambia CÓMO se arma el contexto.        │
   └────────────────────────────────────────────────────────────────────────┘
   ══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  var SUPPORTED = ["es", "en", "pt", "fr", "de", "it"];
  var FALLBACK_LANG = "en";

  /* ── System prompts por modo (item 3) ─────────────────────────────────── */
  var systemPrompts = {
    client:
      "Eres el asistente de soporte de TuIAlista. Ayudas con dudas sobre los " +
      "agentes, instalación, privacidad y facturación. Responde solo sobre " +
      "TuIAlista, en el idioma del usuario, claro y amable. Si no sabes algo, " +
      "sugiere contactar soporte.",
    affiliate:
      "Eres el asistente del programa de afiliados de TuIAlista. Ayudas con " +
      "comisiones (30% recurrente), cómo referir, cómo y cuándo cobran, y sus " +
      "materiales. Responde en el idioma del usuario, claro y motivador.",
  };

  /* ── Instrucción de idioma (espeja language_service.LANG_INSTRUCTION) ──── */
  var langInstruction = {
    es: "Responde SIEMPRE en español.",
    en: "Always respond in English.",
    pt: "Responda SEMPRE em português.",
    fr: "Réponds TOUJOURS en français.",
    de: "Antworte IMMER auf Deutsch.",
    it: "Rispondi SEMPRE in italiano.",
  };

  /* ══════════════════════════════════════════════════════════════════════
     CONOCIMIENTO — MODO CLIENTE
     Contenido en español (idioma fuente). El modelo traduce al idioma del
     usuario mediante la instrucción de idioma. Cada objeto es un chunk.
     ══════════════════════════════════════════════════════════════════════ */
  var knowledgeClient = [
    {
      id: "que-es",
      title: "Qué es TuIAlista",
      body: [
        "TuIAlista es una plataforma de agentes de inteligencia artificial especializados que corren LOCALMENTE en el equipo del cliente.",
        "Cada agente resuelve una tarea concreta (leer contratos, analizar Excel, revisar facturas, consultar bases de datos, etc.).",
        "No es un chatbot genérico: son 16 agentes especializados. Se paga una licencia mensual solo por los agentes que se usan.",
      ].join(" "),
    },
    {
      id: "privacidad",
      title: "Privacidad — procesamiento 100% local",
      body: [
        "El diferenciador principal: los datos del cliente NUNCA salen de su equipo.",
        "Cada agente procesa todo localmente, en la propia computadora o servidor del cliente.",
        "TuIAlista NUNCA recibe ni almacena el contenido de archivos, contratos, facturas ni correos.",
        "La plataforma central solo valida la licencia (que el pago esté al día). Es un compromiso por escrito y una arquitectura verificable.",
      ].join(" "),
    },
    {
      id: "agentes",
      title: "Los 16 agentes y sus precios (USD/mes)",
      body: [
        "Documentos ($9): pregunta en lenguaje natural sobre contratos, manuales y expedientes; responde citando la fuente.",
        "Excel y datos ($9): analiza hojas de cálculo hablando; totales, comparativas y hallazgos sin fórmulas.",
        "Base de datos ($15): consulta cualquier base de datos en lenguaje natural, solo lectura (nunca daña los datos).",
        "AS/400 · IBM i (Premium, desde $299): consulta sistemas legacy y entiende su código RPG sin ser experto.",
        "Cumplimiento Fiscal ($29): vigila obligaciones fiscales y prepara documentos, sin que los datos salgan.",
        "Contratos y Renovaciones ($79): extrae términos clave, alerta renovaciones y detecta cláusulas riesgosas.",
        "Documentación Técnica ($49): genera y mantiene documentación técnica desde el código y archivos locales.",
        "Trámites de Gobierno ($19): guía paso a paso en trámites y prepara los documentos necesarios.",
        "Contratos Personales ($19): revisa contratos que vas a firmar y explica las cláusulas problemáticas.",
        "Reclamaciones y Garantías ($15): detecta garantías por vencer y organiza reclamaciones para recuperar dinero.",
        "Facturas y Cuentas por Pagar ($49): lee facturas, extrae montos y fechas, detecta duplicados y las organiza para pago.",
        "Conocimiento Interno ($39): el equipo pregunta y el agente busca en todos los documentos de la empresa y responde citando la fuente.",
        "Nóminas y Recursos Humanos ($49): organiza datos de empleados, prepara reportes y vigila fechas de contratos y vacaciones.",
        "Inventario ($29): analiza el stock, predice cuándo reordenar y detecta faltantes.",
        "Actas y Reuniones ($19): convierte reuniones en minutas claras y extrae tareas y acuerdos.",
        "Correo ($19): organiza, prioriza y redacta respuestas al correo, procesándolo localmente.",
      ].join(" "),
    },
    {
      id: "instalacion",
      title: "Instalación y puesta en marcha",
      body: [
        "El cliente elige su agente desde el portal y activa 7 días de prueba gratis.",
        "Cada agente se distribuye como un paquete que se instala en el equipo del cliente y corre localmente.",
        "El agente necesita una clave de licencia para activarse; valida la licencia contra la plataforma central y luego trabaja con los datos locales.",
        "No requiere ser técnico: se le habla en lenguaje natural, sin fórmulas ni código.",
        "Funciona junto a los sistemas existentes (ERP, bases de datos, AS/400); no los reemplaza.",
      ].join(" "),
    },
    {
      id: "facturacion",
      title: "Facturación, prueba y cancelación",
      body: [
        "Licencia mensual sin ataduras: se paga solo por los agentes que se usan y se cancela cuando se quiera desde el panel.",
        "Cada agente tiene 7 días de prueba gratis para probarlo con datos propios antes de pagar.",
        "Los precios van desde $9/mes. La plataforma es multi-idioma y multi-moneda (USD, MXN, EUR, etc.).",
        "El cobro se procesa de forma segura vía la pasarela de pago; la plataforma solo gestiona la licencia y el pago mensual.",
      ].join(" "),
    },
    {
      id: "problemas",
      title: "Problemas comunes",
      body: [
        "Si un agente no se activa: revisar que la clave de licencia sea correcta y que el pago esté al día.",
        "Si la licencia aparece suspendida: suele ser por un pago fallido; actualizar el método de pago en el portal la reactiva.",
        "Los agentes funcionan sin conexión durante un periodo de gracia, pero revalidan la licencia periódicamente.",
        "Para renovar o cambiar de plan, se hace desde el portal del cliente.",
        "Si el problema persiste, contactar a soporte: soporte@tuialista.com.",
      ].join(" "),
    },
  ];

  /* ══════════════════════════════════════════════════════════════════════
     CONOCIMIENTO — MODO AFILIADO  (basado en marketing/afiliados/)
     ══════════════════════════════════════════════════════════════════════ */
  var knowledgeAffiliate = [
    {
      id: "programa",
      title: "El programa de afiliados",
      body: [
        "TuIAlista no vende de forma directa: su canal principal son los afiliados, que recomiendan la plataforma y cobran comisión.",
        "El modelo clave es la COMISIÓN RECURRENTE: no es un pago único. El afiliado gana cada mes que su cliente referido siga pagando.",
        "El afiliado no maneja soporte, ni facturación, ni instalación: solo conecta a la persona con la solución.",
        "Registrarse es gratis y no tiene cuota mensual. La comisión estándar es del 30%.",
      ].join(" "),
    },
    {
      id: "cuanto-gano",
      title: "Cuánto se gana (30% recurrente)",
      body: [
        "Se gana el 30% del precio del agente, cada mes que el cliente siga activo.",
        "Ejemplo: si refieres el agente de Contratos y Renovaciones ($79/mes), ganas $23.70 cada mes; en 12 meses son $284.40 por ese único cliente.",
        "Comisiones por agente al mes: Documentos/Excel $2.70; Base de datos y Garantías $4.50; Trámites/Contratos Personales/Actas/Correo $5.70; Fiscal/Inventario $8.70; Conocimiento Interno $11.70; Docs Técnica/Facturas/Nóminas $14.70; Contratos $23.70; AS/400 desde $89.70.",
        "No hay límite de ganancias ni de referidos: el ingreso se acumula con cada cliente activo.",
      ].join(" "),
    },
    {
      id: "como-refiero",
      title: "Cómo referir (código y enlace)",
      body: [
        "Al registrarse, el sistema genera un código único (ej. MRES9A4C21) y un enlace personal: https://tuialista.com/?ref=TUCODIGO.",
        "Cuando alguien entra por ese enlace y se suscribe, queda atribuido al afiliado automáticamente en su primer pago.",
        "El mismo enlace sirve para los 16 agentes: la comisión se calcula sobre lo que pague el cliente.",
        "Desde el panel se puede generar un enlace para promocionar un agente específico y copiar mensajes listos para WhatsApp, redes y correo.",
      ].join(" "),
    },
    {
      id: "cuando-cobro",
      title: "Cómo y cuándo se cobra",
      body: [
        "Las comisiones se acreditan solas: cada vez que un cliente referido paga su mes, se registra la comisión como PENDIENTE.",
        "Se agrupan por periodo mensual (ej. 2026-07). En el panel se ve, por periodo, cuántos referidos activos hay y cuánto se lleva: pendiente y pagado.",
        "Al cierre del periodo se liquidan y pasan a PAGADA cuando se depositan al método de cobro registrado.",
        "El afiliado no factura al cliente ni persigue cobros: la plataforma cobra al cliente, calcula el 30% y lo liquida.",
      ].join(" "),
    },
    {
      id: "retiros",
      title: "Retiros y método de cobro",
      body: [
        "El afiliado ve su saldo disponible en la sección Retiros y solicita un retiro cuando supera el mínimo de $50 USD.",
        "El método de cobro puede ser PayPal o transferencia bancaria; se configura y edita desde el panel.",
        "La ejecución del pago se procesa a través del Merchant of Record, que gestiona impuestos y la dispersión de fondos según el país del afiliado.",
        "Un retiro solicitado aparece como 'En proceso' hasta que el Merchant of Record confirma el depósito (2 a 5 días hábiles).",
      ].join(" "),
    },
    {
      id: "reglas",
      title: "Reglas del programa",
      body: [
        "La comisión dura lo que dure el cliente: si el cliente cancela, se deja de cobrar por él, pero se conserva todo lo ya ganado.",
        "La atribución ocurre en el primer pago. Un cliente pertenece a un solo afiliado (el que lo trajo).",
        "Se pueden referir empresas grandes: el agente Premium AS/400 (desde $299/mes) da la mejor comisión, desde $89.70/mes por un solo cliente.",
        "Hay que vender con la verdad: el diferenciador es real, los datos del cliente nunca salen de su equipo.",
      ].join(" "),
    },
    {
      id: "materiales",
      title: "Materiales del kit de afiliados",
      body: [
        "El kit incluye: la guía del afiliado, los argumentos de venta (diferenciador local, los 16 agentes y respuestas a objeciones), mensajes listos (WhatsApp, redes, correo y seguimiento) y las preguntas frecuentes.",
        "Todo está disponible en español e inglés y se puede copiar o descargar desde la sección Recursos del panel.",
      ].join(" "),
    },
  ];

  var knowledge = { client: knowledgeClient, affiliate: knowledgeAffiliate };

  /* ══════════════════════════════════════════════════════════════════════
     FALLBACK FAQ (offline) — respuestas locales localizadas en 6 idiomas.
     Se usan SOLO si el motor de IA no está disponible, para dar siempre algo
     útil. El matching es por palabras clave (multi-idioma, sin acentos).
     ══════════════════════════════════════════════════════════════════════ */
  var fallbackFaq = {
    client: [
      {
        id: "privacy",
        keywords: ["privacidad", "seguro", "seguridad", "datos", "local", "nube", "privacy", "secure", "security", "data", "cloud", "privacidade", "seguro", "confidencial", "privé", "sécurité", "données", "datenschutz", "sicher", "daten", "privacy", "sicurezza", "dati"],
        a: {
          es: "Con TuIAlista todo se procesa localmente, en tu propio equipo. Tus documentos, facturas y correos nunca salen de tu computadora; la plataforma solo valida tu licencia. Es un compromiso por escrito.",
          en: "With TuIAlista everything is processed locally, on your own computer. Your documents, invoices and emails never leave your machine; the platform only validates your license. It's a written commitment.",
          pt: "Com a TuIAlista tudo é processado localmente, no seu próprio computador. Seus documentos, faturas e e-mails nunca saem da sua máquina; a plataforma só valida a licença. É um compromisso por escrito.",
          fr: "Avec TuIAlista tout est traité localement, sur votre propre ordinateur. Vos documents, factures et e-mails ne quittent jamais votre poste ; la plateforme valide seulement votre licence. C'est un engagement écrit.",
          de: "Bei TuIAlista wird alles lokal auf deinem eigenen Rechner verarbeitet. Deine Dokumente, Rechnungen und E-Mails verlassen nie deinen Rechner; die Plattform validiert nur deine Lizenz. Ein schriftliches Versprechen.",
          it: "Con TuIAlista tutto è elaborato in locale, sul tuo computer. I tuoi documenti, fatture ed e-mail non escono mai dal tuo dispositivo; la piattaforma valida solo la licenza. È un impegno scritto.",
        },
      },
      {
        id: "price",
        keywords: ["precio", "cuesta", "cuanto", "caro", "pago", "mensual", "price", "cost", "how much", "expensive", "monthly", "preço", "custa", "quanto", "prix", "coûte", "combien", "preis", "kostet", "wie viel", "prezzo", "costa", "quanto"],
        a: {
          es: "Los agentes van desde $9 al mes y pagas solo por los que uses. Cada uno tiene 7 días de prueba gratis y cancelas cuando quieras. Precios: Documentos y Excel $9, Contratos $79, AS/400 desde $299, entre otros.",
          en: "Agents start at $9/month and you pay only for the ones you use. Each has a 7-day free trial and you can cancel anytime. Prices: Documents and Excel $9, Contracts $79, AS/400 from $299, among others.",
          pt: "Os agentes começam em US$ 9/mês e você paga só pelos que usa. Cada um tem 7 dias grátis e você cancela quando quiser. Preços: Documentos e Excel US$ 9, Contratos US$ 79, AS/400 a partir de US$ 299.",
          fr: "Les agents démarrent à 9 $/mois et vous ne payez que ceux que vous utilisez. Chacun a 7 jours d'essai gratuit et vous annulez quand vous voulez. Prix : Documents et Excel 9 $, Contrats 79 $, AS/400 dès 299 $.",
          de: "Agenten beginnen bei 9 $/Monat und du zahlst nur die, die du nutzt. Jeder hat 7 Tage gratis und du kannst jederzeit kündigen. Preise: Dokumente und Excel 9 $, Verträge 79 $, AS/400 ab 299 $.",
          it: "Gli agenti partono da 9 $/mese e paghi solo quelli che usi. Ognuno ha 7 giorni di prova gratis e disdici quando vuoi. Prezzi: Documenti ed Excel 9 $, Contratti 79 $, AS/400 da 299 $.",
        },
      },
      {
        id: "install",
        keywords: ["instalar", "instalacion", "empezar", "activar", "prueba", "install", "setup", "start", "activate", "trial", "instalar", "começar", "installer", "démarrer", "essai", "installieren", "starten", "testphase", "installare", "iniziare", "prova"],
        a: {
          es: "Eliges tu agente en el portal y activas 7 días de prueba gratis. El agente se instala en tu equipo y corre localmente; le hablas en lenguaje natural, sin fórmulas ni código. No necesitas ser técnico.",
          en: "You pick your agent in the portal and start a 7-day free trial. The agent installs on your computer and runs locally; you talk to it in plain language, no formulas or code. No technical skills needed.",
          pt: "Você escolhe seu agente no portal e ativa 7 dias grátis. O agente instala no seu computador e roda localmente; você fala com ele em linguagem natural, sem fórmulas nem código. Não precisa ser técnico.",
          fr: "Vous choisissez votre agent dans le portail et lancez 7 jours d'essai gratuit. L'agent s'installe sur votre ordinateur et fonctionne en local ; vous lui parlez en langage naturel, sans formules ni code. Aucune compétence technique requise.",
          de: "Du wählst deinen Agenten im Portal und startest 7 Tage gratis. Der Agent wird auf deinem Rechner installiert und läuft lokal; du sprichst mit ihm in natürlicher Sprache, ohne Formeln oder Code. Keine Technikkenntnisse nötig.",
          it: "Scegli il tuo agente nel portale e attivi 7 giorni di prova gratis. L'agente si installa sul tuo computer e gira in locale; gli parli in linguaggio naturale, senza formule né codice. Non serve essere tecnici.",
        },
      },
      {
        id: "billing",
        keywords: ["facturacion", "cancelar", "cobro", "tarjeta", "renovar", "billing", "cancel", "charge", "renew", "faturamento", "cancelar", "facturation", "annuler", "abrechnung", "kündigen", "fatturazione", "disdire", "rinnovo"],
        a: {
          es: "Es una licencia mensual sin ataduras: pagas solo por los agentes que usas y cancelas cuando quieras desde tu panel. Es multi-moneda (USD, MXN, EUR…). Para cambiar de plan o método de pago, entra al portal del cliente.",
          en: "It's a monthly license with no strings: you pay only for the agents you use and cancel anytime from your dashboard. It's multi-currency (USD, MXN, EUR…). To change plan or payment method, go to the client portal.",
          pt: "É uma licença mensal sem amarras: você paga só pelos agentes que usa e cancela quando quiser no seu painel. É multi-moeda (USD, MXN, EUR…). Para mudar de plano ou forma de pagamento, acesse o portal do cliente.",
          fr: "C'est une licence mensuelle sans engagement : vous ne payez que les agents utilisés et annulez quand vous voulez depuis votre tableau de bord. Multi-devise (USD, MXN, EUR…). Pour changer d'offre ou de moyen de paiement, allez au portail client.",
          de: "Eine monatliche Lizenz ohne Bindung: du zahlst nur die genutzten Agenten und kündigst jederzeit im Dashboard. Mehrere Währungen (USD, MXN, EUR…). Zum Ändern von Tarif oder Zahlungsart geh ins Kundenportal.",
          it: "È una licenza mensile senza vincoli: paghi solo gli agenti che usi e disdici quando vuoi dal pannello. È multi-valuta (USD, MXN, EUR…). Per cambiare piano o metodo di pagamento, vai al portale cliente.",
        },
      },
      {
        id: "chatgpt",
        keywords: ["chatgpt", "diferencia", "generico", "por que", "difference", "generic", "why not", "diferença", "différence", "unterschied", "warum", "differenza", "perché"],
        a: {
          es: "A diferencia de una IA genérica, TuIAlista trabaja con tus datos reales sin sacarlos de tu equipo, y cada agente está especializado en una tarea concreta. No tienes que subir tus contratos o facturas a un servidor ajeno.",
          en: "Unlike generic AI, TuIAlista works with your real data without taking it off your computer, and each agent is specialized for a concrete task. You don't upload your contracts or invoices to someone else's server.",
          pt: "Diferente de uma IA genérica, a TuIAlista trabalha com seus dados reais sem tirá-los do seu computador, e cada agente é especializado numa tarefa concreta. Você não envia seus contratos ou faturas a um servidor de terceiros.",
          fr: "Contrairement à une IA générique, TuIAlista travaille avec vos vraies données sans les sortir de votre poste, et chaque agent est spécialisé dans une tâche précise. Vous n'envoyez pas vos contrats ou factures sur un serveur tiers.",
          de: "Anders als generische KI arbeitet TuIAlista mit deinen echten Daten, ohne sie von deinem Rechner zu nehmen, und jeder Agent ist auf eine konkrete Aufgabe spezialisiert. Du lädst deine Verträge oder Rechnungen nicht auf einen fremden Server.",
          it: "A differenza di un'IA generica, TuIAlista lavora con i tuoi dati reali senza toglierli dal tuo computer, e ogni agente è specializzato in un compito concreto. Non carichi i tuoi contratti o fatture su un server altrui.",
        },
      },
    ],
    affiliate: [
      {
        id: "commission",
        keywords: ["comision", "gano", "cuanto", "30", "recurrente", "commission", "earn", "how much", "recurring", "comissão", "ganho", "recorrente", "gagne", "récurrent", "provision", "verdiene", "wiederkehrend", "commissione", "guadagno", "ricorrente"],
        a: {
          es: "Ganas el 30% del precio del agente cada mes que tu cliente siga activo. Ejemplo: refieres Contratos ($79) y ganas $23.70 cada mes. No es un pago único: se acumula con cada cliente y no hay límite de ganancias.",
          en: "You earn 30% of the agent's price every month your client stays active. Example: you refer Contracts ($79) and earn $23.70 each month. It's not a one-off: it stacks with every client and there's no earnings cap.",
          pt: "Você ganha 30% do preço do agente a cada mês em que seu cliente continuar ativo. Exemplo: indica Contratos (US$ 79) e ganha US$ 23,70 por mês. Não é pagamento único: acumula a cada cliente e não há limite de ganhos.",
          fr: "Vous gagnez 30 % du prix de l'agent chaque mois où votre client reste actif. Exemple : vous parrainez Contrats (79 $) et gagnez 23,70 $ par mois. Ce n'est pas un paiement unique : cela s'accumule et sans plafond de gains.",
          de: "Du verdienst 30 % des Agentenpreises in jedem Monat, in dem dein Kunde aktiv bleibt. Beispiel: Du wirbst Verträge (79 $) und verdienst 23,70 $ pro Monat. Keine Einmalzahlung: es summiert sich und ohne Verdienstgrenze.",
          it: "Guadagni il 30% del prezzo dell'agente ogni mese in cui il tuo cliente resta attivo. Esempio: segnali Contratti (79 $) e guadagni 23,70 $ al mese. Non è un pagamento una tantum: si accumula e senza limiti di guadagno.",
        },
      },
      {
        id: "when-paid",
        keywords: ["cuando", "cobro", "pago", "pagan", "retiro", "when", "paid", "payout", "withdraw", "quando", "recebo", "saque", "quand", "payé", "retrait", "wann", "auszahlung", "quando", "pagato", "prelievo"],
        a: {
          es: "Las comisiones se agrupan por mes. Cuando tu saldo disponible supera los $50 USD, solicitas un retiro desde la sección Retiros. El pago lo ejecuta el Merchant of Record y llega a tu método de cobro en 2 a 5 días hábiles.",
          en: "Commissions are grouped by month. When your available balance passes $50 USD, you request a withdrawal in the Payouts section. The Merchant of Record executes the payment to your payout method in 2–5 business days.",
          pt: "As comissões são agrupadas por mês. Quando seu saldo disponível passa de US$ 50, você solicita um saque na seção Saques. O Merchant of Record executa o pagamento no seu método de recebimento em 2 a 5 dias úteis.",
          fr: "Les commissions sont regroupées par mois. Quand votre solde disponible dépasse 50 $ USD, vous demandez un retrait dans la section Retraits. Le Merchant of Record verse le paiement sur votre moyen de paiement sous 2 à 5 jours ouvrés.",
          de: "Provisionen werden pro Monat gebündelt. Übersteigt dein verfügbarer Saldo 50 $ USD, forderst du im Bereich Auszahlungen eine Auszahlung an. Der Merchant of Record zahlt in 2–5 Werktagen an deine Zahlungsmethode.",
          it: "Le commissioni sono raggruppate per mese. Quando il saldo disponibile supera i 50 $ USD, richiedi un prelievo nella sezione Prelievi. Il Merchant of Record esegue il pagamento sul tuo metodo in 2–5 giorni lavorativi.",
        },
      },
      {
        id: "how-refer",
        keywords: ["referir", "enlace", "codigo", "link", "comparto", "refer", "link", "code", "share", "indicar", "partilhar", "parrainer", "lien", "werben", "teilen", "referral", "segnalare", "condividere"],
        a: {
          es: "Al registrarte recibes un código único y un enlace personal (https://tuialista.com/?ref=TUCODIGO). Compártelo por WhatsApp, redes o correo; quien entre por él y se suscriba queda atribuido a ti automáticamente en su primer pago.",
          en: "When you register you get a unique code and a personal link (https://tuialista.com/?ref=YOURCODE). Share it via WhatsApp, social or email; whoever enters through it and subscribes is attributed to you automatically on their first payment.",
          pt: "Ao se registrar você recebe um código único e um link pessoal (https://tuialista.com/?ref=SEUCODIGO). Compartilhe por WhatsApp, redes ou e-mail; quem entrar por ele e assinar é atribuído a você automaticamente no primeiro pagamento.",
          fr: "À l'inscription vous recevez un code unique et un lien personnel (https://tuialista.com/?ref=VOTRECODE). Partagez-le par WhatsApp, réseaux ou e-mail ; celui qui entre via ce lien et s'abonne vous est attribué automatiquement à son premier paiement.",
          de: "Bei der Anmeldung erhältst du einen eindeutigen Code und einen persönlichen Link (https://tuialista.com/?ref=DEINCODE). Teile ihn per WhatsApp, Social oder E-Mail; wer darüber kommt und abonniert, wird dir bei seiner ersten Zahlung automatisch zugeordnet.",
          it: "Alla registrazione ricevi un codice unico e un link personale (https://tuialista.com/?ref=TUOCODICE). Condividilo su WhatsApp, social o e-mail; chi entra e si abbona viene attribuito a te automaticamente al primo pagamento.",
        },
      },
      {
        id: "cancel",
        keywords: ["cancela", "cancelacion", "deja", "pierdo", "cancels", "lose", "churn", "cancela", "perco", "annule", "perds", "kündigt", "verliere", "annulla", "perdo"],
        a: {
          es: "Si tu cliente cancela, dejas de cobrar por él a partir de ese momento, pero conservas todo lo que ya ganaste. Si vuelve a suscribirse por tu enlace, se te vuelve a atribuir.",
          en: "If your client cancels, you stop earning from them from that point, but you keep everything already earned. If they resubscribe through your link, they're re-attributed to you.",
          pt: "Se seu cliente cancelar, você deixa de ganhar por ele a partir daí, mas mantém tudo o que já ganhou. Se ele assinar de novo pelo seu link, é atribuído a você novamente.",
          fr: "Si votre client annule, vous cessez de gagner pour lui à partir de ce moment, mais vous conservez tout ce qui est déjà gagné. S'il se réabonne via votre lien, il vous est de nouveau attribué.",
          de: "Wenn dein Kunde kündigt, verdienst du ab dann nicht mehr an ihm, behältst aber alles bereits Verdiente. Abonniert er erneut über deinen Link, wird er dir wieder zugeordnet.",
          it: "Se il tuo cliente disdice, smetti di guadagnare da lui da quel momento, ma conservi tutto ciò che hai già guadagnato. Se si riabbona dal tuo link, viene riattribuito a te.",
        },
      },
      {
        id: "big-companies",
        keywords: ["empresas", "grandes", "limite", "as400", "companies", "large", "cap", "limit", "empresas", "grandes", "entreprises", "grandes", "limite", "unternehmen", "große", "grenze", "aziende", "grandi", "limite"],
        a: {
          es: "Sí, puedes referir empresas grandes y es tu mejor negocio: el agente Premium AS/400 (desde $299/mes) te da desde $89.70/mes por un solo cliente. No hay límite de ganancias ni de número de referidos.",
          en: "Yes, you can refer large companies and it's your best business: the Premium AS/400 agent (from $299/mo) gives you from $89.70/month from a single client. There's no cap on earnings or number of referrals.",
          pt: "Sim, você pode indicar grandes empresas e é seu melhor negócio: o agente Premium AS/400 (a partir de US$ 299/mês) rende a partir de US$ 89,70/mês por um único cliente. Não há limite de ganhos nem de indicações.",
          fr: "Oui, vous pouvez parrainer de grandes entreprises et c'est votre meilleure affaire : l'agent Premium AS/400 (dès 299 $/mois) vous rapporte dès 89,70 $/mois pour un seul client. Aucun plafond de gains ni de parrainages.",
          de: "Ja, du kannst große Unternehmen werben und das ist dein bestes Geschäft: der Premium-Agent AS/400 (ab 299 $/Monat) bringt dir ab 89,70 $/Monat von einem einzigen Kunden. Keine Grenze für Verdienst oder Anzahl der Empfehlungen.",
          it: "Sì, puoi segnalare grandi aziende ed è il tuo miglior affare: l'agente Premium AS/400 (da 299 $/mese) ti rende da 89,70 $/mese per un solo cliente. Nessun limite di guadagni né di segnalazioni.",
        },
      },
    ],
  };

  /* ══════════════════════════════════════════════════════════════════════
     TEXTOS DE UI DEL WIDGET (6 idiomas)
     ══════════════════════════════════════════════════════════════════════ */
  var ui = {
    es: {
      title: { client: "Asistente TuIAlista", affiliate: "Asistente de afiliados" },
      subtitle: { client: "Soporte · respondemos al instante", affiliate: "Programa de afiliados · aquí para ayudarte" },
      greeting: {
        client: "¡Hola! 👋 Soy el asistente de TuIAlista. Puedo ayudarte con los agentes, precios, instalación, privacidad y facturación. ¿En qué te ayudo?",
        affiliate: "¡Hola! 👋 Soy tu asistente del programa de afiliados. Pregúntame sobre comisiones, cómo referir, cuándo cobras o tus materiales.",
      },
      suggestions: {
        client: ["¿Es seguro? ¿Mis datos salen?", "¿Cuánto cuestan los agentes?", "¿Cómo instalo un agente?"],
        affiliate: ["¿Cuánto gano por cliente?", "¿Cuándo y cómo cobro?", "¿Cómo consigo mi enlace?"],
      },
      placeholder: "Escribe tu pregunta…",
      send: "Enviar",
      typing: "Escribiendo…",
      offline: "Modo sin conexión — respuesta de la guía local.",
      error: "Ahora mismo no puedo responder. Escríbenos a soporte@tuialista.com.",
      poweredBy: "Asistente de TuIAlista",
      close: "Cerrar",
      open: "Abrir asistente",
    },
    en: {
      title: { client: "TuIAlista Assistant", affiliate: "Affiliate Assistant" },
      subtitle: { client: "Support · we reply instantly", affiliate: "Affiliate program · here to help" },
      greeting: {
        client: "Hi! 👋 I'm the TuIAlista assistant. I can help with the agents, pricing, installation, privacy and billing. How can I help?",
        affiliate: "Hi! 👋 I'm your affiliate program assistant. Ask me about commissions, how to refer, when you get paid or your materials.",
      },
      suggestions: {
        client: ["Is it safe? Does my data leave?", "How much do the agents cost?", "How do I install an agent?"],
        affiliate: ["How much do I earn per client?", "When and how do I get paid?", "How do I get my link?"],
      },
      placeholder: "Type your question…",
      send: "Send",
      typing: "Typing…",
      offline: "Offline mode — answer from the local guide.",
      error: "I can't answer right now. Write to us at soporte@tuialista.com.",
      poweredBy: "TuIAlista Assistant",
      close: "Close",
      open: "Open assistant",
    },
    pt: {
      title: { client: "Assistente TuIAlista", affiliate: "Assistente de afiliados" },
      subtitle: { client: "Suporte · respondemos na hora", affiliate: "Programa de afiliados · aqui para ajudar" },
      greeting: {
        client: "Olá! 👋 Sou o assistente da TuIAlista. Posso ajudar com os agentes, preços, instalação, privacidade e faturamento. Como posso ajudar?",
        affiliate: "Olá! 👋 Sou o seu assistente do programa de afiliados. Pergunte sobre comissões, como indicar, quando você recebe ou seus materiais.",
      },
      suggestions: {
        client: ["É seguro? Meus dados saem?", "Quanto custam os agentes?", "Como instalo um agente?"],
        affiliate: ["Quanto ganho por cliente?", "Quando e como recebo?", "Como consigo meu link?"],
      },
      placeholder: "Digite sua pergunta…",
      send: "Enviar",
      typing: "Digitando…",
      offline: "Modo offline — resposta do guia local.",
      error: "Agora não consigo responder. Escreva para soporte@tuialista.com.",
      poweredBy: "Assistente da TuIAlista",
      close: "Fechar",
      open: "Abrir assistente",
    },
    fr: {
      title: { client: "Assistant TuIAlista", affiliate: "Assistant d'affiliation" },
      subtitle: { client: "Support · réponse immédiate", affiliate: "Programme d'affiliation · ici pour aider" },
      greeting: {
        client: "Bonjour ! 👋 Je suis l'assistant TuIAlista. Je peux aider avec les agents, les prix, l'installation, la confidentialité et la facturation. Comment puis-je aider ?",
        affiliate: "Bonjour ! 👋 Je suis votre assistant du programme d'affiliation. Demandez-moi les commissions, comment parrainer, quand vous êtes payé ou vos supports.",
      },
      suggestions: {
        client: ["Est-ce sûr ? Mes données sortent ?", "Combien coûtent les agents ?", "Comment installer un agent ?"],
        affiliate: ["Combien je gagne par client ?", "Quand et comment suis-je payé ?", "Comment obtenir mon lien ?"],
      },
      placeholder: "Écrivez votre question…",
      send: "Envoyer",
      typing: "Écrit…",
      offline: "Mode hors ligne — réponse du guide local.",
      error: "Je ne peux pas répondre pour l'instant. Écrivez-nous à soporte@tuialista.com.",
      poweredBy: "Assistant TuIAlista",
      close: "Fermer",
      open: "Ouvrir l'assistant",
    },
    de: {
      title: { client: "TuIAlista-Assistent", affiliate: "Partner-Assistent" },
      subtitle: { client: "Support · sofortige Antwort", affiliate: "Partnerprogramm · hier, um zu helfen" },
      greeting: {
        client: "Hallo! 👋 Ich bin der TuIAlista-Assistent. Ich helfe bei Agenten, Preisen, Installation, Datenschutz und Abrechnung. Wie kann ich helfen?",
        affiliate: "Hallo! 👋 Ich bin dein Assistent für das Partnerprogramm. Frag mich zu Provisionen, wie du wirbst, wann du bezahlt wirst oder zu deinen Materialien.",
      },
      suggestions: {
        client: ["Ist es sicher? Verlassen meine Daten?", "Was kosten die Agenten?", "Wie installiere ich einen Agenten?"],
        affiliate: ["Wie viel verdiene ich pro Kunde?", "Wann und wie werde ich bezahlt?", "Wie bekomme ich meinen Link?"],
      },
      placeholder: "Schreib deine Frage…",
      send: "Senden",
      typing: "Schreibt…",
      offline: "Offline-Modus — Antwort aus dem lokalen Leitfaden.",
      error: "Ich kann gerade nicht antworten. Schreib uns an soporte@tuialista.com.",
      poweredBy: "TuIAlista-Assistent",
      close: "Schließen",
      open: "Assistent öffnen",
    },
    it: {
      title: { client: "Assistente TuIAlista", affiliate: "Assistente affiliati" },
      subtitle: { client: "Assistenza · rispondiamo subito", affiliate: "Programma affiliati · qui per aiutarti" },
      greeting: {
        client: "Ciao! 👋 Sono l'assistente di TuIAlista. Posso aiutarti con gli agenti, i prezzi, l'installazione, la privacy e la fatturazione. Come posso aiutarti?",
        affiliate: "Ciao! 👋 Sono il tuo assistente del programma affiliati. Chiedimi di commissioni, come segnalare, quando vieni pagato o i tuoi materiali.",
      },
      suggestions: {
        client: ["È sicuro? I miei dati escono?", "Quanto costano gli agenti?", "Come installo un agente?"],
        affiliate: ["Quanto guadagno per cliente?", "Quando e come vengo pagato?", "Come ottengo il mio link?"],
      },
      placeholder: "Scrivi la tua domanda…",
      send: "Invia",
      typing: "Sto scrivendo…",
      offline: "Modalità offline — risposta dalla guida locale.",
      error: "Ora non riesco a rispondere. Scrivici a soporte@tuialista.com.",
      poweredBy: "Assistente TuIAlista",
      close: "Chiudi",
      open: "Apri assistente",
    },
  };

  /* ── Utilidades ────────────────────────────────────────────────────────── */
  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // quita acentos
      .replace(/[¿?¡!.,;:()"']/g, " ");
  }

  function pickLang(lang) {
    return SUPPORTED.indexOf(lang) >= 0 ? lang : FALLBACK_LANG;
  }

  /* buildContext(mode): arma el contexto fijo con TODAS las secciones.
     ← Este es el punto exacto a reemplazar por recuperación top-k (RAG). */
  function buildContext(mode) {
    var sections = knowledge[mode] || [];
    var out = ["[BASE DE CONOCIMIENTO — TuIAlista]"];
    for (var i = 0; i < sections.length; i++) {
      out.push("\n## " + sections[i].title + "\n" + sections[i].body);
    }
    return out.join("\n");
  }

  /* fullSystemPrompt(mode): rol + contexto fijo. Es lo que el widget envía
     al motor de IA como system prompt (mismo patrón que los agentes). */
  function fullSystemPrompt(mode) {
    var role = systemPrompts[mode] || systemPrompts.client;
    return role + "\n\n" + buildContext(mode);
  }

  function getLangInstruction(lang) {
    return langInstruction[pickLang(lang)] || langInstruction[FALLBACK_LANG];
  }

  function getUI(lang) {
    return ui[pickLang(lang)] || ui[FALLBACK_LANG];
  }

  /* searchFallback: busca la mejor respuesta local (offline) por palabras
     clave. Devuelve {text, matched}. Si no hay match, mensaje por defecto. */
  function searchFallback(mode, query, lang) {
    var L = pickLang(lang);
    var items = fallbackFaq[mode] || [];
    var q = normalize(query);
    var tokens = q.split(/\s+/).filter(Boolean);
    var best = null,
      bestScore = 0;
    for (var i = 0; i < items.length; i++) {
      var score = 0;
      var kws = items[i].keywords;
      for (var k = 0; k < kws.length; k++) {
        var kw = normalize(kws[k]);
        if (!kw) continue;
        if (q.indexOf(kw) >= 0) score += 2;
        else if (tokens.indexOf(kw) >= 0) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = items[i];
      }
    }
    if (best && bestScore > 0) {
      return { text: best.a[L] || best.a[FALLBACK_LANG], matched: true };
    }
    return { text: getUI(L).error, matched: false };
  }

  /* ── API pública ───────────────────────────────────────────────────────── */
  global.TUIA_KB = {
    SUPPORTED: SUPPORTED,
    FALLBACK_LANG: FALLBACK_LANG,
    systemPrompts: systemPrompts,
    langInstruction: langInstruction,
    knowledge: knowledge,
    fallbackFaq: fallbackFaq,
    ui: ui,
    normalize: normalize,
    pickLang: pickLang,
    buildContext: buildContext,
    fullSystemPrompt: fullSystemPrompt,
    getLangInstruction: getLangInstruction,
    getUI: getUI,
    searchFallback: searchFallback,
  };
})(typeof window !== "undefined" ? window : this);
