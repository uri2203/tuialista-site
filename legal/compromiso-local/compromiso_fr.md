# Engagement de traitement local et de confidentialité

> **BROUILLON — Nécessite une révision juridique avant publication commerciale.**

Chez TuIAlista, nous construisons nos agents sur un principe simple : **le travail se fait sur votre machine, et vos données restent chez vous.** Ce document explique, de manière vérifiable, comment notre architecture est conçue pour qu'il en soit ainsi.

---

## 1. Notre engagement

Les agents TuIAlista traitent vos informations **localement, sur votre propre machine**. Le contenu de vos fichiers, documents et données **n'est pas envoyé, n'est pas reçu par nous et n'est pas stocké** sur nos serveurs.

Notre rôle se limite à valider que votre licence est active. Toute l'analyse —lire un contrat, examiner une facture, interroger une base de données, organiser une messagerie— se déroule sur la machine où vous avez installé l'agent.

C'est le plus grand facteur de différenciation de TuIAlista : nous ne sommes pas un service cloud auquel vous confiez vos données. Nous sommes un logiciel qui s'exécute là où vous le décidez.

---

## 2. Comment cela fonctionne techniquement

- **Les agents s'exécutent localement.** Ils sont installés et fonctionnent sur votre machine. Ils lisent les fichiers que vous leur indiquez, dans les dossiers que vous définissez, sans les copier ni les téléverser où que ce soit.
- **Le traitement est local.** L'extraction des données, la détection des motifs et l'organisation de vos informations se font au sein de votre machine.
- **La plateforme ne fait que valider la licence.** Le seul échange avec nos serveurs est une vérification périodique du caractère actif de votre abonnement. Cette vérification circule signée cryptographiquement et **n'inclut pas le contenu de ce que vous traitez.**
- **Cela fonctionne hors ligne.** Comme le travail est local, les agents peuvent fonctionner même sans internet pendant une période de tolérance ; une connexion n'est nécessaire que pour revalider la licence.
- **Les fonctions de rédaction par IA sont l'exception encadrée.** Certaines fonctions optionnelles (par exemple, générer un résumé) envoient un fragment du texte à un moteur d'IA pour rédiger la réponse. Cela est indiqué sur chaque fonction, et les tâches de détection et d'organisation ne le requièrent pas.

---

## 3. Ce que la plateforme reçoit et ce qu'elle ne reçoit pas

**Ce que la plateforme REÇOIT (le minimum pour valider votre licence) :**

- Votre **clé de licence**.
- L'**état de votre abonnement** (actif, en essai, expiré).
- Un **identifiant technique de l'appareil** (une empreinte dérivée du matériel) pour lier la licence à votre appareil et empêcher toute utilisation non autorisée.

**Ce qu'elle ne reçoit JAMAIS :**

- Le contenu de vos **fichiers, documents, contrats, factures, e-mails ou bases de données**.
- Les **données que vous traitez** avec l'agent, ni les résultats de ce traitement.
- Toute information personnelle ou confidentielle contenue dans le matériel que vous analysez.

Autrement dit : nous recevons juste ce qu'il faut pour savoir que vous avez le droit d'utiliser le logiciel, et rien de ce que le logiciel lit ou produit.

---

## 4. Comment le vérifier vous-même

Nous ne vous demandons pas une confiance aveugle. Comme l'agent s'exécute sur votre machine, vous pouvez le vérifier :

- **Surveillez les connexions réseau de l'agent** avec les outils de votre système d'exploitation ou un analyseur de trafic (par exemple, un pare-feu, le `Moniteur de ressources` sous Windows, `Little Snitch` sous macOS ou `Wireshark`). Vous constaterez que les connexions se limitent à la validation de licence et, le cas échéant, au moteur d'IA des fonctions optionnelles.
- **Constatez que vos fichiers ne sont pas transmis.** Le contenu de vos documents n'apparaît pas dans le trafic sortant pendant l'analyse locale.
- **Déconnectez-vous d'internet.** Les fonctions locales (détection, extraction, organisation) continuent de fonctionner pendant la période de tolérance, ce qui confirme que le traitement ne dépend pas de nos serveurs.

Votre équipe informatique peut effectuer ces vérifications dans le cadre de sa propre évaluation de sécurité.

---

## 5. Un atout pour votre conformité

Le fait que les données ne quittent pas votre contrôle favorise votre conformité réglementaire, car cela réduit la surface d'exposition et évite les transferts à des tiers. Cette conception vous aide à vous aligner sur des cadres tels que :

- **RGPD** (Règlement général sur la protection des données, Union européenne).
- **LFPDPPP** (Loi fédérale sur la protection des données personnelles détenues par les particuliers, Mexique).
- **LGPD** (Lei Geral de Proteção de Dados, Brésil).
- Et d'autres réglementations locales de protection des données.

En maintenant le traitement sur votre machine, **vous restez le responsable et le dépositaire de vos données**, sans intermédiaire pour les recevoir ou les stocker. Cela simplifie vos analyses d'impact, vos registres de traitement et vos obligations envers les tiers.

Ce document décrit une architecture ; il ne constitue ni un conseil juridique ni une certification de conformité. La responsabilité de respecter la réglementation applicable à votre organisation vous incombe toujours.

---

## 6. Mention légale

Le présent Engagement de traitement local et de confidentialité décrit la conception technique de nos agents et **est complété par nos Conditions générales et notre Politique de confidentialité**, qui régissent l'ensemble de la relation contractuelle. En cas de divergence, ces documents prévalent.

Cet engagement est une déclaration d'architecture vérifiable, non une garantie absolue contre tout scénario possible. Nous vous recommandons de **valider son application selon la réglementation en vigueur dans votre pays et votre secteur**, et d'impliquer vos équipes juridique et de sécurité avant de prendre des décisions de conformité fondées sur ce document.

Pour toute question sur cet engagement, écrivez-nous à **privacidad@tuialista.com**.
