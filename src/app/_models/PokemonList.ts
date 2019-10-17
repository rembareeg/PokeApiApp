import { NamedResource } from './NamedResource';



export interface PokemonList {
    count: number;
    next: string;
    results: NamedResource[];
}
