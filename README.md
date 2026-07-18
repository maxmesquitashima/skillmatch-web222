# SkillMatch-Web 

**connecting talent & opportunity**

O SkillMatch-Web é uma aplicação web estática (HTML/CSS/JS puro) que transforma um motor de comparação de habilidades em um produto interativo completo. O sistema permite que o candidato preencha seu perfil, carregue vagas disponíveis a partir de uma fonte de dados (JSON local) e receba uma análise detalhada de compatibilidade, juntamente com recomendações de estudo.

## Funcionalidades e Escopo

O projeto atende a todos os requisitos obrigatórios e inclui recursos bônus adicionais implementados para o T1 do Módulo 1.

### Requisitos Obrigatórios Implementados ✅
- **Fetch de Vagas**: Requisição assíncrona (via `fetch` e `try/catch`) de `assets/dados/vagas.json`, com tratamento explícito para os estados de _carregando_, _vazio_ e _erro_.
- **Perfil do Candidato**: Formulário dinâmico com validação (nome, área, habilidades e experiência em meses). Evita reload com `preventDefault()`.
- **Motor Orientado a Objetos (POO)**: Classes `Vaga` e `VagaFrontEnd` com herança e uso de `this`. Método próprio `calcularCompatibilidade(perfil)` que retorna percentual, listas de habilidades encontradas/faltantes e uma classificação (Alta/Média/Baixa).
- **Manipulação Dinâmica do DOM**: Renderização de tela, cards de vaga e mensagens de status criadas 100% via JavaScript (`createElement`, `classList`).
- **Callbacks e Closures**: Utilização de closures para manter estado (ex: contador de análises feitas na sessão).
- **Métodos de Array ES6**: Uso intenso de métodos como `map`, `filter`, `reduce` e `sort` para processar, classificar e exibir as vagas de forma eficiente.
- **Persistência de Dados**: O perfil do usuário é salvo no `localStorage` via `JSON.stringify/parse` e carregado automaticamente em visitas futuras.
- **Organização Modular (ES Modules)**: Arquivos separados por responsabilidade (Fluxo `main.js`, Telas `ui.js`, Lógica `motor.js` e Dados `dados.js`) ligados via `import/export`.
- **UI/UX e Acessibilidade**: HTML semântico gerado dinamicamente, layout responsivo *mobile-first* usando Flexbox, dicas de acessibilidade (foco visível, `aria-live` em mensagens dinâmicas, `labels`). 

### Recursos Bônus Implementados ⭐
- **Tema Claro/Escuro (Dark Mode)**: Funcionalidade de toggle de tema acessível pelo cabeçalho. A escolha do tema pelo usuário é salva no `localStorage` e se mantém ao recarregar a página. O CSS é adaptável às variáveis dinâmicas.
- **Filtro e Ordenação de Vagas**: O usuário pode filtrar as vagas pela modalidade (Remoto, Presencial, Híbrido) e ordenar dinamicamente (maior salário ou maior compatibilidade) usando um painel dedicado renderizado logo acima dos resultados.

## Estrutura de Arquivos
```text
skillmatch-web/
├─ index.html
├─ README.md
├─ .gitignore
└─ assets/
   ├─ img/logo.png     
   ├─ styles/index.style.css
   ├─ dados/vagas.json
   └─ scripts/
      ├─ main.js    # Orquestração do fluxo
      ├─ motor.js   # Regras de negócio, POO e Cálculos
      ├─ ui.js      # Renderização do DOM e validação visual
      └─ dados.js   # Fetch e persistência (localStorage)
```

## Como rodar localmente

Este projeto utiliza **Módulos ES** (ES Modules) e requisições HTTP (`fetch`). Portanto, ele não funcionará adequadamente se aberto diretamente com o protocolo `file://`.

Para executá-lo, você precisará levantar um pequeno servidor web local:
1. Abra a pasta do projeto no VS Code.
2. Utilize uma extensão como o **Live Server** (clicando em "Go Live").
3. A aplicação estará rodando no seu navegador (normalmente `http://localhost:5500` ou similar).

## Como usar
1. **Preenchimento**: Digite suas informações no formulário à esquerda.
2. **Análise**: Clique em "Analisar vagas". O sistema buscará as vagas (com simulação de estados de rede) e filtrará com seu perfil.
3. **Filtros (Opcional)**: Use o menu de seleção à direita para refinar as vagas exibidas por modalidade ou ordená-las de diferentes maneiras.
4. **Visualização**: Verifique sua Compatibilidade, a Melhor Vaga em destaque, e acesse sua dica de estudos baseada nos requisitos faltantes. O Tema Escuro pode ser ativado a qualquer momento no botão superior.

## Onde a IA foi usada
O desenvolvimento da base estrutural foi feito pelo estudante. Recursos de Inteligência Artificial foram utilizados em passos isolados para:
- Refatoração rápida e organização do código modular.
- Implementação inicial e refino dos algoritmos visuais dos Bônus de Filtro e Tema Escuro (CSS e estruturação via `createElement`).
Tudo foi testado, validado, explicado e ajustado para se adequar ao fluxo do aprendizado contínuo do Módulo 1.

---
## 📋 Organização do Projeto
Para o desenvolvimento desta aplicação, utilizei a metodologia Kanban para gerenciar as tarefas e acompanhar o progresso das funcionalidades.

- **Quadro Kanban:** [Acesse o quadro do SkillMatch aqui] https://trello.com/b/y9d8Mnrf

*Nota: O quadro está configurado como público para fins de avaliação.*

- **Pagina para verificar funcionalidade:** https://maxmesquitashima.github.io/skillmatch-web222/



**Autor:** Maximiliano / max.shimabucuro@gmail.com
