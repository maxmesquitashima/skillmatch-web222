// Módulo para buscar dados e tratar os estados: carregando, vazio, erro
// Além de helpers simples para persistir o perfil no localStorage

const PERFIL_KEY = 'skillmatch_perfil_v1';

export async function carregarDados(url, callbacks = {}) {
  const { onCarregando, onSucesso, onVazio, onErro } = callbacks;

  try {
    if (typeof onCarregando === 'function') onCarregando();

    const resposta = await fetch(url, { cache: 'no-store' });

    if (!resposta.ok) {
      const erro = new Error(`Erro ao buscar dados: ${resposta.status} ${resposta.statusText}`);
      if (typeof onErro === 'function') onErro(erro);
      return { status: 'erro', error: erro, data: null };
    }

    const dados = await resposta.json();

    const isEmpty =
      dados == null ||
      (Array.isArray(dados) && dados.length === 0) ||
      (typeof dados === 'object' && !Array.isArray(dados) && Object.keys(dados).length === 0);

    if (isEmpty) {
      if (typeof onVazio === 'function') onVazio();
      return { status: 'vazio', data: dados };
    }

    if (typeof onSucesso === 'function') onSucesso(dados);
    return { status: 'pronto', data: dados };
  } catch (error) {
    if (typeof onErro === 'function') onErro(error);
    return { status: 'erro', error, data: null };
  }
}

// Helper específico para as vagas locais — caminho relativo à página
export async function carregarVagas(callbacks = {}) {
  return carregarDados('./assets/dados/vagas.json', callbacks);
}

export default carregarVagas;

// Persistência do perfil (localStorage)
export function salvarPerfil(perfil) {
  try {
    localStorage.setItem(PERFIL_KEY, JSON.stringify(perfil));
    return true;
  } catch (e) {
    console.error('Erro ao salvar perfil:', e);
    return false;
  }
}

export function carregarPerfil() {
  try {
    const raw = localStorage.getItem(PERFIL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao carregar perfil:', e);
    return null;
  }
}

// Persistência do tema
const TEMA_KEY = 'skillmatch_tema_v1';

export function salvarTema(tema) {
  try {
    localStorage.setItem(TEMA_KEY, tema);
  } catch (e) {
    console.error('Erro ao salvar tema:', e);
  }
}

export function carregarTema() {
  try {
    return localStorage.getItem(TEMA_KEY) || 'light';
  } catch (e) {
    return 'light';
  }
}
