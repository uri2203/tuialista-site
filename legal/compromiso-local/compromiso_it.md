# Impegno di Elaborazione Locale e Privacy

> **BOZZA — Richiede revisione legale prima della pubblicazione commerciale.**

In TuIAlista costruiamo i nostri agenti su un principio semplice: **il lavoro avviene sul tuo dispositivo e i tuoi dati restano con te.** Questo documento spiega, in modo verificabile, come la nostra architettura è progettata affinché sia così.

---

## 1. Il nostro impegno

Gli agenti di TuIAlista elaborano le tue informazioni **localmente, sul tuo dispositivo**. Il contenuto dei tuoi file, documenti e dati **non viene inviato, non viene ricevuto da noi e non viene archiviato** sui nostri server.

Il nostro ruolo si limita a validare che la tua licenza sia attiva. Tutta l'analisi —leggere un contratto, esaminare una fattura, interrogare un database, organizzare una casella di posta— avviene sulla macchina in cui hai installato l'agente.

Questo è il maggiore fattore distintivo di TuIAlista: non siamo un servizio nel cloud a cui affidi i tuoi dati. Siamo software che gira dove decidi tu.

---

## 2. Come funziona tecnicamente

- **Gli agenti vengono eseguiti localmente.** Vengono installati ed eseguiti sul tuo dispositivo. Leggono i file che indichi, nelle cartelle che definisci, senza copiarli né caricarli da nessuna parte.
- **L'elaborazione è locale.** L'estrazione dei dati, il rilevamento dei pattern e l'organizzazione delle tue informazioni avvengono all'interno della tua macchina.
- **La piattaforma valida solo la licenza.** L'unico scambio con i nostri server è una verifica periodica che il tuo abbonamento sia attivo. Tale verifica viaggia firmata crittograficamente e **non include il contenuto di ciò che elabori.**
- **Funziona offline.** Poiché il lavoro è locale, gli agenti possono operare anche senza internet durante un periodo di tolleranza; la connessione serve solo a rivalidare la licenza.
- **Le funzioni di redazione con IA sono l'eccezione delimitata.** Alcune funzioni opzionali (ad esempio, generare un riassunto) inviano un frammento del testo a un motore di IA per redigere la risposta. Questo è indicato in ciascuna funzione, e le attività di rilevamento e organizzazione non lo richiedono.

---

## 3. Cosa riceve la piattaforma e cosa no

**Cosa RICEVE la piattaforma (il minimo per validare la tua licenza):**

- La tua **chiave di licenza**.
- Lo **stato del tuo abbonamento** (attivo, in prova, scaduto).
- Un **identificatore tecnico del dispositivo** (un'impronta derivata dall'hardware) per collegare la licenza al tuo dispositivo e prevenire un uso non autorizzato.

**Cosa non riceve MAI:**

- Il contenuto dei tuoi **file, documenti, contratti, fatture, e-mail o database**.
- I **dati che elabori** con l'agente né i risultati di tale elaborazione.
- Qualsiasi informazione personale o riservata contenuta nel materiale che analizzi.

In altre parole: riceviamo solo quanto basta per sapere che hai il diritto di usare il software, e nulla di ciò che il software legge o produce.

---

## 4. Come puoi verificarlo tu stesso

Non ti chiediamo di fidarti alla cieca. Poiché l'agente gira sul tuo dispositivo, puoi verificarlo:

- **Monitora le connessioni di rete dell'agente** con gli strumenti del tuo sistema operativo o un analizzatore di traffico (ad esempio, un firewall, `Monitoraggio risorse` su Windows, `Little Snitch` su macOS o `Wireshark`). Vedrai che le connessioni si limitano alla validazione della licenza e, ove applicabile, al motore di IA delle funzioni opzionali.
- **Osserva che i tuoi file non vengono trasmessi.** Il contenuto dei tuoi documenti non compare nel traffico in uscita durante l'analisi locale.
- **Disconnettiti da internet.** Le funzioni locali (rilevamento, estrazione, organizzazione) continuano a funzionare entro il periodo di tolleranza, il che conferma che l'elaborazione non dipende dai nostri server.

Il tuo team IT può eseguire queste verifiche nell'ambito della propria valutazione di sicurezza.

---

## 5. Vantaggio per la tua conformità

Il fatto che i dati non escano dal tuo controllo favorisce la tua conformità normativa, perché riduce la superficie di esposizione ed evita trasferimenti a terzi. Questa progettazione ti aiuta ad allinearti a quadri normativi come:

- **GDPR** (Regolamento generale sulla protezione dei dati, Unione europea).
- **LFPDPPP** (Legge federale sulla protezione dei dati personali in possesso dei privati, Messico).
- **LGPD** (Lei Geral de Proteção de Dados, Brasile).
- E altre normative locali di protezione dei dati.

Mantenendo l'elaborazione sul tuo dispositivo, **rimani il titolare e il custode dei tuoi dati**, senza intermediari che li ricevano o li archivino. Questo semplifica le tue valutazioni d'impatto, i tuoi registri dei trattamenti e i tuoi obblighi verso terzi.

Questo documento descrive un'architettura; non costituisce consulenza legale né una certificazione di conformità. La responsabilità di rispettare la normativa applicabile alla tua organizzazione rimane tua.

---

## 6. Nota legale

Il presente Impegno di Elaborazione Locale e Privacy descrive il design tecnico dei nostri agenti ed **è integrato dai nostri Termini e Condizioni e dalla nostra Informativa sulla Privacy**, che regolano l'intero rapporto contrattuale. In caso di discrepanza, prevalgono tali documenti.

Questo impegno è una dichiarazione di architettura verificabile, non una garanzia assoluta contro ogni scenario possibile. Ti raccomandiamo di **validarne l'applicazione in base alla normativa vigente nel tuo paese e settore** e di coinvolgere i tuoi team legale e di sicurezza prima di prendere decisioni di conformità basate su questo documento.

Se hai domande su questo impegno, scrivici a **privacidad@tuialista.com**.
