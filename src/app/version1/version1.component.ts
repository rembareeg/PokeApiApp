import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { PokemonService } from '../_services/pokemon.service';
import { PokemonList } from '../_models/PokemonList';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PokemonsTypes } from '../_models/PokemonsTypes';
import { Pokemon } from '../_models/Pokemon';
import { Poke } from '../_models/Poke';
import { Router } from '@angular/router';

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
  dataSource: MatTableDataSource<Poke> = new MatTableDataSource<Poke>();
  // List of all pokemons(names)
  pokemonList : PokemonList;
  // Array of all pokemons(objects)
  pokemons : Poke[] = [] ;
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

  constructor(private pokemonService: PokemonService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    // Initiate form
    this.initPokemonForm();
    // Get pokemons to list
    this.getPokemons(this.offset, this.limit); 
    // Set input changes
    this.onChanges();  
    this.dataSource.paginator = this.paginator;    
  }
  getPokemons(offset: number, limit : number) {    
    this.pokemonService.getPokemons(offset, this.limit).subscribe((newPokemons: PokemonList) => {
      this.pokemonList = newPokemons;
      if(this.pokemons.length == 0)
      {
        this.pokemons = new Array<Poke>(this.pokemonList.count);
      }
      // Getting pokemon objects from names    
      for(let i = 0; i < newPokemons.results.length; i++)
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
      let instance : Poke = new Poke(newPokemon);
      this.pokemons[instance.id - 1] = instance;   
      // Set new dataset
      this.dataSource.data = this.pokemons;
    }, () => {
      // If error reset pokemon array
      this.pokemons = [];      
      // Set new dataset
      this.dataSource.data = this.pokemons;  

    });
  }
  // Getting pokemons by name and adding to array 
  getPokemonBySearchedName(name: string, callback)
  {       
    this.pokemonService.getPokemon(name).subscribe((newPokemon: Pokemon) => {
      let instance : Poke = new Poke(newPokemon);  
      callback(instance);
    }, () => {
      // If error reset pokemon array
      this.pokemons = [];      
      // Set new dataset
      this.dataSource.data = this.pokemons;
    });
  }

  // Get pokemons by theyr type
  getPokemonByType(type: string)
  {
    this.pokemonService.getType(type).subscribe((pokemonType: PokemonsTypes) => {
      this.pokemons = new Array<Poke>(pokemonType.pokemon.length);
      let pokeaArray : Poke[] = [] ;
      // Finding pokemon of type by names
      for(let i = 0; i < pokemonType.pokemon.length; i++)
      {
        this.getPokemonBySearchedName(pokemonType.pokemon[i].pokemon.name, (newPokemon : Poke) => {
          if(newPokemon) 
          {
            pokeaArray.push(newPokemon);
            this.pokemons = pokeaArray; 
            this.dataSource.data = this.pokemons;
          }
        });
      }   
    }, () => {
      // If error reset pokemon array
      this.pokemons = [];
      // Set new dataset
      this.dataSource.data = this.pokemons;      
    });     
  }
  // On click of next page
  pageEvent(event){
    console.log(event);
    // If there is 10 or less items or next page, get more pokemons
    if((event.pageIndex + 1) * event.pageSize == this.offset && !this.searched)
    { 
      this.getPokemons(this.offset, this.limit);
    }
  }
  searchPokemons(){
    this.dataSource.paginator.pageIndex = 0;
    // Reset pokemon array because something will happen (search by name, type, or reset pokemon list)
    this.pokemons = [];
    // Searching pokemons by type if input type is't empty or null
    if(this.pokemonForm.get('type').value != null && this.pokemonForm.get('type').value != '')
    {
      this.searched = true;
      this.getPokemonByType(this.pokemonForm.get('type').value.trim().toLowerCase());
    }
    // Searching pokemons by name if input name is't empty or null
    else if(this.pokemonForm.get('name').value != null && this.pokemonForm.get('name').value != '')
    {
      this.searched = true;
      this.getPokemonBySearchedName(this.pokemonForm.get('name').value.trim().toLowerCase(), (newPokemon : Poke) => {
        if(newPokemon)
        {
          this.pokemons.push(newPokemon);
          this.dataSource.data = this.pokemons;  
        }
      });  
    }
    // If both are empty or null reset offset and get pokemons from begining
    else
    {
      this.offset = 0;
      this.getPokemons(this.offset , this.limit);
    }    
  }

  back()
  {
    this.router.navigate(['/home']);
  }
}