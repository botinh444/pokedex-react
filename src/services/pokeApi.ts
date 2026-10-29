import type { Pokemon, Evolucao } from '../types/pokemon';


// Tipagens das respostas externas
interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  species: { url: string };
}

interface SpeciesApiResponse {
  evolution_chain: { url: string };
}

interface EvolutionChainApiResponse {
  chain: {
    species: { name: string; url: string };
    evolves_to: EvolutionChainApiResponse['chain'][];
  };
}

export async function buscarPokemon(nome: string): Promise<Pokemon> {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);

  if (!resposta.ok) {
    throw new Error("Pokémon não encontrado.");
  }

  const dados = (await resposta.json()) as PokemonApiResponse;

  // Busca a espécie para encontrar a URL da cadeia de evolução
  const respostaEspecie = await fetch(dados.species.url);
  const dadosEspecie = (await respostaEspecie.json()) as SpeciesApiResponse;

  // Busca a cadeia de evolução
  const respostaCadeia = await fetch(dadosEspecie.evolution_chain.url);
  const dadosCadeia = (await respostaCadeia.json()) as EvolutionChainApiResponse;

  // Percorre a cadeia para pegar os nomes
  const nomesEvolucoes: string[] = [];
  let atual = dadosCadeia.chain;
  
  while (atual) {
    nomesEvolucoes.push(atual.species.name);
    // O material indica que usa apenas a primeira ramificação (evolves_to[0])
    atual = atual.evolves_to[0];
  }

  // Promise.all para buscar os dados de cada evolução em paralelo
  const evolucoes: Evolucao[] = await Promise.all(
    nomesEvolucoes.map(async (nomeEvolucao) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeEvolucao}`);
      const data = (await res.json()) as PokemonApiResponse;
      return {
        id: data.id,
        nome: data.name,
        imagem: data.sprites.front_default,
      };
    })
  );

  return {
    id: dados.id,
    nome: dados.name,
    imagem: dados.sprites.front_default,
    altura: dados.height,
    peso: dados.weight,
    evolucoes,
  };
}