import carregarVagas, { salvarPerfil, carregarPerfil, salvarTema, carregarTema } from './dados.js';
import { Vaga, VagaFrontEnd } from './motor.js';
import { renderProfileForm, renderStatus, renderVagas, renderMelhorVaga, renderFiltersBar } from './ui.js';

// Contador por closure para rastrear quantas análises foram feitas na sessão
function criarContador() {
  let contador = 0;
  return {
    incrementar() { contador += 1; return contador; },
    valor() { return contador; }
  };
}
const contadorAnalises = criarContador();

// Monta a UI básica e orquestra o fluxo

const app = document.getElementById('app') || document.body;

let cabecalho = document.querySelector('header');
if (!cabecalho) {
  cabecalho = document.createElement('header');
  const left = document.createElement('div');
  left.className = 'header-left';
  // logo do projeto
  const imgLogo = document.createElement('img');
  imgLogo.src = './assets/img/logo.png';
  imgLogo.alt = 'SkillMatch logo';
  imgLogo.className = 'logo';
  // título e subtítulo
  const titleContainer = document.createElement('div');
  titleContainer.style.display = 'flex';
  titleContainer.style.flexDirection = 'column';

  const h1 = document.createElement('h1');
  h1.innerHTML = 'SkillMatch<span style="color: var(--accent)">-Web</span>';

  const subtitle = document.createElement('span');
  subtitle.textContent = 'connecting talent & opportunity';
  subtitle.className = 'small text-muted';
  subtitle.style.fontStyle = 'italic';
  subtitle.style.marginTop = '-2px';

  titleContainer.appendChild(h1);
  titleContainer.appendChild(subtitle);

  left.appendChild(imgLogo);
  left.appendChild(titleContainer);
  cabecalho.appendChild(left);
  
  // theme toggle
  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.textContent = carregarTema() === 'dark' ? '☀️ Claro' : '🌙 Escuro';
  themeBtn.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    const newTheme = isDark ? 'dark' : 'light';
    salvarTema(newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '☀️ Claro' : '🌙 Escuro';
  };
  cabecalho.appendChild(themeBtn);

  app.prepend(cabecalho);
}

// aplica o tema inicial salvo
if (carregarTema() === 'dark') {
  document.body.classList.add('dark-mode');
}

let mainEl = document.querySelector('main');
if (!mainEl) {
  mainEl = document.createElement('main');
  mainEl.id = 'main-content';
  app.appendChild(mainEl);
}

// containers
const perfilContainer = document.getElementById('perfil-container') || document.createElement('div');
perfilContainer.id = 'perfil-container';
mainEl.appendChild(perfilContainer);

const rightPanel = document.getElementById('right-panel') || document.createElement('div');
rightPanel.id = 'right-panel';
rightPanel.className = 'right-panel';
mainEl.appendChild(rightPanel);

const statusEl = document.getElementById('status') || document.createElement('div');
statusEl.id = 'status';
statusEl.setAttribute('aria-live', 'polite');
rightPanel.appendChild(statusEl);

const filtrosContainer = document.getElementById('filtros') || document.createElement('div');
filtrosContainer.id = 'filtros';
rightPanel.appendChild(filtrosContainer);

const resultadoContainer = document.getElementById('resultado') || document.createElement('div');
resultadoContainer.id = 'resultado';
rightPanel.appendChild(resultadoContainer);

let currentResultados = [];
let currentFilter = { modalidade: '', sort: 'compatibilidade' };

function aplicarFiltrosERenderizar() {
  let filtrados = [...currentResultados];
  
  if (currentFilter.modalidade) {
    filtrados = filtrados.filter(res => res.vaga.modalidade === currentFilter.modalidade);
  }
  
  if (currentFilter.sort === 'salario') {
    const parseSalario = (s) => parseFloat(s.replace(/\\D/g, '')) || 0;
    filtrados.sort((a, b) => parseSalario(b.vaga.salario) - parseSalario(a.vaga.salario));
  } else {
    filtrados.sort((a, b) => b.percentual - a.percentual);
  }
  
  const melhor = filtrados.reduce((melhorAtual, atual) => {
    if (!melhorAtual) return atual;
    if (atual.percentual > melhorAtual.percentual) return atual;
    return melhorAtual;
  }, null);
  
  renderMelhorVaga(resultadoContainer, melhor);
  renderVagas(resultadoContainer, filtrados);
}

// carregar perfil salvo
const perfilSalvo = carregarPerfil();

async function analisarPerfil(perfil) {
  // incrementar contador (closure)
  const n = contadorAnalises.incrementar();

  // salvar perfil
  salvarPerfil(perfil);

  // iniciar carregamento de vagas
  renderStatus(statusEl, `Carregando vagas... (análise #${n})`);

  const res = await carregarVagas({
    onCarregando: () => renderStatus(statusEl, `Carregando vagas... (análise #${n})`),
    onVazio: () => renderStatus(statusEl, `Nenhuma vaga encontrada. (análise #${n})`),
    onErro: (err) => renderStatus(statusEl, `Erro ao carregar vagas: ${err.message} (análise #${n})`),
    onSucesso: () => renderStatus(statusEl, `Vagas carregadas. (análise #${n})`),
  });

  if (res.status === 'erro') {
    // mensagem já atualizada via callback
    resultadoContainer.innerHTML = '';
    return;
  }

  const dados = res.data || [];

  // transformar em instâncias de Vaga (usar map)
  const vagas = dados.map(v => {
    // exemplo: se cargo contiver 'Front' usar VagaFrontEnd, senão Vaga
    if (/(front|frontend|front-end)/i.test(v.cargo)) return new VagaFrontEnd(v);
    return new Vaga(v);
  });

  // calcular compatibilidade (map)
  currentResultados = vagas.map(vaga => vaga.calcularCompatibilidade(perfil));

  renderFiltersBar(filtrosContainer, (novoFiltro) => {
    currentFilter = novoFiltro;
    aplicarFiltrosERenderizar();
  });

  aplicarFiltrosERenderizar();

  renderStatus(statusEl, `Análise #${n} finalizada. Encontradas ${currentResultados.length} vagas.`);
}

renderProfileForm(perfilContainer, perfilSalvo || {}, (perfil) => {
  analisarPerfil(perfil);
});

// Se havia perfil salvo, submetemos automaticamente para mostrar resultados ao abrir
if (perfilSalvo) {
  // chamar analisarPerfil com o perfil salvo
  analisarPerfil(perfilSalvo);
}
