import { useState, useEffect } from "react";
import type { Pokemon } from "./types/pokemon";
import { buscarPokemon } from "./services/pokeApi";
import SearchBar from "./components/SearchBar";
import PokemonCard from "./components/PokemonCard";
import EvolutionChain from "./components/EvolutionChain";

export default function App() {
  const [termo, setTermo] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!termo) return;

    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro("");
      setPokemon(null);

      try {
        const dados = await buscarPokemon(termo);
        if (ativo) {
          setPokemon(dados);
        }
      } catch (err) {
        if (ativo) {
          setErro("Pokémon não encontrado.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [termo]);

  return (
    <div className="app">
      <h1>Pokédex</h1>
      
      <SearchBar onBuscar={setTermo} />

      {carregando && <p>Carregando...</p>}
      
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {pokemon && (
        <>
          <PokemonCard pokemon={pokemon} />
          <EvolutionChain evolucoes={pokemon.evolucoes} />
        </>
      )}
    </div>
  );
}