import { Component } from '@angular/core';
import { StatesService } from 'src/app/services/states.service';

@Component({
  selector: 'app-create-meteor',
  templateUrl: './create-meteor.component.html',
  styleUrls: ['./create-meteor.component.css']
})
export class CreateMeteorComponent {

  constructor(public states: StatesService){}

  
}
