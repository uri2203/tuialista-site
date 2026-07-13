# Compromiso de Procesamiento Local y Privacidad

> **BORRADOR — Requiere revisión legal antes de publicación comercial.**

En TuIAlista construimos nuestros agentes sobre un principio simple: **el trabajo ocurre en tu equipo y tus datos se quedan contigo.** Este documento explica, de forma verificable, cómo está diseñada nuestra arquitectura para que así sea.

---

## 1. Nuestro compromiso

Los agentes de TuIAlista procesan tu información **localmente, en tu propio equipo**. El contenido de tus archivos, documentos y datos **no se envía, no lo recibimos y no lo almacenamos** en nuestros servidores.

Nuestro papel se limita a validar que tu licencia esté activa. Todo el análisis —leer un contrato, revisar una factura, consultar una base de datos, organizar un correo— sucede en la máquina donde instalaste el agente.

Este es el mayor diferenciador de TuIAlista: no somos un servicio en la nube al que le entregas tus datos. Somos software que corre donde tú decides.

---

## 2. Cómo funciona técnicamente

- **Los agentes se ejecutan localmente.** Se instalan y corren en tu equipo. Leen los archivos que tú les indicas, en las carpetas que tú defines, sin copiarlos ni subirlos a ningún lado.
- **El procesamiento es local.** La extracción de datos, la detección de patrones y la organización de tu información ocurren dentro de tu máquina.
- **La plataforma solo valida la licencia.** El único intercambio con nuestros servidores es una comprobación periódica de que tu suscripción está activa. Esa comprobación viaja firmada criptográficamente y **no incluye el contenido de lo que procesas.**
- **Funciona sin conexión.** Como el trabajo es local, los agentes pueden operar incluso sin internet durante un periodo de tolerancia; la conexión solo se necesita para revalidar la licencia.
- **Las funciones de redacción con IA son la excepción acotada.** Algunas funciones opcionales (por ejemplo, generar un resumen) envían un fragmento del texto a un motor de IA para redactar la respuesta. Esto se indica en cada función, y las tareas de detección y organización no lo requieren.

---

## 3. Qué recibe la plataforma y qué no

**Lo que SÍ recibe la plataforma (lo mínimo para validar tu licencia):**

- Tu **clave de licencia**.
- El **estado de tu suscripción** (activa, en prueba, vencida).
- Un **identificador técnico del equipo** (una huella derivada del hardware) para vincular la licencia a tu dispositivo y prevenir uso no autorizado.

**Lo que NO recibe NUNCA:**

- El contenido de tus **archivos, documentos, contratos, facturas, correos o bases de datos**.
- Los **datos que procesas** con el agente ni los resultados de ese procesamiento.
- Cualquier información personal o confidencial contenida en el material que analizas.

En otras palabras: recibimos lo justo para saber que tienes derecho a usar el software, y nada de lo que el software lee o produce.

---

## 4. Cómo puedes verificarlo tú mismo

No te pedimos que confíes a ciegas. Como el agente corre en tu equipo, puedes comprobarlo:

- **Monitorea las conexiones de red del agente** con las herramientas de tu sistema operativo o un analizador de tráfico (por ejemplo, un cortafuegos, `Resource Monitor` en Windows, `Little Snitch` en macOS, o `Wireshark`). Verás que las conexiones se limitan a la validación de licencia y, cuando corresponda, al motor de IA de las funciones opcionales.
- **Observa que tus archivos no se transmiten.** El contenido de tus documentos no aparece en el tráfico saliente durante el análisis local.
- **Desconéctate de internet.** Las funciones locales (detección, extracción, organización) siguen funcionando dentro del periodo de tolerancia, lo que confirma que el procesamiento no depende de nuestros servidores.

Tu equipo de TI puede realizar estas verificaciones en el marco de su propia evaluación de seguridad.

---

## 5. Ventaja para tu cumplimiento

Que los datos no salgan de tu control facilita tu cumplimiento normativo, porque reduce la superficie de exposición y evita transferencias a terceros. Este diseño te ayuda a alinearte con marcos como:

- **GDPR** (Reglamento General de Protección de Datos, Unión Europea).
- **LFPDPPP** (Ley Federal de Protección de Datos Personales en Posesión de los Particulares, México).
- **LGPD** (Lei Geral de Proteção de Dados, Brasil).
- Y otras normativas locales de protección de datos.

Al mantener el procesamiento en tu equipo, **tú sigues siendo el responsable y custodio de tus datos**, sin intermediarios que los reciban o almacenen. Esto simplifica tus evaluaciones de impacto, tus registros de tratamiento y tus obligaciones frente a terceros.

Este documento describe una arquitectura, no constituye asesoría legal ni una certificación de cumplimiento. La responsabilidad de cumplir con la normativa aplicable a tu organización sigue siendo tuya.

---

## 6. Nota legal

Este Compromiso de Procesamiento Local y Privacidad describe el diseño técnico de nuestros agentes y **se complementa con nuestros Términos y Condiciones y nuestra Política de Privacidad**, que rigen la relación contractual completa. En caso de discrepancia, prevalecen esos documentos.

Este compromiso es una declaración de arquitectura verificable, no una garantía absoluta frente a todo escenario posible. Te recomendamos **validar su aplicación según la normativa vigente en tu país y sector**, e involucrar a tu equipo legal y de seguridad antes de tomar decisiones de cumplimiento basadas en este documento.

Si tienes preguntas sobre este compromiso, escríbenos a **privacidad@tuialista.com**.
