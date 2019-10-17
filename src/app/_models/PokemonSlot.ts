import { NamedResource } from './NamedResource';


export interface PokemonSlot {
    // 	The order the Pokémon's types are listed in.
    slot: number;    	
    //The Pokémon that has the referenced type.
    pokemon: NamedResource;

}
