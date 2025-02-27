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
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.table.rows;

    const select = document.getElementById(campo);
    rows.forEach(row => {
      const option = document.createElement('option');
      option.value = row.c[0].v;
      option.textContent = row.c[0].v;
      select.appendChild(option);
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

// Salva os dados no SheetDB
document.getElementById('atendimentoForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    dataAtendimento: document.getElementById('dataAtendimento').value,
    escola: document.getElementById('escola').value,
    gestor: document.getElementById('gestor').value,
    profissional: document.getElementById('profissional').value,
    especialidade: document.getElementById('especialidade').value,
    demanda: document.getElementById('demanda').value,
    estudante: document.getElementById('estudante').value,
    status: document.getElementById('status').value,
    situacao: document.getElementById('situacao').value,
    observacao: document.getElementById('observacao').value
  };

  try {
    const response = await fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [formData] })
    });

    if (response.ok) {
      alert('Atendimento salvo com sucesso!');
      document.getElementById('atendimentoForm').reset();
      document.getElementById('dataAtendimento').value = getDataAtual();
    } else {
      alert('Erro ao salvar o atendimento.');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    alert('Erro ao salvar o atendimento.');
  }
});
