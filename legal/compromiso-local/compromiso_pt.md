# Compromisso de Processamento Local e Privacidade

> **RASCUNHO — Requer revisão jurídica antes da publicação comercial.**

Na TuIAlista construímos os nossos agentes sobre um princípio simples: **o trabalho acontece no seu equipamento e os seus dados ficam com você.** Este documento explica, de forma verificável, como a nossa arquitetura foi projetada para que assim seja.

---

## 1. O nosso compromisso

Os agentes da TuIAlista processam as suas informações **localmente, no seu próprio equipamento**. O conteúdo dos seus arquivos, documentos e dados **não é enviado, não é recebido por nós e não é armazenado** nos nossos servidores.

O nosso papel limita-se a validar que a sua licença está ativa. Toda a análise —ler um contrato, revisar uma fatura, consultar um banco de dados, organizar um e-mail— acontece na máquina onde você instalou o agente.

Este é o maior diferencial da TuIAlista: não somos um serviço na nuvem ao qual você entrega os seus dados. Somos software que roda onde você decide.

---

## 2. Como funciona tecnicamente

- **Os agentes são executados localmente.** São instalados e rodam no seu equipamento. Leem os arquivos que você indica, nas pastas que você define, sem copiá-los nem enviá-los para lugar nenhum.
- **O processamento é local.** A extração de dados, a detecção de padrões e a organização das suas informações acontecem dentro da sua máquina.
- **A plataforma apenas valida a licença.** A única troca com os nossos servidores é uma verificação periódica de que a sua assinatura está ativa. Essa verificação trafega assinada criptograficamente e **não inclui o conteúdo daquilo que você processa.**
- **Funciona sem conexão.** Como o trabalho é local, os agentes podem operar mesmo sem internet durante um período de tolerância; a conexão só é necessária para revalidar a licença.
- **As funções de redação com IA são a exceção delimitada.** Algumas funções opcionais (por exemplo, gerar um resumo) enviam um trecho do texto a um motor de IA para redigir a resposta. Isso é indicado em cada função, e as tarefas de detecção e organização não o exigem.

---

## 3. O que a plataforma recebe e o que não recebe

**O que a plataforma RECEBE (o mínimo para validar a sua licença):**

- A sua **chave de licença**.
- O **estado da sua assinatura** (ativa, em teste, vencida).
- Um **identificador técnico do equipamento** (uma impressão derivada do hardware) para vincular a licença ao seu dispositivo e prevenir uso não autorizado.

**O que NUNCA recebe:**

- O conteúdo dos seus **arquivos, documentos, contratos, faturas, e-mails ou bancos de dados**.
- Os **dados que você processa** com o agente nem os resultados desse processamento.
- Qualquer informação pessoal ou confidencial contida no material que você analisa.

Em outras palavras: recebemos apenas o suficiente para saber que você tem direito de usar o software, e nada do que o software lê ou produz.

---

## 4. Como você mesmo pode verificar

Não pedimos que você confie às cegas. Como o agente roda no seu equipamento, você pode comprovar:

- **Monitore as conexões de rede do agente** com as ferramentas do seu sistema operacional ou um analisador de tráfego (por exemplo, um firewall, o `Resource Monitor` no Windows, o `Little Snitch` no macOS ou o `Wireshark`). Você verá que as conexões se limitam à validação de licença e, quando aplicável, ao motor de IA das funções opcionais.
- **Observe que os seus arquivos não são transmitidos.** O conteúdo dos seus documentos não aparece no tráfego de saída durante a análise local.
- **Desconecte-se da internet.** As funções locais (detecção, extração, organização) continuam funcionando dentro do período de tolerância, o que confirma que o processamento não depende dos nossos servidores.

A sua equipe de TI pode realizar essas verificações no âmbito da sua própria avaliação de segurança.

---

## 5. Vantagem para a sua conformidade

Manter os dados fora do alcance de terceiros favorece a sua conformidade regulatória, pois reduz a superfície de exposição e evita transferências a terceiros. Este design ajuda você a se alinhar com marcos como:

- **GDPR** (Regulamento Geral sobre a Proteção de Dados, União Europeia).
- **LFPDPPP** (Lei Federal de Proteção de Dados Pessoais em Posse de Particulares, México).
- **LGPD** (Lei Geral de Proteção de Dados, Brasil).
- E outras normas locais de proteção de dados.

Ao manter o processamento no seu equipamento, **você continua sendo o responsável e o custodiante dos seus dados**, sem intermediários que os recebam ou armazenem. Isso simplifica as suas avaliações de impacto, os seus registros de tratamento e as suas obrigações perante terceiros.

Este documento descreve uma arquitetura; não constitui aconselhamento jurídico nem uma certificação de conformidade. A responsabilidade de cumprir a normativa aplicável à sua organização continua sendo sua.

---

## 6. Nota legal

Este Compromisso de Processamento Local e Privacidade descreve o desenho técnico dos nossos agentes e **é complementado pelos nossos Termos e Condições e pela nossa Política de Privacidade**, que regem a relação contratual completa. Em caso de divergência, prevalecem esses documentos.

Este compromisso é uma declaração de arquitetura verificável, não uma garantia absoluta contra todo cenário possível. Recomendamos que você **valide a sua aplicação de acordo com a normativa vigente no seu país e setor** e envolva as suas equipes jurídica e de segurança antes de tomar decisões de conformidade com base neste documento.

Se tiver dúvidas sobre este compromisso, escreva para **privacidad@tuialista.com**.
