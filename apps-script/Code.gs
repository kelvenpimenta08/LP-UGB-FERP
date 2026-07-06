/**
 * ============================================================
 *  MEDICINA UGB/FERP · Recebedor de Leads (Google Apps Script)
 *  Salva cada lead do formulário em uma aba do Google Sheets.
 * ============================================================
 *
 *  COMO INSTALAR (5 minutos), passo a passo no README.md:
 *  1. Crie uma planilha em https://sheets.google.com
 *  2. Menu Extensões > Apps Script
 *  3. Apague o conteúdo e cole ESTE arquivo
 *  4. Ajuste SHEET_NAME se quiser
 *  5. Implantar > Nova implantação > Tipo: "App da Web"
 *       - Executar como: Eu
 *       - Quem pode acessar: "Qualquer pessoa"
 *  6. Copie a URL /exec gerada e cole em js/config.js (LEADS_ENDPOINT)
 *  7. (Opcional) Preencha NOTIFY_EMAIL para receber cada lead por e-mail
 */

var SHEET_NAME  = "Leads Medicina";
var NOTIFY_EMAIL = ""; // ex.: "comercial@ugb.edu.br" (deixe "" para não enviar)

var HEADERS = [
  "Data/Hora", "Nome", "WhatsApp", "E-mail", "Cidade",
  "Interesse", "Melhor horário", "Origem (utm_source)", "Campanha (utm_campaign)",
  "Mídia (utm_medium)", "Conteúdo (utm_content)", "Termo (utm_term)",
  "gclid", "fbclid", "Página"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.nome || "",
      data.telefone || "",
      data.email || "",
      data.cidade || "",
      data.interesse || "",
      data.horario || "",
      data.utm_source || "",
      data.utm_campaign || "",
      data.utm_medium || "",
      data.utm_content || "",
      data.utm_term || "",
      data.gclid || "",
      data.fbclid || "",
      data.pagina || ""
    ]);

    if (NOTIFY_EMAIL) notify_(data);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// GET só para testar se está no ar (abra a URL /exec no navegador)
function doGet() {
  return json_({ ok: true, service: "Leads Medicina UGB/FERP", status: "online" });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#062a5a").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify_(data) {
  var body =
    "Novo lead · Medicina UGB/FERP\n\n" +
    "Nome: " + (data.nome || "") + "\n" +
    "WhatsApp: " + (data.telefone || "") + "\n" +
    "E-mail: " + (data.email || "") + "\n" +
    "Cidade: " + (data.cidade || "") + "\n" +
    "Interesse: " + (data.interesse || "") + "\n" +
    "Melhor horário: " + (data.horario || "") + "\n" +
    "Origem: " + (data.utm_source || "direto") + " / " + (data.utm_campaign || "") + "\n";
  MailApp.sendEmail(NOTIFY_EMAIL, "🎓 Novo lead Medicina: " + (data.nome || ""), body);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
