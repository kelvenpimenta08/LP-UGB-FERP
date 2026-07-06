# Landing Page — Medicina UGB/FERP

LP de **captação de leads** para o curso de Medicina, focada em conversão pelo formulário e handoff para WhatsApp. Página estática (HTML/CSS/JS puro), leve e rápida — pode ser publicada em qualquer hospedagem.

---

## 📁 Estrutura

```
lp-medicina/
├── index.html              # A página completa
├── css/styles.css          # Estilos (identidade visual UGB/FERP)
├── js/
│   ├── config.js           # ⚙️ ÚNICO arquivo que você precisa editar
│   └── main.js             # Lógica: formulário, validação, tracking, WhatsApp
├── assets/img/             # Logo e fotos reais da instituição
└── apps-script/Code.gs     # Script para salvar leads no Google Sheets
```

---

## 🚀 Como colocar no ar (resumo)

1. **Edite `js/config.js`** com o WhatsApp, o endpoint de leads e os pixels.
2. **Suba a pasta `lp-medicina/`** para sua hospedagem (Hostinger, cPanel, Vercel, Netlify, etc.).
3. Pronto. A página já funciona.

> Para testar localmente: abra a pasta no terminal e rode `python3 -m http.server 8000`, depois acesse `http://localhost:8000`.

---

## ⚙️ 1. Configuração básica (`js/config.js`)

| Campo | O que fazer |
|---|---|
| `WHATSAPP_NUMBER` | Número da equipe comercial, só dígitos: `55` + DDD + número. **⚠️ Está com `552433451705` (o telefone institucional). Troque pelo WhatsApp comercial que recebe os leads.** |
| `LEADS_ENDPOINT` | URL do Google Sheets (passo 2). Vazio = modo demonstração. |
| `GTM_ID`, `META_PIXEL_ID`, `GA4_ID` | IDs de rastreamento (passo 3). Vazio = desativado. |

---

## 📊 2. Armazenamento dos leads (Google Sheets — recomendado)

Solução **gratuita, segura e sem servidor**. A equipe comercial vê os leads direto na planilha.

1. Crie uma planilha em **[sheets.google.com](https://sheets.google.com)**.
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o código de exemplo e **cole todo o conteúdo de `apps-script/Code.gs`**.
4. *(Opcional)* Preencha `NOTIFY_EMAIL` no topo do script para receber cada lead por e-mail.
5. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize o acesso (é sua própria conta) e **copie a URL que termina em `/exec`**.
7. Cole essa URL em `js/config.js` → `LEADS_ENDPOINT`.

✅ A partir daí, cada envio do formulário vira uma linha na planilha — com nome, WhatsApp, e-mail, cidade, interesse, horário **e a origem do lead (UTMs de campanha)**.

> **Alternativas:** se preferir CRM (RD Station, HubSpot, Pipedrive) ou outro backend, basta trocar a função `sendToSheets()` em `js/main.js` pelo endpoint correspondente. A estrutura já envia um JSON com todos os campos.

### Backup automático
Mesmo sem endpoint (ou se ele falhar), cada lead também é salvo no navegador do visitante (`localStorage`) e o formulário sempre segue para o WhatsApp — nenhum lead se perde no fluxo.

---

## 🎯 3. Pixels e rastreamento

Preencha os IDs em `js/config.js`. A página já dispara os eventos-chave:

| Evento | Quando | Meta Pixel | GA4 / GTM (dataLayer) |
|---|---|---|---|
| Visualização | Ao carregar | `ViewContent` | `view_content` |
| Clique no WhatsApp | Qualquer botão WhatsApp | `Contact` | `whatsapp_click` |
| Envio do formulário | Lead capturado | `Lead` | `generate_lead` |

- **Meta Pixel:** cole o ID (ex.: `123456789012345`) em `META_PIXEL_ID`.
- **Google Tag Manager:** cole o container (ex.: `GTM-XXXXXXX`) em `GTM_ID`.
- **GA4 direto:** cole a medição (ex.: `G-XXXXXXXXXX`) em `GA4_ID`.

No GTM, crie gatilhos de "Evento personalizado" para `whatsapp_click` e `generate_lead` e conecte às suas tags de conversão (Google Ads, etc.).

---

## ✏️ 4. O que revisar antes de publicar

- [ ] **WhatsApp comercial** correto em `config.js`.
- [ ] **Endpoint do Google Sheets** conectado e testado (envie um lead de teste).
- [ ] **Depoimentos:** a seção "Quem vive essa jornada" (`index.html`, bloco `#depoimentos`) está com **exemplos genéricos**. Substitua por depoimentos reais de alunos/aprovados (com autorização de uso de imagem). Está marcada com um comentário `⚠️ PLACEHOLDER`.
- [ ] **Link da Política de Privacidade** (LGPD) no formulário — hoje aponta para `#`. Coloque a URL real.
- [ ] **Valores e condições** (R$ 8.500 / 10.000) — confirme se seguem atuais.
- [ ] **Pixels** preenchidos.

---

## 🎨 Identidade visual (igual ao site oficial)

Cores da marca extraídas do site `medicinaugb.com.br`:
- **Azul** `#084588` (cor principal / `theme-color` oficial)
- **Amarelo** `#FFD200` (destaques, botões, blocos)
- **Vermelho** `#E11B22` (acentos de urgência)
- **Branco** + fotos reais do campus e laboratórios

### Fonte oficial (Roobert) — para ficar idêntico "na letra"
O site usa a fonte **Roobert** (proprietária, arquivos `ROOBERT-*.OTF`). Ela **não é gratuita** e não veio nos arquivos de referência, então a LP usa **Onest** — a fonte gratuita mais parecida — como padrão.

**Para usar a Roobert de verdade** (deixa idêntico ao site, sem eu mexer em mais nada):
1. Pegue os 6 arquivos da fonte nos assets do site de vocês (`ROOBERT-LIGHT/REGULAR/MEDIUM/SEMIBOLD/BOLD/HEAVY.OTF`).
2. Renomeie e coloque em **`assets/fonts/`** exatamente com estes nomes:
   - `Roobert-Light.otf`
   - `Roobert-Regular.otf`
   - `Roobert-Medium.otf`
   - `Roobert-SemiBold.otf`
   - `Roobert-Bold.otf`
   - `Roobert-Heavy.otf`
3. Pronto — a página passa a renderizar em Roobert automaticamente (o CSS já está preparado; se os arquivos não existirem, cai no Onest sem erro).

> Dica: os arquivos ficam no diretório de assets do site publicado. Se preferir, me envie os 6 `.OTF` que eu configuro para você.

---

## 🔧 Técnico

- Sem dependências, sem build. Só arquivos estáticos.
- Responsivo (desktop, tablet, mobile) com barra de CTA fixa no celular.
- SEO: meta tags, Open Graph, `Schema.org` (Course) e HTML semântico.
- Acessibilidade: labels, foco visível, `prefers-reduced-motion`.
- Imagens otimizadas e com `loading="lazy"`.
