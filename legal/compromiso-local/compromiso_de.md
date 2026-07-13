# Zusage zur lokalen Verarbeitung und zum Datenschutz

> **ENTWURF — Erfordert eine rechtliche Prüfung vor der kommerziellen Veröffentlichung.**

Bei TuIAlista bauen wir unsere Agenten auf einem einfachen Grundsatz auf: **Die Arbeit geschieht auf Ihrem Gerät, und Ihre Daten bleiben bei Ihnen.** Dieses Dokument erklärt auf nachprüfbare Weise, wie unsere Architektur darauf ausgelegt ist, dies zu gewährleisten.

---

## 1. Unsere Zusage

Die Agenten von TuIAlista verarbeiten Ihre Informationen **lokal, auf Ihrem eigenen Gerät**. Der Inhalt Ihrer Dateien, Dokumente und Daten **wird nicht gesendet, nicht von uns empfangen und nicht gespeichert** auf unseren Servern.

Unsere Rolle beschränkt sich darauf, zu prüfen, ob Ihre Lizenz aktiv ist. Die gesamte Analyse —einen Vertrag lesen, eine Rechnung prüfen, eine Datenbank abfragen, ein Postfach organisieren— erfolgt auf dem Gerät, auf dem Sie den Agenten installiert haben.

Das ist das größte Unterscheidungsmerkmal von TuIAlista: Wir sind kein Cloud-Dienst, dem Sie Ihre Daten anvertrauen. Wir sind Software, die dort läuft, wo Sie es bestimmen.

---

## 2. Wie es technisch funktioniert

- **Die Agenten laufen lokal.** Sie werden auf Ihrem Gerät installiert und ausgeführt. Sie lesen die Dateien, die Sie ihnen angeben, in den Ordnern, die Sie festlegen, ohne sie zu kopieren oder irgendwohin hochzuladen.
- **Die Verarbeitung ist lokal.** Die Datenextraktion, die Mustererkennung und die Organisation Ihrer Informationen finden innerhalb Ihres Geräts statt.
- **Die Plattform validiert nur die Lizenz.** Der einzige Austausch mit unseren Servern ist eine regelmäßige Prüfung, ob Ihr Abonnement aktiv ist. Diese Prüfung wird kryptografisch signiert übertragen und **enthält nicht den Inhalt dessen, was Sie verarbeiten.**
- **Es funktioniert offline.** Da die Arbeit lokal erfolgt, können die Agenten während eines Toleranzzeitraums auch ohne Internet arbeiten; eine Verbindung wird nur benötigt, um die Lizenz erneut zu validieren.
- **Die KI-Textfunktionen sind die begrenzte Ausnahme.** Einige optionale Funktionen (zum Beispiel das Erstellen einer Zusammenfassung) senden einen Textausschnitt an eine KI-Engine, um die Antwort zu formulieren. Dies wird bei jeder Funktion angezeigt, und die Aufgaben zur Erkennung und Organisation erfordern es nicht.

---

## 3. Was die Plattform empfängt und was nicht

**Was die Plattform EMPFÄNGT (das Minimum zur Validierung Ihrer Lizenz):**

- Ihren **Lizenzschlüssel**.
- Den **Status Ihres Abonnements** (aktiv, in Testphase, abgelaufen).
- Eine **technische Gerätekennung** (ein aus der Hardware abgeleiteter Fingerabdruck), um die Lizenz an Ihr Gerät zu binden und unbefugte Nutzung zu verhindern.

**Was sie NIEMALS empfängt:**

- Den Inhalt Ihrer **Dateien, Dokumente, Verträge, Rechnungen, E-Mails oder Datenbanken**.
- Die **Daten, die Sie verarbeiten** mit dem Agenten, noch die Ergebnisse dieser Verarbeitung.
- Jegliche persönlichen oder vertraulichen Informationen, die in dem von Ihnen analysierten Material enthalten sind.

Mit anderen Worten: Wir empfangen gerade genug, um zu wissen, dass Sie zur Nutzung der Software berechtigt sind, und nichts von dem, was die Software liest oder erzeugt.

---

## 4. Wie Sie es selbst überprüfen können

Wir verlangen kein blindes Vertrauen. Da der Agent auf Ihrem Gerät läuft, können Sie es selbst überprüfen:

- **Überwachen Sie die Netzwerkverbindungen des Agenten** mit den Werkzeugen Ihres Betriebssystems oder einem Datenverkehrsanalysator (zum Beispiel eine Firewall, der `Ressourcenmonitor` unter Windows, `Little Snitch` unter macOS oder `Wireshark`). Sie werden feststellen, dass sich die Verbindungen auf die Lizenzvalidierung und, sofern zutreffend, auf die KI-Engine der optionalen Funktionen beschränken.
- **Beobachten Sie, dass Ihre Dateien nicht übertragen werden.** Der Inhalt Ihrer Dokumente erscheint während der lokalen Analyse nicht im ausgehenden Datenverkehr.
- **Trennen Sie die Internetverbindung.** Die lokalen Funktionen (Erkennung, Extraktion, Organisation) funktionieren innerhalb des Toleranzzeitraums weiter, was bestätigt, dass die Verarbeitung nicht von unseren Servern abhängt.

Ihr IT-Team kann diese Überprüfungen im Rahmen seiner eigenen Sicherheitsbewertung durchführen.

---

## 5. Vorteil für Ihre Compliance

Dass die Daten Ihren Einflussbereich nicht verlassen, unterstützt Ihre regulatorische Compliance, da es die Angriffsfläche verringert und Übermittlungen an Dritte vermeidet. Dieses Design hilft Ihnen, sich an Rahmenwerken auszurichten wie:

- **DSGVO** (Datenschutz-Grundverordnung, Europäische Union).
- **LFPDPPP** (Bundesgesetz zum Schutz personenbezogener Daten im Besitz Privater, Mexiko).
- **LGPD** (Lei Geral de Proteção de Dados, Brasilien).
- Und weiteren lokalen Datenschutzvorschriften.

Indem die Verarbeitung auf Ihrem Gerät bleibt, **bleiben Sie der Verantwortliche und Verwahrer Ihrer Daten**, ohne einen Vermittler, der sie empfängt oder speichert. Das vereinfacht Ihre Datenschutz-Folgenabschätzungen, Ihre Verarbeitungsverzeichnisse und Ihre Pflichten gegenüber Dritten.

Dieses Dokument beschreibt eine Architektur; es stellt weder eine Rechtsberatung noch eine Compliance-Zertifizierung dar. Die Verantwortung, die für Ihre Organisation geltenden Vorschriften einzuhalten, verbleibt bei Ihnen.

---

## 6. Rechtlicher Hinweis

Diese Zusage zur lokalen Verarbeitung und zum Datenschutz beschreibt die technische Gestaltung unserer Agenten und **wird durch unsere Allgemeinen Geschäftsbedingungen und unsere Datenschutzrichtlinie ergänzt**, die das gesamte Vertragsverhältnis regeln. Im Falle von Widersprüchen haben diese Dokumente Vorrang.

Diese Zusage ist eine nachprüfbare Architekturerklärung, keine absolute Garantie gegen jedes denkbare Szenario. Wir empfehlen Ihnen, **ihre Anwendung anhand der in Ihrem Land und Ihrer Branche geltenden Vorschriften zu prüfen** und Ihre Rechts- und Sicherheitsteams einzubeziehen, bevor Sie auf Grundlage dieses Dokuments Compliance-Entscheidungen treffen.

Bei Fragen zu dieser Zusage schreiben Sie uns an **privacidad@tuialista.com**.
