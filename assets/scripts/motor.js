// Motor do SkillMatch: classes Vaga e VagaFrontEnd com método para calcular compatibilidade

export class Vaga {
  constructor({ id, empresa, cargo, requisitos = [], salario = '', modalidade = '' }) {
    this.id = id;
    this.empresa = empresa;
    this.cargo = cargo;
    this.requisitos = requisitos;
    this.salario = salario;
    this.modalidade = modalidade;
  }

  // calcula compatibilidade com um perfil: objeto com habilidades (array de strings)
  calcularCompatibilidade(perfil) {
    const perfilHabilidades = Array.isArray(perfil.habilidades)
      ? perfil.habilidades.map(h => h.trim().toLowerCase())
      : [];

    // encontrados: requisitos presentes no perfil
    const encontrados = this.requisitos.filter(r => perfilHabilidades.includes(r.toLowerCase()));
    const faltantes = this.requisitos.filter(r => !perfilHabilidades.includes(r.toLowerCase()));

    const percentual = this.requisitos.length === 0 ? 0 : Math.round((encontrados.length / this.requisitos.length) * 100);

    const classificacao = percentual >= 80 ? 'Alta' : percentual >= 50 ? 'Média' : 'Baixa';

    return {
      vaga: this,
      percentual,
      encontrados,
      faltantes,
      classificacao,
    };
  }
}

// Exemplo de subclasse que poderia acrescentar comportamento
export class VagaFrontEnd extends Vaga {
  constructor(props) {
    super(props);
    // por exemplo, um campo stack (opcional)
    this.stack = props.stack || null;
  }

  // sobrescreve para adicionar nota extra se a vaga listar 'React' e o perfil também
  calcularCompatibilidade(perfil) {
    const base = super.calcularCompatibilidade(perfil);

    // ajuste simples: se a vaga cita 'React' e o perfil tem 'react', adicionar +2 pontos (máx 100)
    const perfilHabilidades = Array.isArray(perfil.habilidades)
      ? perfil.habilidades.map(h => h.trim().toLowerCase())
      : [];

    let ajuste = 0;
    if (this.requisitos.map(r => r.toLowerCase()).includes('react') && perfilHabilidades.includes('react')) {
      ajuste = 2;
    }

    base.percentual = Math.min(100, base.percentual + ajuste);
    base.classificacao = base.percentual >= 80 ? 'Alta' : base.percentual >= 50 ? 'Média' : 'Baixa';
    return base;
  }
}
