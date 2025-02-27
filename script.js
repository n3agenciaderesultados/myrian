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

// Dados estáticos
const escolas = [
  "2 DE JULHO", "ALBERTO ARANDY", "ANISIO TEIXEIRA", "ARLINDO ARAUJO", "BOAVENTURA",
  "CASTRO ALVES", "CENTRO DA ESPERANÇA", "CLERISTON ANDRADE", "DOM TIAGO", "GENTE INOCENTE",
  "HENRIQUE TEIXEIRA", "LUIS VIANA", "MAE DEJANIRA", "MARIA JOAQUINA", "MEDICI",
  "MONTEIRO LOBATO", "RUI BARBOSA", "SAO JOSE", "SEMENTE DA PAZ", "SORRISO INFANTIL",
  "AEE", "ALTO DO CRUZEIRO"
];

const gestores = [
  "MARCIA", "ISNELMA", "ROSEMEIRE", "DEILMA", "SOLANGE", "ALEX", "CASSIANE", "POLIANA",
  "ESTEILDA", "ITAMAR", "ANGELA", "JOCELIA", "TELMA", "ANDREIA", "IOLANDA", "KARINA",
  "ELIANE", "ADELSO", "MANUELA", "IVONETE", "MARIA CASTRO", "JOSY"
];

const profissionais = [
  "BIANCA", "EVANICE", "LUCINEIA", "MARIA CASTRO", "MYRIAM", "RUBENILDE", "KRIS",
  "ISNANDA", "MARIANA", "SANDRA", "MARIANA LESSA"
];

const especialidades = [
  "ASSISTENTE SOCIAL", "PSICOLOGA", "PSICOPEDAGOGA", "MULTIDISCIPLINAR", "DIRETORA DO AEE",
  "COORDENADORA DA EDUCAÇÃO ESPECIAL"
];

const demandas = [
  "ANSIEDADE", "DIFICULDADE DE APRENDIZAGEM", "PARALISIA CEREBRAL", "QUESTÕES COMPORTAMENTAIS",
  "QUESTÕES EMOCIONAIS", "SINTOMAS DE DI", "SINTOMAS DE TDAH", "SINTOMAS DE TEA", "SINTOMAS DE TOD",
  "SECRETARIA DE ASSISTENCIA SOCIAL", "SECRETARIA DE SAUDE", "CAJUM", "CAPS", "CREAS", "CRAS",
  "POLICLINICA", "REGULAÇÃO", "VISITA DOMICILIAR", "CEPROESTE", "UNIDADE ESCOLAR",
  "FORMAÇÃO DE PROFESSORES", "SINTOMAS DE ALTAS HABILIDADES", "PROBLEMAS AUDITIVOS", "AMI",
  "DIFICULDADE NA FALA", "VISITA ESCOLAR"
];

const statusList = [
  "ALTA", "EM ACOMPANHAMENTO NO CAPS", "ENC. FONO", "ENC. NEURO", "ENC. POLICLÍNICA",
  "ENC. PSICÓLOGA", "ENC. PSICOPEDAGOGO", "NÃO COMPARECEU", "CONCLUÍDO", "EM ANDAMENTO",
  "FAZ ACOMPANHAMENTO NO AMI", "FAZ ACOMPANHAMENTO PARTICULAR", "ENC. PARA O AMI"
];

// Preenche um campo de seleção com dados estáticos
function preencherSelect(selectId, dados) {
  const select = document.getElementById(selectId);
  dados.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

// Preenche o campo de estudante com dados da planilha
async function carregarEstudantes() {
  const query = `SELECT G WHERE G IS NOT NULL`;
  const url = `${GOOGLE_SHEETS_URL}sheet=ALUNOS&tq=${encodeURIComponent(query)}`;

  try {
    console.log(`Carregando dados para o campo estudante`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao acessar a planilha: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Dados recebidos para o campo estudante:`, data);

    const rows = data.table?.rows || [];
    if (rows.length === 0) {
      console.warn(`Nenhum dado encontrado para o campo estudante`);
      return;
    }

    const select = document.getElementById('estudante');
    rows.forEach(row => {
      if (row.c && row.c[0] && row.c[0].v) {
        const option = document.createElement('option');
        option.value = row.c[0].v;
        option.textContent = row.c[0].v;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error(`Erro ao carregar dados para o campo estudante:`, error);
  }
}

// Carrega todos os campos
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dataAtendimento').value = getDataAtual();

  preencherSelect('escola', escolas);
  preencherSelect('gestor', gestores);
  preencherSelect('profissional', profissionais);
  preencherSelect('especialidade', especialidades);
  preencherSelect('demanda', demandas);
  preencherSelect('status', statusList);
  carregarEstudantes();
});

// Salva os dados no SheetDB
document.getElementById('atendimentoForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    numeroAtendimento: document.getElementById('numeroAtendimento').value || 'Auto',
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
