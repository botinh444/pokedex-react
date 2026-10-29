import { useState } from "react";
import type { FormEvent } from "react";

interface SearchBarProps {
  onBuscar: (termo: string) => void;
}

export default function SearchBar({ onBuscar }: SearchBarProps) {
  const [valor, setValor] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const termoNormalizado = valor.toLowerCase().trim();
    if (termoNormalizado) {
      onBuscar(termoNormalizado);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Digite o nome do Pokémon"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}