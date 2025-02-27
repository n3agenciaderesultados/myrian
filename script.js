// URL da planilha do Google Sheets
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/13XHWs0ZTqup5b9nTjfUmYQYb6WwXBwdLNmw1qpshXik/gviz/tq?';
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/YOUR_SHEETDB_ID'; // Substitua pelo seu ID do SheetDB

// Função para formatar a data no formato brasileiro (DD/MM/AAAA)
function getDataAtual() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Preenche um campo de seleção com dados do Google Sheets
async function carregarDadosSelect(campo, aba, coluna) {
  const query = `SELECT ${coluna} WHERE ${coluna} IS NOT NULL`;
  const url = `${GOOGLE_SHEETS_URL}sheet=${aba}&tq=${encodeURIComponent(query)}`;

  try {
    console.log(`Carregando dados para o campo ${campo} da aba ${aba}, coluna ${coluna}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao acessar a planilha: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Dados recebidos para o campo ${campo}:`, data);

    const rows = data.table?.rows || [];
    if (rows.length === 0) {
      console.warn(`Nenhum dado encontrado para o campo ${campo} na aba ${aba}, coluna ${coluna}`);
      return;
    }

    const select = document.getElementById(campo);
    rows.forEach(row => {
      if (row.c && row.c[0] && row.c[0].v) {
        const option = document.createElement('option');
        option.value = row.c[0].v;
        option.textContent = row.c[0].v;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error(`Erro ao carregar dados para o campo ${campo}:`, error);
  }
}

// Carrega todos os campos de seleção
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dataAtendimento').value = getDataAtual();

  carregarDadosSelect('escola', 'ALUNOS', 'B');
  carregarDadosSelect('gestor', 'Painel de Cadastros', 'C');
  carregarDadosSelect('profissional', 'Painel de Cadastros', 'D');
  carregarDadosSelect('especialidade', 'Painel de Cadastros', 'E');
  carregarDadosSelect('demanda', 'Painel de Cadastros', 'F');
  carregarDadosSelect('estudante', 'Painel de Cadastros', 'G');
  carregarDadosSelect('status', 'Painel de Cadastros', 'H');
});
