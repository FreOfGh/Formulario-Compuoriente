// src/pdf/renderTemplate.js
const fs = require('fs');

function renderTemplate(templatePath, data) {
  let html = fs.readFileSync(templatePath, 'utf8');

  for (const key in data) {
    const value = data[key] ?? '';
    html = html.replaceAll(`{{${key}}}`, String(value));
  }

  return html;
}

module.exports = { renderTemplate };
