/**
 * Skill Match 35: Simulador de Compatibilidade com Vaga Front-End Júnior
 */

// [RF01] OBJETO CANDIDATO
const candidato = {
  nome: "João Silva",
  area: "Front-End",
  experienciaMeses: 6,
  habilidades: [
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "Git",
    "GitHub",
    "Lógica de Programação",
    "Resolução de Problemas",
    "Kanban",
    "Comunicação",
  ],
};

console.log("--- Perfil do Candidato ---");
console.log(`Nome: ${candidato.nome}`);
console.log(`Área: ${candidato.area}`);
console.log(`Habilidades: ${candidato.habilidades.join(", ")}`);
console.log(`Experiência: ${candidato.experienciaMeses} meses\n`);

// [RF09] POO: Classe Base 'Vaga'
class Vaga {
  constructor(empresa, cargo, requisitos, salario, modalidade) {
    this.empresa = empresa;
    this.cargo = cargo;
    this.requisitos = requisitos;
    this.salario = salario;
    this.modalidade = modalidade;
  }

  exibirResumo() {
    return `${this.cargo} na empresa ${this.empresa}`;
  }
}

// [RF10] POO: Classe Filha 'VagaFrontEnd' (Uso do extends e super)
class VagaFrontEnd extends Vaga {
  constructor(empresa, cargo, requisitos, salario, modalidade, nivel) {
    super(empresa, cargo, requisitos, salario, modalidade);
    this.nivel = nivel;
  }

  exibirDetalhesFrontEnd() {
    console.log(`Vaga: ${this.exibirResumo()} | Nível: ${this.nivel}`);
  }
}

// [RF02] LISTA DE VAGAS BASE (Instanciadas com as classes criadas)
const listaVagas = [
  new VagaFrontEnd(
    "TechStart",
    "Desenvolvedor Front-End Júnior",
    [
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "Git",
      "Lógica de Programação",
      "Inglês Básico",
    ],
    3500.0,
    "Remoto",
    "Júnior",
  ),
  new VagaFrontEnd(
    "CodeLab",
    "Estagiário Front-End",
    ["HTML", "CSS", "JavaScript", "Lógica de Programação", "GitHub"],
    2000.0,
    "Híbrido",
    "Estágio",
  ),
  new VagaFrontEnd(
    "WebSolutions",
    "Desenvolvedor Front-End Júnior",
    [
      "JavaScript",
      "React",
      "Redux",
      "TypeScript",
      "Git",
      "Metodologias Ágeis",
      "Comunicação",
    ],
    4000.0,
    "Presencial",
    "Júnior",
  ),
];

// [RF14] ASSINCRONISMO - PROMISE (Simula a busca de dados num servidor remoto)
function buscarVagasSimuladas() {
  console.log("Buscando vagas simuladas no 'servidor'...\n");
  return new Promise((resolve) => {
    setTimeout(() => {
      // [RF08 - MÉTODO 1: MAP] Clona o array de vagas original
      const vagasCarregadas = listaVagas.map((vaga) => vaga);
      console.log("Vagas carregadas com sucesso!");
      resolve(vagasCarregadas);
    }, 1000);
  });
}

// [RF13] CLOSURE: Contador de Análises (Retém o estado na memória privada)
function criarContadorDeAnalises() {
  let totalAnalises = 0;
  return function () {
    totalAnalises++;
    return totalAnalises;
  };
}
const contarAnalise = criarContadorDeAnalises();

// [RF12] CALLBACK: Executa uma rotina personalizada pós-processamento
function finalizarAnalise(nomeCandidato, callback) {
  console.log("\n--- Análise Concluída ---");
  callback(nomeCandidato);
  console.log("Obrigado por usar o Skill Match!");
}

// [RF14] ASSINCRONISMO - ASYNC/AWAIT (Motor Principal do Sistema)
async function iniciarSistema() {
  console.log("Iniciando o sistema de simulação de compatibilidade...");

  try {
    const vagas = await buscarVagasSimuladas();

    console.log("\n--- Vagas Disponíveis ---");
    vagas.forEach((vaga) => vaga.exibirDetalhesFrontEnd());

    console.log("\n--- Análise de Compatibilidade ---");
    let melhorCompatibilidade = { percentual: -1, vaga: null };
    let todasHabilidadesFaltantes = new Set();

    for (const vaga of vagas) {
      // Uso da Closure
      const numeroAtualdaAnalise = contarAnalise();
      console.log(
        `\n[Análise #${numeroAtualdaAnalise}] Analisando: ${vaga.cargo} na ${vaga.empresa}`,
      );

      // [RF08 - MÉTODO 2: FILTER]
      const habilidadesAtendidas = candidato.habilidades.filter(
        (habilidadeCandidato) => vaga.requisitos.includes(habilidadeCandidato),
      );

      const totalRequisitos = vaga.requisitos.length;
      const requisitosAtendidos = habilidadesAtendidas.length;

      // [RF03] Cálculo matemático da Compatibilidade
      const percentualCompatibilidade =
        totalRequisitos > 0 ? (requisitosAtendidos / totalRequisitos) * 100 : 0;

      console.log(`Requisitos da vaga: ${vaga.requisitos.join(", ")}`);
      console.log(
        `Habilidades do candidato que atendem: ${habilidadesAtendidas.join(", ")}`,
      );
      console.log(
        `Percentual de Compatibilidade: ${percentualCompatibilidade.toFixed(2)}%`,
      );

      // [RF04] Classificação por Faixas
      let classificacao;
      if (percentualCompatibilidade >= 80) {
        classificacao = "Alta compatibilidade";
      } else if (percentualCompatibilidade >= 50) {
        classificacao = "Média compatibilidade";
      } else {
        classificacao = "Baixa compatibilidade";
      }
      console.log(`Classificação: ${classificacao}`);

      // [RF05 & RF08 - MÉTODO 3: FILTER]
      const habilidadesFaltantes = vaga.requisitos.filter(
        (requisitoVaga) => !candidato.habilidades.includes(requisitoVaga),
      );
      console.log(
        `Habilidades Faltantes para esta vaga: ${habilidadesFaltantes.join(", ")}`,
      );

      habilidadesFaltantes.forEach((habilidade) =>
        todasHabilidadesFaltantes.add(habilidade),
      );

      // [RF06] Identifica a Vaga com Maior Compatibilidade
      if (percentualCompatibilidade > melhorCompatibilidade.percentual) {
        melhorCompatibilidade = {
          percentual: percentualCompatibilidade,
          vaga: vaga,
        };
      }
    }

    // [RF06] Exibição do Resultado da Vaga Ideal
    if (melhorCompatibilidade.vaga) {
      console.log("\n--- Vaga com Maior Compatibilidade ---");
      console.log(
        `A vaga com maior compatibilidade é: ${melhorCompatibilidade.vaga.cargo} na ${melhorCompatibilidade.vaga.empresa}`,
      );
      console.log(
        `Com um percentual de: ${melhorCompatibilidade.percentual.toFixed(2)}%`,
      );
    }

    // [RF07] Recomendação Textual de Estudos
    console.log("\n--- Recomendação de Estudos ---");
    if (todasHabilidadesFaltantes.size > 0) {
      console.log(
        `Para aumentar suas chances, considere focar nos seguintes estudos: ${Array.from(todasHabilidadesFaltantes).join(", ")}.`,
      );
    } else {
      console.log("Parabéns! Você possui todas as habilidades requisitadas.");
    }

    // [RF12] Invocação do Callback
    finalizarAnalise(candidato.nome, (nome) => {
      console.log(
        `Olá ${nome}, sua análise de compatibilidade foi concluída com sucesso!`,
      );
    });
  } catch (error) {
    console.error("Ocorreu um erro ao iniciar o sistema:", error);
  }
}

// Inicialização oficial do sistema completo
iniciarSistema();
