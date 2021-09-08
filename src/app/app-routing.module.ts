import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { StatesComponent } from './components/states/states.component';

const routes: Routes = [
  {path:'' ,component: HomeComponent},
  {path:'states' ,component: StatesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
