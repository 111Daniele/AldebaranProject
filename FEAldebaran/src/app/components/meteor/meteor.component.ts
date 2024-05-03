import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Meteor } from 'src/app/Models/Meteor';

@Component({
  selector: 'app-meteor',
  templateUrl: './meteor.component.html',
  styleUrls: ['./meteor.component.css']
})
export class MeteorComponent {

  @Input() meteor: Meteor

  router= inject(Router)

  viewStudy(author: string){
    this.router.navigate(["/users/", author])
  }

  showDetail(meteor){
    console.log("click card", meteor)
  }
}
