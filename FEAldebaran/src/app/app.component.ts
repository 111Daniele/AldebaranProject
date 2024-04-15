import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Meteor } from './Models/Meteor';
import { MeteorsService } from './services/meteors.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient, private meteorService: MeteorsService, private auth: AuthService){

  }

  meteors: Meteor[];


  ngOnInit(): void {
    // this.meteorService.getMeteors();
    this.auth.autoLogin()
  }
  title = 'FEAldebaran';
}
