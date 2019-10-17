
import { PokemonAbility } from './PokemonAbility';
import { PokemonType } from './PokemonType';

export interface Pokemon {
  // The identifier for this resource.
  id: number;
  // The name for this resource.
  name: string;
  // The base experience gained for defeating this Pokémon.
  base_experience: number;
  // The height of this Pokémon in decimetres.
  height: number;
  // The weight of this Pokémon in hectograms.
  weight: number;
  // A list of abilities this Pokémon could potentially have.
  abilities: PokemonAbility[];
  // A list of details showing types this Pokémon has.
  types: PokemonType[];
  // pokemon types in string
  pokemon_types: string;
  // pokemon abilites in string
  pokemon_abilities: string;
  
}
