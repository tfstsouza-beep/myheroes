import { Hero, HeroRepository, NewHero } from '../repository/hero.repository';

export class CreateHeroDTO {
  nome: string;
  poder: string;
  universo?: string;
  ativo?: boolean;
}

export class UpdateHeroDTO {
  nome: string;
  poder: string;
  universo?: string;
  ativo: boolean;
}

export class PatchHeroDTO {
  nome?: string;
  poder?: string;
  universo?: string;
  ativo?: boolean;
}

export class HeroService {
  constructor(private readonly heroRepository: HeroRepository) {}

  // 1. MÉTODO FIND:
  // Busca todos os heróis ou localiza um herói específico pelo ID.
  find(id?: number): Hero[] | Hero {
    // Caso 1: Se o ID não foi passado, retorna a lista completa (By-Pass)
    if (id === undefined) {
      return this.heroRepository.findAll();
    }

    // Caso 2: Se passou um ID, busca o herói no repositório
    const heroi = this.heroRepository.findById(id);
    if (!heroi) {
      throw new Error(`Herói com ID ${id} não foi encontrado no acervo.`);
    }

    return heroi;
  }

  //2. MÉTODO CREATE:
  //Aplica a regra de negócio e cadastra o novo herói.
  create(data: CreateHeroDTO): Hero {
    // Regra de Negócio: Nome e poder são obrigatórios!
    if (!data.nome) {
      throw new Error('O nome do herói é obrigatório!');
    }
    if (!data.poder) {
      throw new Error('O poder do herói é obrigatório!');
    }

    // Prepara o objeto com valores padrão caso não sejam informados
    const newHeroData: NewHero = {
      nome: data.nome,
      poder: data.poder,
      universo: data.universo || 'Independente',
      ativo: data.ativo !== undefined ? Boolean(data.ativo) : true,
    };

    // Entrega os dados validados para o repositório salvar
    return this.heroRepository.create(newHeroData);
  }

  //3. MÉTODO UPDATE:
  //Substituição completa de todos os dados de um herói existente.
  update(id: number, data: UpdateHeroDTO): Hero {
    // Passo 1: Garante que o herói já existe (se não existir, o find avisa)
    this.find(id);

    // Passo 2: Regra de negócio - nome e poder são obrigatórios
    if (!data.nome) {
      throw new Error('O nome do herói é obrigatório!');
    }
    if (!data.poder) {
      throw new Error('O poder do herói é obrigatório!');
    }

    // Passo 3: Salva os novos dados completos no repositório
    const heroUpdate = this.heroRepository.update(id, {
      nome: data.nome,
      poder: data.poder,
      universo: data.universo || 'Independente',
      ativo: Boolean(data.ativo),
    });

    if (!heroUpdate) {
      throw new Error(`Falha ao atualizar o herói de ID ${id}.`);
    }

    return heroUpdate;
  }

  //4. MÉTODO PATCH:
  //Atualização parcial dinâmica. Altera apenas os campos enviados!
  patch(id: number, data: PatchHeroDTO): Hero {
    // Passo 1: Garante que o herói existe
    this.find(id);

    // Passo 2: Repassa as alterações parciais direto para o repositório
    const heroUpdate = this.heroRepository.patch(id, data);
    if (!heroUpdate) {
      throw new Error(
        `Falha ao aplicar alteração parcial no herói de ID ${id}.`,
      );
    }

    return heroUpdate;
  }

  //5. MÉTODO DELETE:
  //Remove com segurança um herói pelo ID.
  delete(id: number): boolean {
    // Passo 1: Confere se o herói existe antes de excluir
    this.find(id);

    // Passo 2: Solicita a exclusão ao repositório
    const sucesso = this.heroRepository.delete(id);
    if (!sucesso) {
      throw new Error(`Erro inesperado ao remover o herói de ID ${id}.`);
    }

    return true;
  }
}
