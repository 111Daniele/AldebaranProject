import { Component, OnInit, inject } from '@angular/core';
import { StatesService } from '../services/states.service';
import { Meteor } from '../Models/Meteor';
import { MeteorsService } from '../services/meteors.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, TimeoutError, timeout } from 'rxjs';
import { User } from '../Models/User';
import { environment } from 'src/environments/environment';






@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(public states: StatesService, public meteorServices: MeteorsService, public http: HttpClient, private auth: AuthService, private router: Router){

  }

  meteors: Meteor[]

  hide = true;

  page= 1000;

  lastNumberPage: any

  fields= {"diameter": "none", "v_inf": "none", "ps_max": "none", "n_imp": "none", "range": "none", "last_obs": "none", "h": "none" }
  
  sortedFields= {"diameter": {"asc": [], "desc": []}, "v_inf": {"asc": [], "desc": []}, "ps_max": {"asc": [], "desc": []}, "n_imp": {"asc": [], "desc": []}, "range": {"asc":[], "desc": []}, "last_obs": {"asc":[], "desc":[]}, "h": {"asc": [], "desc":[]}}

  isLoading= true

  formAddMeteor: boolean= this.states.formAddMeteor


  selected_meteors
  
  rform: FormGroup

  rformMeteor: FormGroup

  alertWindow: boolean= false

  velocity: string= "asc"

  user: User

  errorFetch: boolean= false

  errorLogin: boolean= false
  
  ngOnInit(): void {
    this.errorFetch= false
    let date1= new Date().getTime()
    this.states.amInAdmin= false
    this.states.myMeteorSection= false
    this.states.formAddMeteor= false
    this.states.adminSection=true

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
    

    
      let subscription= this.meteorServices.getMeteors().subscribe(
        {next: x=> {
        this.meteors= x; 
        console.log("iniziation", this.meteors.length); 
        this.selected_meteors= this.meteors.slice(0,this.page);this.isLoading=false;
        let totalMeteors= this.meteors.length
        this.lastNumberPage= parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))
        
      },
      error: (e) => {this.errorFetch= true; console.log("SCATTATO ERROE")}});
    


  
    
    
    console.log("meteore ", this.meteors= this.meteorServices.meteors)
    this.meteors= this.meteorServices.meteors;
    
    

    this.rform= new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      password: new FormControl()
    })
    
  }

  isCreatingMeteor: boolean= false

  signup: boolean= this.states.signup

  

  show(){
    console.log("eee", this.states.signup);
    console.log("met", this.isCreatingMeteor);
    console.log("ADDMETEOR", this.formAddMeteor);
    this.isCreatingMeteor= true
  }

  refresh(){
    window.location.reload()
  }

  firstPage(){
    this.page=1000;
    this.selected_meteors= [...this.meteors.slice(0, this.page)]

  }

  closeWindow(){
    this.states.alertWindow = !this.states.alertWindow
  }

  lastPage(){
    
    // let firstDigits = parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))

    let firstDigits= this.lastNumberPage
    this.selected_meteors= [...this.meteors.slice(firstDigits*1000+1)]

    this.page= firstDigits*1000
    console.log("lunghezze", this.meteors.length, firstDigits*1000+1, this.page, this.lastNumberPage)

  }


  nextPage(){
    if (this.page + 1000 < this.meteors.length){
    this.selected_meteors= [...this.meteors.slice(this.page+1, this.page+1000)]}
      else{
        this.selected_meteors= [...this.meteors.slice(this.page+1)]
      }
    this.page +=1000

  }

  prevPage(){
    if (this.page - 1000 >0){
    this.selected_meteors= [...this.meteors.slice(this.page-2000, this.page-1000)]}
      else{
        this.selected_meteors= [...this.meteors.slice(0, 1000)]
      }
    this.page -=1000

  }



  close(){
    this.states.signup= false
    this.errorLogin= false
  }

  closeMeteorForm(){
    this.states.formAddMeteor= false
  }

  signupUser(){
    console.log("signup")
    const user= this.rform.value
    console.log(user)
    this.auth.signup(user).subscribe()
    this.states.signup= false
  }


  loginUser(){
    console.log("login")
    const user= this.rform.value
    this.auth.login(user).subscribe({
      next:  (res)=>{this.rform.reset(); this.states.signup= false} ,
      error: (err)=>{console.log("error"); this.rform.reset(); this.errorLogin= true}
    })
  }

  sendForm(){
    if (!this.states.login) this.signupUser()
    else this.loginUser()
  }

  sendMeteor(){
    this.auth.user.subscribe(u => this.user= u)
    console.log("user", this.user, "met£", this.rformMeteor.value)
    this.http.post(environment.HOST + "users/addMeteor", {idName: this.user.id, meteor: this.rformMeteor.value}).subscribe(x => {this.rformMeteor.reset(); this.states.formAddMeteor=false})

  }

switchLoading(){
  this.isLoading= true
}

  sortMeteors(field: string){
    this.switchLoading()
    
    console.log("islo", this.isLoading)

    
    
    console.log("ordino")
    let nFields= ["diameter", "h", "n_imp", "ps_max", "v_inf"] 
    
    this.page= 1000

    //NUMERIC FIELDS
    if (nFields.includes(field))
      {

        //ASC SORTING
        if (this.fields[field]==="none" || this.fields[field]==="desc")
              {
                if (this.sortedFields[field]["asc"].length!=0) {console.log("cache ATTIVA ASC"); this.meteors= [...this.sortedFields[field]["asc"]];  this.selected_meteors= [...this.meteors].slice(0,this.page); this.fields[field]="asc"; for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}}; this.isLoading= false }
                else{
                 console.log("primo sort"); this.meteors= [...this.meteors.sort((a,b)=> parseFloat(a[field]) - parseFloat(b[field]) )];  this.selected_meteors= [...this.meteors].slice(0,this.page);this.fields[field]="asc"; this.sortedFields[field]["asc"]= [...this.meteors];  this.sortedFields[field]["desc"]= [...this.meteors].reverse(); for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}};this.isLoading= false }}



        //DESC SORTING
        else if(this.fields[field]==="asc"){
          
          this.meteors= [...this.sortedFields[field]["desc"]]
          this.selected_meteors= [...this.meteors].slice(0,this.page)
          this.fields[field]="desc"
          for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}}
          console.log("cache attiva DES")
                    // this.meteors= [...this.meteors.sort((a,b)=> - parseFloat(b.v_inf) - parseFloat(a.v_inf)  )]; this.fields[field]="desc"
                    this.isLoading= false
        }

        else{console.log("ERROR: THIS SHOULDN'T BE ACTIVE")}
      }




      //RANGE FIELDS
    else if (field=== "range"){


      //ASC SORTING
      if(this.fields[field]==="none" || this.fields[field]==="desc"){

        //With cache
        if (this.sortedFields[field]["asc"].length!=0) {
          this.meteors= [...this.sortedFields[field]["asc"]];
          this.selected_meteors= [...this.meteors].slice(0,this.page)
      this.fields[field]= "asc"
      console.log("arrivo2")
      for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}};
      this.isLoading= false  }

      //Without cache
      else{
        console.log("arrivo0")
        console.log("inzio range")
        this.meteors= [...this.meteors.sort((a,b)=>this.rangeSort(a["range"], b["range"]))]; 
        console.log("fine range")
        this.selected_meteors= [...this.meteors].slice(0,this.page)
        console.log("arrivo1")
        this.fields[field]="asc"; this.sortedFields[field]["asc"]= [...this.meteors];  
        this.sortedFields[field]["desc"]= [...this.meteors].reverse(); 
        for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}} ;
        this.isLoading= false
      }
    
    
    
    }


      // DESC ORDER
      else{
        this.meteors= [...this.sortedFields[field]["desc"]]
        this.selected_meteors= [...this.meteors].slice(0,this.page)
        this.fields[field]="desc"
        for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}}
        console.log("cache attiva DES");
        this.isLoading= false
      }



    }






    //LAST OBESRVATION

    else if (field=== "last_obs"){

      //ASC SORTING
      if(this.fields[field]==="none" || this.fields[field]==="desc"){

        //With cache
        if (this.sortedFields[field]["asc"].length!=0) {
      this.meteors= [...this.sortedFields[field]["asc"]];
      this.selected_meteors= [...this.meteors].slice(0,this.page)
      this.fields[field]= "asc"
      console.log("arrivo2")
      for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}};
      console.log("primafalse")
      this.isLoading= false  }

      //Without cache
      else{
        console.log("arrivo0")
        this.meteors= [...this.meteors.sort((a, b)=> a["last_obs"] > b["last_obs"] ? 1 : a["last_obs"] < b["last_obs"] ? -1 : 0) ]; 
        this.selected_meteors= [...this.meteors].slice(0,this.page)
        console.log("arrivo1")
        this.fields[field]="asc"; this.sortedFields[field]["asc"]= [...this.meteors];  
        this.sortedFields[field]["desc"]= [...this.meteors].reverse(); 
        for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}} ;
        console.log("primafalse")
        this.isLoading= false
      }
    
    
    
    }


      // DESC ORDER
      else{
        this.meteors= [...this.sortedFields[field]["desc"]]
        this.selected_meteors= [...this.meteors].slice(0,this.page)
        this.fields[field]="desc"
        for (let k of Object.keys(this.fields)){if (k!=field){this.fields[k]="none"}}
        console.log("cache attiva DES");
        this.isLoading= false
      }
      
    
    }
  
  
  
  
  
  
  
  
  }




  rangeSort(a: string, b: string){
    // console.log("sfizio", a, b)
    //     console.log("range", a.split("-")[0], a.split("-")[1])
    let a1=  parseInt( a.split("-")[0])
    let b1=  parseInt(b.split("-")[0])
    return a1-b1
  }
  

}
