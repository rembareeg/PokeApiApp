import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { PokemonService } from '../_services/pokemon.service';

import { PokemonList } from '../_models/PokemonList';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PokemonsTypes } from '../_models/PokemonsTypes';
import { Pokemon } from '../_models/Pokemon';
import { Poke } from '../_models/Poke';


@Component({
  selector: 'app-version1',
  templateUrl: './version1.component.html',
  styleUrls: ['./version1.component.css']
})
export class Version1Component implements OnInit {
  // Reactive form
  pokemonForm: FormGroup;
  // Columns for display
  displayedColumns: string[] = ['name', 'type', 'h/w', 'sb', 'be'];
  // Dataset of poke objects
  dataSource: MatTableDataSource<Poke>;
  // List of all pokemons(names)
  pokemonList : PokemonList;
  // Array of all pokemons(objects)
  pokemons : Poke[] = [];
  // offset for api
  offset : number = 0;
  // limit for api to send Pokemon's (Max:20)
  limit : number = 20;
  // Number of items per page
  pageSize : number = 10;
  // Checks if you searched with input
  searched : boolean = false; 
  
  // Adding paginator
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private pokemonService: PokemonService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // Initiate form
    this.initPokemonForm();
    // Get pokemons to list
    this.getPokemons(); 
    // Set input changes
    this.onChanges();  
  }

  getPokemons() {    
    this.pokemonService.getPokemons(this.offset, this.limit).subscribe((newPokemons: PokemonList) => {
      this.pokemonList = newPokemons;
      // Getting pokemon objects from names    
      for(var i = 0; i < newPokemons.results.length; i++)
      {
        this.getPokemonByName(newPokemons.results[i].name);
      }  
      // Calculating new offset
      this.searched = false;
      this.offset += this.limit;      
    });
  }
  // Adding instace of FormBuilder for form
  initPokemonForm(){
    this.pokemonForm = this.formBuilder.group({
      name: [{value: '', disabled: false}],
      type: [{value: '', disabled: false}]
    });
    
  }
  // Control what happens when input field value is changed
  onChanges() {
    this.pokemonForm.get('name').valueChanges.subscribe(pokemonName => {
      if (pokemonName != '') {
          this.pokemonForm.get('type').reset();
          this.pokemonForm.get('type').disable();
      }
      else {
          this.pokemonForm.get('type').enable();
      }
    });         
  }
  // Getting pokemons by name and adding to array 
  getPokemonByName(name: string) : void
  {
    this.pokemonService.getPokemon(name).subscribe((newPokemon: Pokemon) => {
      // If success add pokemon to array
      var instance : Poke = new Poke(newPokemon);
      this.pokemons.push(instance);      
    }, () => {
      // If error reset pokemon array
      this.pokemons = [];      
    }, ()=>{
      // On end 
      // Set new dataset
      this.dataSource = new MatTableDataSource<Poke>(this.pokemons);
      this.dataSource.paginator = this.paginator; 
    });    
  }
  // Get pokemons by theyr type
  getPokemonByType(type: string)
  {
    this.pokemonService.getType(type).subscribe((pokemonType: PokemonsTypes) => {
      // if success add pokemon to array
      // Finding pokemon of type by names
      for(var i = 0; i < pokemonType.pokemon.length; i++)
      {
        this.getPokemonByName(pokemonType.pokemon[i].pokemon.name);        
      }
    }, () => {
      // If error reset pokemon array
      this.pokemons = [];
      // Set new dataset
      this.dataSource = new MatTableDataSource<Poke>(this.pokemons);
      this.dataSource.paginator = this.paginator;    

    });
  }
  // On click of next page
  pageEvent(event){
    // If there is 10 or less items or next page, get more pokemons
    if((event.length / this.pageSize) - 1 <= event.pageIndex && !this.searched)
    {
      this.getPokemons();    
    }
  }

  searchPokemons(){
    // Reset pokemon array because something will happen (search by name, type, or reset pokemon list)
    this.pokemons = [];
    // Searching pokemons by type if input type is't empty or null
    if(this.pokemonForm.get('type').value != null && this.pokemonForm.get('type').value != '')
    {
      this.searched = true;
      this.getPokemonByType(this.pokemonForm.get('type').value.toLowerCase());
    }
    // Searching pokemons by name if input name is't empty or null
    else if(this.pokemonForm.get('name').value != null && this.pokemonForm.get('name').value != '')
    {
      this.searched = true;
      this.getPokemonByName(this.pokemonForm.get('name').value.toLowerCase());     
    }
    // If both are empty or null reset offset and get pokemons from begining
    else
    {
      this.offset = 0;
      this.getPokemons();
    }
  }
}