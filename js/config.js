/* =============================================================
   CONFIGURAÇÃO DA LANDING PAGE · MEDICINA UGB/FERP
   -------------------------------------------------------------
   Edite APENAS este arquivo para conectar a página.
   Nada aqui exige conhecimento técnico avançado.
   ============================================================= */
window.LP_CONFIG = {

  /* 1) WHATSAPP -------------------------------------------------
     Número no formato internacional, só dígitos:
     55 (Brasil) + DDD + número.  Ex.: (24) 3345-1705 => 552433451705
     >> Troque pelo WhatsApp da equipe comercial. */
  WHATSAPP_NUMBER: "552433451705",
  WHATSAPP_MESSAGE: "Olá! Tenho interesse no curso de Medicina do UGB/FERP e gostaria de mais informações.",

  /* 2) ARMAZENAMENTO DOS LEADS (Google Sheets) -----------------
     Cole aqui a URL /exec do Google Apps Script (veja README.md,
     passo a passo em "Google Sheets"). Enquanto estiver vazio, o
     formulário funciona em modo demonstração (salva no navegador
     e segue para o WhatsApp). */
  LEADS_ENDPOINT: "https://script.google.com/macros/s/AKfycbzS7RcZBVBfeJycvNTA9X-wob0oRyi4XEYBPoi3JRSQblQSeq0v2VP4ZM_XnVhJaucTsw/exec",

  /* 3) RASTREAMENTO / PIXELS -----------------------------------
     Preencha os IDs quando tiver. Vazio = desativado (sem erros). */
  GTM_ID: "",          // Google Tag Manager, ex.: "GTM-XXXXXXX"
  META_PIXEL_ID: "",   // Meta Pixel, ex.: "123456789012345"
  GA4_ID: "",          // Google Analytics 4, ex.: "G-XXXXXXXXXX"

  /* 4) DESTINO APÓS ENVIO --------------------------------------
     true  = após enviar o formulário, abre o WhatsApp automaticamente.
     false = apenas mostra a mensagem de sucesso (WhatsApp fica opcional).
     OBS: se REDIRECT_URL abaixo estiver preenchido, o redirecionamento
     tem prioridade e esta opção é ignorada. */
  OPEN_WHATSAPP_AFTER_SUBMIT: true,

  /* 5) REDIRECIONAMENTO APÓS ENVIO -----------------------------
     Cole aqui o link do site para onde a pessoa deve ser levada após
     enviar o formulário. Assim, UM clique no botão faz as DUAS coisas:
     (1) salva o lead na planilha e (2) redireciona para este endereço.
     O envio do lead é garantido mesmo com o redirecionamento (sendBeacon).
     Deixe vazio ("") para NÃO redirecionar. Ex.: "https://seusite.com/obrigado" */
  REDIRECT_URL: ""
};

/* =============================================================
   CONTEÚDO EDITÁVEL DA PÁGINA
   -------------------------------------------------------------
   Aqui você troca textos e imagens SEM mexer em HTML.
   Edite o que está entre aspas, salve e recarregue a página.
   ============================================================= */
window.LP_CONTENT = {

  /* BANNER (imagem de destaque entre as seções).
     Coloque o arquivo em assets/img/ e aponte o caminho aqui.
     Para trocar por outra imagem, é só mudar o nome do arquivo. */
  BANNERS: [
    "assets/img/banner-docente.jpg"
  ],

  /* CARDS DE FINANCIAMENTO (título e texto de cada um).
     Pode usar <strong style="color:#fff">destaque</strong> no texto. */
  FINANCIAMENTO: [
    { titulo: "Sicoob · Faça Acontecer",
      texto: "Financie o valor do semestre de Medicina e pague em um prazo maior, em <strong style=\"color:#fff\">até 12 parcelas</strong>. Sujeito à análise de crédito." },
    { titulo: "Unicred · Uni4Life",
      texto: "Financie <strong style=\"color:#fff\">até 100%</strong> do valor do semestre, contratado por semestre letivo, sem acumular parcelas futuras. Sujeito à análise de crédito." },
    { titulo: "Pravaler",
      texto: "Reduza o valor pago por mês durante a graduação. Contratação <strong style=\"color:#fff\">online</strong>, com simulação rápida e análise de crédito." }
  ],

  /* DEPOIMENTOS (frase, nome e papel de cada aluno). */
  DEPOIMENTOS: [
    { texto: "Escolhi o UGB pela prática desde o começo. Ter contato com pacientes cedo mudou minha forma de estudar e me deu muito mais segurança.",
      nome: "Ana Luíza M.", papel: "Estudante de Medicina" },
    { texto: "Fiz minha transferência e foi a melhor decisão. A estrutura dos laboratórios e o preparo dos professores são de outro nível.",
      nome: "Rafael C.", papel: "Transferência · 4º período" },
    { texto: "A Rede Escola de Saúde me colocou dentro do SUS de verdade. É onde eu percebi que fiz a escolha certa pela Medicina.",
      nome: "Júlia S.", papel: "Estudante de Medicina" }
  ]
};
