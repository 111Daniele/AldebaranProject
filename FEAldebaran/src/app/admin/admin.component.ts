import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StatesService } from '../services/states.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

  constructor(public http: HttpClient){}

  auth: AuthService= inject(AuthService)

  router: Router= new Router()

  loaderUsers= true

states: StatesService = inject(StatesService)

  users= []

  ngOnInit(): void {
    this.states.amInAdmin=true
    this.states.adminSection=false
    this.http.get("http://localhost:8000/users/usersNotApproved").subscribe(x => {console.log("risposta",x);this.users= x["data"]; this.loaderUsers=false})
    this.auth.user.subscribe(x => {if (!x) {
      console.log("non sei piu loggato")
      
      console.log("no")
    }
    
    })
  }




approve(id){
  console.log("utenti primas elimin ", this.users)
  console.log("id è ", id)
let istanza= this.users.find(x=> x.name==id)
  
  let index= this.users.indexOf(istanza)
  console.log("indice è ", index, ".")
  this.users.splice(index, 1)

  console.log("utenti dopo elimin ", this.users)

  this.http.post("http://localhost:8000/users/approveUser", {id:id}).subscribe()

}






}
