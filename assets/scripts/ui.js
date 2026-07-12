// Funções auxiliares de UI: renderização do formulário, status (aria-live) e cards de vagas

export function criarElemento(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('aria')) el.setAttribute(k, v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (c == null) return;
    if (typeof c === 'string') el.appendChild(document.createTextNode(c));
    else el.appendChild(c);
  });
  return el;
}

export function renderProfileForm(container, initialProfile = {}, onSubmit) {
  container.innerHTML = '';

  const form = criarElemento('form', { id: 'perfil-form', 'aria-describedby': 'form-help' });

  const fieldset = criarElemento('fieldset');
  const legend = criarElemento('legend', { text: 'Perfil do candidato' });

  const nomeLabel = criarElemento('label', { for: 'nome', text: 'Nome' });
  const nomeInput = criarElemento('input', { id: 'nome', name: 'nome', type: 'text', required: 'required', 'aria-required': 'true' });
  if (initialProfile.nome) nomeInput.value = initialProfile.nome;
  const nomeError = criarElemento('div', { id: 'nome-error', 'aria-live': 'polite', className: 'field-error small' });

  const areaLabel = criarElemento('label', { for: 'area', text: 'Área' });
  const areaInput = criarElemento('input', { id: 'area', name: 'area', type: 'text', required: 'required', 'aria-required': 'true' });
  if (initialProfile.area) areaInput.value = initialProfile.area;
  const areaError = criarElemento('div', { id: 'area-error', 'aria-live': 'polite', className: 'field-error small' });

  const habilidadesLabel = criarElemento('label', { for: 'habilidades', text: 'Habilidades (separadas por vírgula)' });
  const habilidadesInput = criarElemento('input', { id: 'habilidades', name: 'habilidades', type: 'text', required: 'required', 'aria-required': 'true' });
  if (Array.isArray(initialProfile.habilidades)) habilidadesInput.value = initialProfile.habilidades.join(', ');
  const habilidadesError = criarElemento('div', { id: 'habilidades-error', 'aria-live': 'polite', className: 'field-error small' });

  const experienciaLabel = criarElemento('label', { for: 'experiencia', text: 'Experiência (meses)' });
  const experienciaInput = criarElemento('input', { id: 'experiencia', name: 'experiencia', type: 'number', min: '0' });
  if (initialProfile.experienciaMeses != null) experienciaInput.value = initialProfile.experienciaMeses;

  const submit = criarElemento('button', { type: 'submit', text: 'Analisar vagas' });

  const help = criarElemento('p', { id: 'form-help', className: 'small text-muted', text: 'Preencha os campos obrigatórios e clique em Analisar vagas.' });

  fieldset.append(legend,
    nomeLabel, nomeInput, nomeError,
    areaLabel, areaInput, areaError,
    habilidadesLabel, habilidadesInput, habilidadesError,
    experienciaLabel, experienciaInput,
    submit);
  form.appendChild(fieldset);
  form.appendChild(help);

  function clearErrors() {
    [nomeError, areaError, habilidadesError].forEach(e => e.textContent = '');
    [nomeInput, areaInput, habilidadesInput].forEach(i => i.removeAttribute('aria-invalid'));
    [nomeInput, areaInput, habilidadesInput].forEach(i => {
      i.removeAttribute('aria-invalid');
      i.removeAttribute('aria-describedby');
    });
  }

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    clearErrors();

    let firstInvalid = null;

    // Validação simples
    if (!nomeInput.value.trim()) {
      nomeError.textContent = 'O nome é obrigatório.';
      nomeInput.setAttribute('aria-invalid', 'true');
      nomeInput.setAttribute('aria-describedby', 'nome-error');
      firstInvalid = nomeInput;
    }
    if (!areaInput.value.trim()) {
      areaError.textContent = 'A área é obrigatória.';
      areaInput.setAttribute('aria-invalid', 'true');
      areaInput.setAttribute('aria-describedby', 'area-error');
      if (!firstInvalid) firstInvalid = areaInput;
    }
    if (!habilidadesInput.value.trim()) {
      habilidadesError.textContent = 'Informe ao menos uma habilidade.';
      habilidadesInput.setAttribute('aria-invalid', 'true');
      habilidadesInput.setAttribute('aria-describedby', 'habilidades-error');
      if (!firstInvalid) firstInvalid = habilidadesInput;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const perfil = {
      nome: nomeInput.value.trim(),
      area: areaInput.value.trim(),
      habilidades: habilidadesInput.value.split(',').map(s => s.trim()).filter(Boolean),
      experienciaMeses: experienciaInput.value ? Number(experienciaInput.value) : 0,
    };

    if (typeof onSubmit === 'function') onSubmit(perfil);
  });

  container.appendChild(form);
}

export function renderStatus(ariaLiveEl, message) {
  if (!ariaLiveEl) return;
  ariaLiveEl.textContent = message;
}

export function renderFiltersBar(container, onFilterChange) {
  container.innerHTML = '';
  
  const filtersBar = criarElemento('div', { className: 'filters-bar' });
  
  // Filtro Modalidade
  const modalidadeGroup = criarElemento('div', { className: 'filter-group' });
  const modalidadeLabel = criarElemento('label', { for: 'filter-modalidade', text: 'Modalidade' });
  const modalidadeSelect = criarElemento('select', { id: 'filter-modalidade' });
  modalidadeSelect.append(
    criarElemento('option', { value: '', text: 'Todas as modalidades' }),
    criarElemento('option', { value: 'Remoto', text: 'Remoto' }),
    criarElemento('option', { value: 'Híbrido', text: 'Híbrido' }),
    criarElemento('option', { value: 'Presencial', text: 'Presencial' })
  );
  modalidadeGroup.append(modalidadeLabel, modalidadeSelect);
  
  // Filtro Ordenação
  const sortGroup = criarElemento('div', { className: 'filter-group' });
  const sortLabel = criarElemento('label', { for: 'filter-sort', text: 'Ordenar por' });
  const sortSelect = criarElemento('select', { id: 'filter-sort' });
  sortSelect.append(
    criarElemento('option', { value: 'compatibilidade', text: 'Compatibilidade (Maior primeiro)' }),
    criarElemento('option', { value: 'salario', text: 'Salário (Maior primeiro)' })
  );
  sortGroup.append(sortLabel, sortSelect);
  
  filtersBar.append(modalidadeGroup, sortGroup);
  container.appendChild(filtersBar);
  
  // Event listeners
  modalidadeSelect.addEventListener('change', () => {
    onFilterChange({ modalidade: modalidadeSelect.value, sort: sortSelect.value });
  });
  sortSelect.addEventListener('change', () => {
    onFilterChange({ modalidade: modalidadeSelect.value, sort: sortSelect.value });
  });
}

export function renderVagas(container, resultados = []) {
  container.innerHTML = '';

  if (!Array.isArray(resultados) || resultados.length === 0) {
    container.textContent = 'Nenhuma vaga para exibir.';
    return;
  }

  const grid = criarElemento('div', { className: 'vagas-grid' });

  resultados.forEach(res => {
    const card = criarElemento('article', { className: 'vaga-card', role: 'region', 'aria-label': `${res.vaga.cargo} - ${res.vaga.empresa}` });
    
    let highlight = null;
    if (res.vaga.modalidade) {
      highlight = criarElemento('span', { className: 'highlight-tag', text: res.vaga.modalidade });
    }
    
    const titulo = criarElemento('h3', { text: res.vaga.cargo });
    const empresa = criarElemento('p', { text: `${res.vaga.empresa} ${res.vaga.salario ? ' | ' + res.vaga.salario : ''}` });
    const percentual = criarElemento('p', { text: `Compatibilidade: ${res.percentual}% — ${res.classificacao}` });

    const encontrados = criarElemento('p', { text: `Encontradas: ${res.encontrados.join(', ') || '-'}` });
    const faltantes = criarElemento('p', { text: `Faltantes: ${res.faltantes.join(', ') || '-'}` });

    if (highlight) {
      card.appendChild(highlight);
    }
    card.append(titulo, empresa, percentual, encontrados, faltantes);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

export function renderMelhorVaga(container, melhorResultado) {
  const el = container.querySelector('.melhor-vaga') || criarElemento('section', { className: 'melhor-vaga' });
  el.innerHTML = '';
  if (!melhorResultado) {
    el.textContent = '';
    return el;
  }

  const titulo = criarElemento('h2', { text: 'Melhor vaga' });
  const cargo = criarElemento('p', { text: `${melhorResultado.vaga.cargo} — ${melhorResultado.vaga.empresa}` });
  const info = criarElemento('p', { text: `Compatibilidade: ${melhorResultado.percentual}% (${melhorResultado.classificacao})` });
  const recomendacao = criarElemento('p', { text: `Recomendação: estude ${melhorResultado.faltantes.join(', ') || '---'}` });

  el.append(titulo, cargo, info, recomendacao);
  container.prepend(el);
  return el;
}
