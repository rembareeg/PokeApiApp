import { NamedResource } from './NamedResource';


export interface PokemonType {
  // The order the Pokémon's types are listed in.
  slot: number;
  // The URL of the referenced resource.
  type: NamedResource;
}
