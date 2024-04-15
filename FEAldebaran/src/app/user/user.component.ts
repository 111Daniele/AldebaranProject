import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MeteorsService } from '../services/meteors.service';
import { StatesService } from '../services/states.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  constructor(public router: Router, public route: ActivatedRoute, public userService: UserService, public http: HttpClient, public auth: AuthService){}

  idUser: any;

  meteorService= inject(MeteorsService)

  states: StatesService= inject(StatesService)
  
  // user= {name: "mario", meteor: [{name: "X"}, {name: "Y"}]};

  user: any

  loaderMeteors: boolean= true

  meteors:any

  statesService: StatesService= inject(StatesService)

  rformMeteor: FormGroup

  ngOnInit(): void {
    console.log("iniz user")

   this.rformMeteor= new FormGroup(
      {
        id: new FormControl(""),
        diameter: new FormControl(""),
        h: new FormControl(""),
        last_obs: new FormControl(""),
        range: new FormControl(""),
        ps_max: new FormControl(""),
        v_inf: new FormControl("")
      }
    )

    this.statesService.myMeteorSection= true
    this.statesService.formAddMeteor= false
    this.idUser= this.route.snapshot.paramMap.get("id");

    console.log("l'id passato è ", this.idUser)
    this.userService.getUser(this.idUser).subscribe(x=> {console.log("risultato user", x);this.user= x["data"][0]; console.log("preleavto utente ", x["data"], "con iddd", x["data"][0]?.name )})

    this.meteorService.getMeteors().subscribe(x => {this.meteors= x.filter(met=> { return met.author== this.idUser}); this.loaderMeteors=false; console.log("met", this.meteors, "lunghezza", this.meteors.length)})
    
  }




  closeMeteorForm(){
    this.states.formAddMeteor= false
  }


  sendMeteor(){
    this.auth.user.subscribe(u => this.user= u)
    console.log("user", this.user, "met£", this.rformMeteor.value)
    this.http.post("http://localhost:8000/users/addMeteor", {idName: this.user.id, meteor: this.rformMeteor.value}).subscribe()
  }


}
