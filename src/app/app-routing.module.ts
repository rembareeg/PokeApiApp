import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Version1Component} from './version1/version1.component';
import {Version2Component} from './version2/version2.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'version1', component: Version1Component},
  {path: 'version2', component: Version2Component},
  {path: '**', redirectTo: '', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
