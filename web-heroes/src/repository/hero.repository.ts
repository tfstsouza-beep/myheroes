import * as fs from 'fs';
import * as path from 'path';

export interface Hero {
  id: number;
  nome: string;
  poder: string;
  universo: string;
  ativo: boolean;
}

export interface NewHero {
  nome: string;
  poder: string;
  universo: string;
  ativo: boolean;
}

export class HeroRepository {
  // Caminho seguro até a pasta bd/database.json a partir da raiz do projeto
  private readonly filePath = path.resolve(
    process.cwd(),
    'bd',
    'database.json',
  );

  // 📂 AUXILIAR: Lê o arquivo e devolve a lista de heróis em memória
  private readDatabase(): Hero[] {
    // Se o arquivo ou pasta ainda não existir, cria um arquivo com array vazio '[]'
    if (!fs.existsSync(this.filePath)) {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify([]));
      return [];
    }

    // Lê o conteúdo em texto puro (string)
    const texto = fs.readFileSync(this.filePath, 'utf-8');

    // JSON.parse converte a string de volta em um Array de objetos Hero
    return JSON.parse(texto) as Hero[];
  }

  // 💾 AUXILIAR: Pega a lista atualizada e salva no arquivo do disco
  private writeDatabase(heroes: Hero[]): void {
    // JSON.stringify converte o Array em texto formatado com indentação de 2 espaços
    const textoFormatado = JSON.stringify(heroes, null, 2);
    fs.writeFileSync(this.filePath, textoFormatado, 'utf-8');
  }

  findAll(): Hero[] {
    return this.readDatabase();
  }

  findById(id: number): Hero | undefined {
    const heroes = this.readDatabase();

    const findHero = heroes.find((hero) => hero.id === id);
    return findHero;
  }

  // Cadastra um novo herói na base de dados
  create(heroData: NewHero): Hero {
    // Passo 1: Lê a lista atual de heróis
    const heroes = this.readDatabase();

    // Passo 2: Calcula o próximo ID de forma simples e intuitiva
    // Pegamos o último herói da lista; se ele existir, o próximo ID será (id + 1).
    // Se a lista estiver vazia (primeiro cadastro), o ID inicial será 1.
    const lastHero = heroes[heroes.length - 1];
    const proximoId = lastHero ? lastHero.id + 1 : 1;

    // Passo 3: Monta o novo herói juntando o novo ID aos dados recebidos
    const novoHeroi: Hero = {
      id: proximoId,
      nome: heroData.nome,
      poder: heroData.poder,
      universo: heroData.universo,
      ativo: heroData.ativo,
    };

    // Passo 4: Adiciona o herói no array e salva no arquivo database.json
    heroes.push(novoHeroi);
    this.writeDatabase(heroes);

    // Retorna o herói cadastrado já com seu novo ID gerado
    return novoHeroi;
  }

  // Atualiza os dados de um herói existente
  update(id: number, dadosAtualizados: Partial<NewHero>): Hero | null {
    // Passo 1: Lê a base
    const heroes = this.readDatabase();

    // Passo 2: Descobre a posição (índice) do herói no array
    const indice = heroes.findIndex((heroi) => heroi.id === id);

    // Se o índice for -1, significa que o herói com esse ID não existe
    if (indice === -1) {
      return null;
    }

    // Passo 3: Atualiza apenas os campos enviados, sem alterar o ID original!
    // O Object.assign copia as propriedades novas por cima das antigas
    Object.assign(heroes[indice], dadosAtualizados);

    // Passo 4: Salva a lista modificada no disco e retorna o herói atualizado
    this.writeDatabase(heroes);
    return heroes[indice];
  }

  patch(id: number, dadosAtualizados: Partial<NewHero>): Hero | null {
    return this.update(id, dadosAtualizados);
  }

  // Remove um herói pelo ID. Retorna true se removeu ou false se não encontrou.
  delete(id: number): boolean {
    // Passo 1: Lê a base
    const heroes = this.readDatabase();

    // Passo 2: Localiza o índice do herói
    const indice = heroes.findIndex((heroi) => heroi.id === id);

    if (indice === -1) {
      return false; // Herói não encontrado, não há o que apagar
    }

    // Passo 3: Remove 1 elemento exatamente a partir da posição encontrada
    heroes.splice(indice, 1);

    // Passo 4: Salva a lista sem o item no disco e confirma o sucesso
    this.writeDatabase(heroes);
    return true;
  }
}