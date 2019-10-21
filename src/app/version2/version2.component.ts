import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Pokemon } from '../_models/Pokemon';
import { PokemonList } from '../_models/PokemonList';
import { PokemonsTypes } from '../_models/PokemonsTypes';
import { PokemonService } from '../_services/pokemon.service';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NamedResource } from '../_models/NamedResource';
import { Poke } from '../_models/Poke';
import { Router } from '@angular/router';

@Component({
  selector: 'app-version2',
  templateUrl: './version2.component.html',
  styleUrls: ['./version2.component.css']
})
export class Version2Component implements OnInit {
  // Reactive form
  pokemonForm: FormGroup;
  // Columns for display
  displayedColumns: string[] = ['name', 'img'];
  // Dataset of poke objects
  dataSource = new MatTableDataSource<Poke>();
  // List of all pokemons(names)
  pokemonList : PokemonList;
  // Array of all pokemons(objects)
  pokemons : Poke[] = [];
  // Offset for api
  offset : number = 0;
  // Limit for api to send Pokemon's (Max:20)
  limit : number = 20;
  // Number of items per page
  pageSize : number = 10;

  // Adding paginator
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private pokemonService: PokemonService, private router: Router, private formBuilder: FormBuilder, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, public dialog: MatDialog) { 
    // Init new Icon for poke ball
    iconRegistry.addSvgIcon(
      'pokeball',
      sanitizer.bypassSecurityTrustResourceUrl('assets/graphics/pokeball.svg'));
  }
  ngOnInit() {
    // Initiate form
    this.initPokemonForm();
    // Get pokemons to list
    this.getPokemons(this.offset, this.limit);  
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
      this.offset += this.limit;    
      if(this.pokemons.length < this.pokemonList.count)
      {
        this.getPokemons(this.offset, length);
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

  // Applaying search filter
  applyFilter(filterValue: string) {   
    this.dataSource.filter = filterValue.trim().toLowerCase();      
  }
  // Adding instace of FormBuilder for form
  initPokemonForm(){
    this.pokemonForm = this.formBuilder.group({
      name: [{value: '', disabled: false}, Validators.required]      
    });
  }
  // Open dialog window and send data
  openDialog(pokemonData : Poke): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      panelClass: '.custom-dialog-container',
      width: '650px',
      data: pokemonData  
    });
  }
  // On click of next page
  pageEvent(event){    
    if((event.pageIndex + 1) * event.pageSize == this.offset)
    { 
      this.getPokemons(this.offset, this.limit);
    }
  }  

  back()
  {
    this.router.navigate(['/home']);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['dialog-overview-example-dialog.css']
})
export class DialogOverviewExampleDialog {
  // Pokemon type relations
  pokemonType : PokemonsTypes[];
  // String to display
  doubleDamageTo : string = '';
  // String to display
  doubleDamageFrom : string = '';
  // String to display
  halfDamageTo : string = '';
  // String to display
  halfDamageFrom : string = '';
  // String to display
  noDamageFrom : string = '';
  // String to display
  noDamageTo : string = '';

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Poke, private pokemonService: PokemonService) {}
  
  ngOnInit() {
    // For every type check damage
    for(var i = 0; i < this.data.types.length; i++)
    {
      this.pokemonService.getType(this.data.types[i].type.name).subscribe((newTypes: PokemonsTypes) => {      
        this.doubleDamageTo = this.setRelations(newTypes.damage_relations.double_damage_to, this.doubleDamageTo);
        this.doubleDamageFrom = this.setRelations(newTypes.damage_relations.double_damage_from, this.doubleDamageFrom);
        this.halfDamageTo = this.setRelations(newTypes.damage_relations.half_damage_to, this.halfDamageTo);
        this.halfDamageFrom = this.setRelations(newTypes.damage_relations.half_damage_from, this.halfDamageFrom);
        this.noDamageFrom = this.setRelations(newTypes.damage_relations.no_damage_from, this.noDamageFrom);
        this.noDamageTo =this.setRelations(newTypes.damage_relations.no_damage_to, this.noDamageTo); 
        });
    }
    
  }
  setRelations(type : NamedResource[], text: string) : string
  {
    // If includes none remove it
    if(text.includes('None'))
    {
       text.replace('None', '');
    }
    // For every type add it to string
    for(var i = 0; i < type.length; i++)
    {
      var newType : string = type[i].name;
      // If that type doesent exist add it
      if(!text.includes(newType))
      {
        text += newType;
        // If its not last add comma
        if(i+1 < type.length)
        {
          text += ", ";        
        } 
      }        
    }
    // If last char is comma delete it
    if(text.charAt(text.length - 1) == ',')
    {
      text.slice(-1);
    }
    // If text is empty set text to none
    if(text == '')
    {
      text = 'None';
    }
    
    return text;
  }
  // Closing dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

}
