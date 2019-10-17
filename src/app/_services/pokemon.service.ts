import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import { Pokemon} from '../_models/Pokemon';
import { HttpClient} from '@angular/common/http';
import { PokemonList } from '../_models/PokemonList';
import { PokemonsTypes } from '../_models/PokemonsTypes';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  
  constructor(private http: HttpClient) { }

  getPokemons(offset : number, limit:number): Observable<PokemonList> {
    return this.http.get<PokemonList>(environment.baseUrl + 'pokemon?offset='+ offset +'&limit='+ limit);
  }

  getPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(environment.baseUrl + 'pokemon/' + name);
  }

  getType(type: string): Observable<PokemonsTypes> {
    return this.http.get<PokemonsTypes>(environment.baseUrl + 'type/' + type);
  }
}
