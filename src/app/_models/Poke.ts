import { Pokemon } from './Pokemon';
import { PokemonAbility } from './PokemonAbility';
import { PokemonType } from './PokemonType';

export class Poke implements Pokemon {
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
  // Pokemon types in string
  pokemon_types: string;
  // Pokemon abilites in string
  pokemon_abilities: string;

  public constructor(pokemon : Pokemon)
  {
    this.id = pokemon.id;
    this.name = pokemon.name;
    this.base_experience = pokemon.base_experience;
    this.height = pokemon.height;
    this.weight = pokemon.weight;
    this.abilities = pokemon.abilities;
    this.types = pokemon.types;
    this.setPokemonTypeToString();
    this.setPokemonAbilitiesToString();  
  }
  // Creating pokemon_types: string from array of types: PokemonType[];
  private setPokemonTypeToString()
  {
    this.pokemon_types = '';
    // For every type add it to string 
    for(var i = 0; i < this.types.length; i++)
    {
      this.pokemon_types += this.types[i].type.name;
      // If its not last add separation /
      if(i+1 < this.types.length)
      {
        this.pokemon_types += " / ";
      }
    } 
  }
  // Creating pokemon_abilities: string from array of types: PokemonAbility[];
  private setPokemonAbilitiesToString()
  {
    this.pokemon_abilities = '';
    // For every type add it to string 
    for(var i = 0; i < this.abilities.length; i++)
    {
      this.pokemon_abilities += this.abilities[i].ability.name;
      // If its not last add separation /
      if(i+1 < this.abilities.length)
      {
        this.pokemon_abilities += " / ";
      }
    }
  }

}
