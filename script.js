// URL da API do SheetDB
const SHEETDB_SAVE_API_URL = 'https://sheetdb.io/api/v1/rr2wjjs799zb1'; // Substitua pelo seu ID do SheetDB

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

// Carrega todos os campos
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dataAtendimento').value = getDataAtual();

  preencherSelect('escola', escolas);
  preencherSelect('gestor', gestores);
  preencherSelect('profissional', profissionais);
  preencherSelect('especialidade', especialidades);
  preencherSelect('demanda', demandas);
  preencherSelect('status', statusList);
});

// Salva os dados no SheetDB
document.getElementById('atendimentoForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Coleta os dados do formulário
  const formData = {
    dataAtendimento: document.getElementById('dataAtendimento').value,
    escola: document.getElementById('escola').value,
    gestor: document.getElementById('gestor').value,
    profissional: document.getElementById('profissional').value,
    especialidade: document.getElementById('especialidade').value,
    demanda: document.getElementById('demanda').value,
    estudante: document.getElementById('estudante').value.toUpperCase(), // Garante que o nome esteja em maiúsculo
    status: document.getElementById('status').value,
    situacao: document.getElementById('situacao').value,
    observacao: document.getElementById('observacao').value
  };

  console.log("Dados a serem enviados:", { data: [formData] }); // Log dos dados

  try {
    const response = await fetch(SHEETDB_SAVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [formData] }) // Envio dos dados
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Captura detalhes do erro
      console.error("Erro na resposta da API:", errorDetails);
      alert(`Erro ao salvar o atendimento. Detalhes: ${errorDetails}`);
      return;
    }

    alert('Atendimento salvo com sucesso!');
    document.getElementById('atendimentoForm').reset();
    document.getElementById('dataAtendimento').value = getDataAtual();
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    alert('Erro ao salvar o atendimento.');
  }
});
