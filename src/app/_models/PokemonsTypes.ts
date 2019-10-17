import { TypeRelations } from './TypeRelations';
import { PokemonSlot } from './PokemonSlot';

export interface PokemonsTypes {
  // The identifier for this resource.
  id: number;
  // The name for this resource.
  name: string;
  // A detail of how effective this type is toward others and vice versa
  damage_relations: TypeRelations;
  // A list of details of Pokémon that have this type.
  pokemon: PokemonSlot[];
}
