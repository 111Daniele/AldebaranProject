import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MeteorsService } from '../services/meteors.service';
import { StatesService } from '../services/states.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

import { Chart } from 'angular-highcharts';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  constructor(public router: Router, public route: ActivatedRoute, public userService: UserService, public http: HttpClient, public auth: AuthService){}
  

  loaderDetails= false
  idUser: any;



  showFullDataDetails= false

  accordionCache=[]

  keysDetails

  @ViewChild("topPage") scroll: ElementRef

  meteorService= inject(MeteorsService)

  meteorDetail=false

  meteorInExam

  states: StatesService= inject(StatesService)

  meteors2
meteorsSlice
  
  
  // user= {name: "mario", meteor: [{name: "X"}, {name: "Y"}]};

  user: any

  loaderMeteors: boolean= true

  fullDataDetails

  meteors:any

  statesService: StatesService= inject(StatesService)

  rformMeteor: FormGroup

  velocityLess5=0
  velocityLess10=0
  velocityLess15=0
  velocityLess20=0
  velocityOver20=0

  diameterLess1= 0
  diameterLess2=0
  diameterLess3=0
  diameterLess4=0
  diameterLess5=0
  diameterLess6=0
  diameterOver6=0

  hazardLess12=0
  hazardLess10=0
  hazardLess8=0
  hazardLess6=0
  hazardLess4=0
  hazardOver4=0

  range2030=0
  range2040=0
  range2050=0
  range2060=0
  range2070=0
  range2080=0
  range2090=0
  range2100=0
  rangeOver2100=0

  errorLogin: boolean= false

  chartVelocity
  chartDiameter
  chartHazard
  chartRange

  rform: FormGroup

  hide=true

  ngOnInit(): void {
    console.log("iniz user")

    this.rform= new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      password: new FormControl()
    })
    

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
    //RISOLTO CON LA CACHE
    // if (this.idUser=="CNEOS"){
    // this.meteorService.getMeteors().subscribe(x => {
    //   console.log("LUNGHEZZA METEOREEEEEEEEEEE", x.length)
    //   this.meteors= x.filter(met=> { return met.author== this.idUser}); 
    //   this.loaderMeteors=false; 
    //   console.log("lunghezza", this.meteors.length)})
    
    //CACHE
    if (this.idUser=="CNEOS"){
    this.meteors= JSON.parse(localStorage.getItem("cacheMeteors"))
    this.loaderMeteors=false

    this.http.get(environment.HOST + "allDetails3").subscribe(
      x=>{
this.accordionCache= x["data"]
      }
    )

      if (true){
        this.setInitialValues(
          JSON.parse(localStorage.getItem("cacheVelocity")), 
        JSON.parse(localStorage.getItem("cacheDiameter")),
        JSON.parse(localStorage.getItem("cacheHazard")),
        JSON.parse(localStorage.getItem("cacheRange")))
      }

      
    }

  
    //è utente qualsiais o gbm o nasa
    else{
      this.meteorService.getMeteors2().subscribe(x => {
        console.log("LUNGHEZZA METEOREEEEEEEEEEE", x.length)
        this.meteors2= x.filter(met=> { return met.author== this.idUser}); 
        this.loaderMeteors=false; 
        this.meteorsSlice= this.meteors2.slice(0,1000)

        
      })

      //prelevo accoridon
      this.http.post(environment.HOST + "allDetails2", {author:this.idUser}).subscribe(
        x=>{
this.accordionCache= x["data"]
        }
      )
  
  
        if (true){
          this.setInitialValues(
            JSON.parse(localStorage.getItem("cacheVelocity")), 
          JSON.parse(localStorage.getItem("cacheDiameter")),
          JSON.parse(localStorage.getItem("cacheHazard")),
          JSON.parse(localStorage.getItem("cacheRange")))
        }

       
    }
    
  }

  sendForm(){
    if (!this.states.login) this.signupUser()
    else this.loginUser()
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

  onPageChange(event: PageEvent){
    const startIndex= event.pageIndex * event.pageSize
    let endIndex = startIndex + event.pageSize
    if (endIndex>this.meteors2.length){
      endIndex=this.meteors2.length
    }
    this.meteorsSlice= this.meteors2.slice(startIndex, endIndex)
  }

  close(){
    this.states.signup= false
    this.errorLogin= false
  }

  closeWindow(){
    this.states.alertWindow = !this.states.alertWindow
  }



  closeMeteorForm(){
    this.states.formAddMeteor= false
  }


  sendMeteor(){
    this.auth.user.subscribe(u => this.user= u)
    console.log("user", this.user, "met£", this.rformMeteor.value)
    this.rformMeteor.reset();
    this.states.formAddMeteor= false
    this.http.post(environment.HOST + "users/addMeteor", {idName: this.user.id, meteor: this.rformMeteor.value}).subscribe()
  }



  fullData2(meteor){
    const des= meteor["des"]
    this.http.post(environment.HOST + "allDetails", {id:des}).subscribe(
      x=> {
        console.log("Risposta iniziale", x)
        console.log("loader attivo ")
        this.fullDataDetails= x["data"];
         if (this.fullDataDetails["author"]==undefined)
          {this.fullDataDetails["author"]="CNEOS"} 
         if (this.fullDataDetails["author"]!="CNEOS"){
          this.fullDataDetails["ps_max"]= meteor["ps_max"]
         }
         console.log("loader disattivo ")
         this.loaderDetails=false
         this.keysDetails= Object.keys(this.fullDataDetails)
         console.log("fullData ", this.fullDataDetails);
        
         
        })

  }




  fullData(meteor){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'instant'
    });
    this.showFullDataDetails=true;
    this.loaderDetails= true;
    console.log("meteor ", meteor)
    const des= meteor["des"]
    this.http.post(environment.HOST + "allDetails", {id:des}).subscribe(
      x=> {
        console.log("Risposta iniziale", x)
        console.log("loader attivo ")
        this.fullDataDetails= x["data"];
         if (this.fullDataDetails["author"]==undefined)
          {this.fullDataDetails["author"]="CNEOS"} 
         if (this.fullDataDetails["author"]!="CNEOS"){
          this.fullDataDetails["ps_max"]= meteor["ps_max"]
         }
         console.log("loader disattivo ")
         this.loaderDetails=false
         this.keysDetails= Object.keys(this.fullDataDetails)
         console.log("fullData ", this.fullDataDetails);
        
         
        })


  }



  closeFullData(){
    this.showFullDataDetails= false
  }


  details(meteor){
    let url= this.router.url
    let url1= "/" + url.split("/")[1]
    let url2= "/" + url.split("/")[2]
console.log("URL", url1, url2)
  
window.scroll({ 
  top: 0, 
  left: 0, 
  behavior: 'instant'
});

this.meteorInExam= meteor

    // this.router.navigate([url1, url2], { fragment: 'topPage' })
    this.meteorDetail= true
    let d= meteor

    

    this.chartVelocity= this.buildChartVelocity(meteor["v_inf"])
    this.chartDiameter= this.buildChartDiameter(meteor["diameter"])
    this.chartHazard= this.buildChartHazard(meteor["ps_max"])
    this.chartRange= this.buildChartRange(meteor["range"])
  }














closeGraphics(){
  this.meteorDetail= false
}











  buildGraphicVelocity(meteors){
    for (let met of meteors){
      if (parseFloat(met["v_inf"])<5){
        this.velocityLess5 +=1 
      }
      else if (parseFloat(met["v_inf"])<10){
        this.velocityLess10+=1
      }
      else if(parseFloat(met["v_inf"])<15){
        this.velocityLess15+=1
      }
      else if(parseFloat(met["v_inf"])<20){
        this.velocityLess20+=1
      }
      else{
        this.velocityOver20+=1
      }
  }
  return true
  }



  buildGraphicDiameter(meteors){
    for (let met of meteors){
      if (parseFloat(met["diameter"])<0.5){
        this.diameterLess1 +=1 
      }
      else if (parseFloat(met["diameter"])<1){
        this.diameterLess2+=1
      }
      else if(parseFloat(met["diameter"])<1.5){
        this.diameterLess3+=1
      }
      else if(parseFloat(met["diameter"])<2){
        this.diameterLess4+=1
      }
      else if(parseFloat(met["diameter"])<2.5){
        this.diameterLess5+=1
        
      }
      else if(parseFloat(met["diameter"])<3){
        this.diameterLess6+=1
      }
      else{
        this.diameterOver6+=1
      }
  }
  return true
  }



  buildGraphicHazard(meteors){
    for (let met of meteors){
      // console.log("NUMERO" ,parseFloat(met["ps_max"]))
      
      if (parseFloat(met["ps_max"])<=-12){
        
        this.hazardLess12 +=1 
      }
      else if (parseFloat(met["ps_max"])<-10){
        this.hazardLess10+=1
      }
      else if(parseFloat(met["ps_max"])<-8){
        this.hazardLess8+=1
      }
      else if(parseFloat(met["ps_max"])<-6){
        this.hazardLess6+=1
      }
      else if(parseFloat(met["ps_max"])<-4){
        this.hazardLess4+=1
        
      }
     
      else{
        this.hazardOver4+=1
      }
  }
  return true
  }




  buildGraphicRange(meteors){
    for (let met of meteors){
      let date1= met["range"].split("-")
      // console.log("NUMERO" ,parseFloat(met["ps_max"]))
      // console.log("PROVA RANGE", parseFloat(date1), parseFloat(date1)<2030)
      if (parseFloat(date1)<2030){
        
        this.range2030+=1 
      }
      else if (parseFloat(date1)<2040){
        this.range2040+=1
      }
      else if(parseFloat(date1)<2050){
        this.range2050+=1
      }
      else if(parseFloat(date1)<2060){
        this.range2060+=1
      }
      else if(parseFloat(date1)<2070){
        this.range2070+=1
        
      }

      else if(parseFloat(date1)<2080){
        this.range2080+=1
        
      }
      else if(parseFloat(date1)<2090){
        this.range2090+=1
        
      }

      else if(parseFloat(date1)<2100){
        this.range2100+=1
        
      }
     
      else{
        this.rangeOver2100+=1
      }
  }
  return true
  }




prelevaAccordion(){

  var acc= document.getElementsByClassName("accordion");
var lun= acc.length
  
  // for (let k=0; k<10000000000; k++){}
  console.log("acc", acc, acc["length"])
  
  
  for (let i = 0; i < acc.length; i++) {
    console.log(1)
    acc[i].addEventListener("click", function() {
     console.log("toccato accordion")
      this.classList.toggle("active");
  
      
      var panel = this.parentElement.nextElementSibling
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
  }



provaAccordion(event: MouseEvent){
  console.log("ee", event.target)
  let aus=  ( <HTMLElement>event.target )
  var panel = aus.parentElement.nextElementSibling as HTMLElement

  console.log("pannello", panel)
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }

}
























  








  

  



buildChartRange(ranged){
  let highlight=[]
  let correct= '#008000'
  let wrong= '#808080'
  let range= ranged.split("-")[0]

    console.log("range e £", range)
    if (range<2030){
     highlight = [
        {name: "<2030", y:this.range2030, color: correct},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else if (range<2040){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: correct},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else if (range<2050){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: correct},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else if (range<2060){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: correct},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }

    else if (range<2070){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: correct},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else if (range<2080){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: correct},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else if (range<2090){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: correct},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else if (range<2100){
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: correct},
        {name: "+2100", y:this.rangeOver2100, color: wrong}
      ]
    }
    else{
      highlight = [
        {name: "<2030", y:this.range2030, color: wrong},
        {name: "<2040", y:this.range2040, color: wrong},
        {name: "<2050", y:this.range2050, color: wrong},
        {name: "<2060", y:this.range2060, color: wrong},
        {name: "<2070", y:this.range2070, color: wrong},
        {name: "<2080", y:this.range2080, color: wrong},
        {name: "<2090", y:this.range2090, color: wrong},
        {name: "<2100", y:this.range2100, color: wrong},
        {name: "+2100", y:this.rangeOver2100, color: correct}
      ]
    }
    return new Chart({
      chart: {
        type: 'pie',
        plotShadow: false
      },

      credits: {
        enabled: false
      },

      plotOptions:{
        pie: {
          innerSize: '99%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 0,
          dataLabels: {
            connectorWidth: 0
          }
        }
      },

      title:{
        verticalAlign: 'middle',
        floating: true,
        text: 'Range'
      },

      legend:{
        enabled: false
      },

      series: [
        {
          type: 'pie',
          data:highlight
        }
      ]
    })

}









  buildChartVelocity(velocity){
    let highlight= []
    let correct= '#008000'

    console.log("velocità e £", velocity)
    if (velocity<5){
     highlight = [
        {name: "<5km/s", y:this.velocityLess5, color: correct},
        {name: "<10km/s", y:this.velocityLess10, color: '#808080'},
        {name: "<15km/s", y:this.velocityLess15, color: '#808080'},
        {name: "<20km/s", y:this.velocityLess20, color: '#808080'},
        {name: ">20km/s", y:this.velocityOver20, color: '#808080'}
      ]
    }
    else if (velocity<10){
      highlight = [
        {name: "<5km/s", y:this.velocityLess5, color: '#808080'},
        {name: "<10km/s", y:this.velocityLess10, color: correct},
        {name: "<15km/s", y:this.velocityLess15, color: '#808080'},
        {name: "<20km/s", y:this.velocityLess20, color: '#808080'},
        {name: ">20km/s", y:this.velocityOver20, color: '#808080'}
      ]
    }
    else if (velocity<15){
      highlight = [
        {name: "<5km/s", y:this.velocityLess5, color: '#808080'},
        {name: "<10km/s", y:this.velocityLess10, color: '#808080'},
        {name: "<15km/s", y:this.velocityLess15, color: correct},
        {name: "<20km/s", y:this.velocityLess20, color: '#808080'},
        {name: ">20km/s", y:this.velocityOver20, color: '#808080'}
      ]
    }
    else if (velocity<15){
      highlight = [
        {name: "<5km/s", y:this.velocityLess5, color: '#808080'},
        {name: "<10km/s", y:this.velocityLess10, color: '#808080'},
        {name: "<15km/s", y:this.velocityLess15, color: '#808080'},
        {name: "<20km/s", y:this.velocityLess20, color: correct},
        {name: ">20km/s", y:this.velocityOver20, color: '#808080'}
      ]
    }
    else{
      highlight = [
        {name: "<5km/s", y:this.velocityLess5, color: '#808080'},
        {name: "<10km/s", y:this.velocityLess10, color: '#808080'},
        {name: "<15km/s", y:this.velocityLess15, color: '#808080'},
        {name: "<20km/s", y:this.velocityLess20, color: '#808080'},
        {name: ">20km/s", y:this.velocityOver20, color: correct}
      ]
    }
    return new Chart({
      chart: {
        type: 'pie',
        plotShadow: false
      },

      credits: {
        enabled: false
      },

      plotOptions:{
        pie: {
          innerSize: '99%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 0,
          dataLabels: {
            connectorWidth: 0
          }
        }
      },

      title:{
        verticalAlign: 'middle',
        floating: true,
        text: 'Velocity'
      },

      legend:{
        enabled: false
      },

      series: [
        {
          type: 'pie',
          data:highlight
        }
      ]
    })
  }








  buildChartHazard(hazard){
    let highlight= []
    let correct= '#008000'
    let wrong=  '#808080'

    console.log("hazard e £", hazard)
    if (hazard<-12){
     highlight =[
      {name: "<-12", y:this.hazardLess12, color: correct},
      {name: "<-10", y:this.hazardLess10, color: wrong},
      {name: "<-8", y:this.hazardLess8, color: wrong},
      {name: "<-6", y:this.hazardLess6, color: wrong},
      {name: "<-4", y:this.hazardLess4, color: wrong},
      {name: "<-2", y:this.hazardOver4, color: wrong}]
    }
    else if (hazard<-10){
      highlight = [
        {name: "<-12", y:this.hazardLess12, color: wrong},
        {name: "<-10", y:this.hazardLess10, color: correct},
        {name: "<-8", y:this.hazardLess8, color: wrong},
        {name: "<-6", y:this.hazardLess6, color: wrong},
        {name: "<-4", y:this.hazardLess4, color: wrong},
        {name: "<-2", y:this.hazardOver4, color: wrong}]
    }
    else if (hazard<-8){
      highlight = [
        {name: "<-12", y:this.hazardLess12, color: wrong},
        {name: "<-10", y:this.hazardLess10, color: wrong},
        {name: "<-8", y:this.hazardLess8, color: correct},
        {name: "<-6", y:this.hazardLess6, color: wrong},
        {name: "<-4", y:this.hazardLess4, color: wrong},
        {name: "<-2", y:this.hazardOver4, color: wrong}]
    }
    else if (hazard<-6){
      highlight = [
        {name: "<-12", y:this.hazardLess12, color: wrong},
        {name: "<-10", y:this.hazardLess10, color: wrong},
        {name: "<-8", y:this.hazardLess8, color: wrong},
        {name: "<-6", y:this.hazardLess6, color: correct},
        {name: "<-4", y:this.hazardLess4, color: wrong},
        {name: "<-2", y:this.hazardOver4, color: wrong}]
    }
    else if (hazard<-4){
      highlight = [
        {name: "<-12", y:this.hazardLess12, color: wrong},
        {name: "<-10", y:this.hazardLess10, color: wrong},
        {name: "<-8", y:this.hazardLess8, color: wrong},
        {name: "<-6", y:this.hazardLess6, color: wrong},
        {name: "<-4", y:this.hazardLess4, color: correct},
        {name: "<-2", y:this.hazardOver4, color: wrong}]
    }
    else{
      highlight = [
        {name: "<-12", y:this.hazardLess12, color: wrong},
        {name: "<-10", y:this.hazardLess10, color: wrong},
        {name: "<-8", y:this.hazardLess8, color: wrong},
        {name: "<-6", y:this.hazardLess6, color: wrong},
        {name: "<-4", y:this.hazardLess4, color: wrong},
        {name: "<-2", y:this.hazardOver4, color: correct}]
    }
    return new Chart({
      chart: {
        type: 'pie',
        plotShadow: false
      },

      credits: {
        enabled: false
      },

      plotOptions:{
        pie: {
          innerSize: '99%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 0,
          dataLabels: {
            connectorWidth: 0
          }
        }
      },

      title:{
        verticalAlign: 'middle',
        floating: true,
        text: 'Hazard'
      },

      legend:{
        enabled: false
      },

      series: [
        {
          type: 'pie',
          data:highlight
        }
      ]
    })
  }







  buildChartDiameter(diameter){
    let highlight= []
    let correct= '#008000'
    let wrong=  '#808080'

    console.log("diameter e £", diameter)
    if (diameter<0.5){
     highlight =[
      {name: "<0.5km", y:this.diameterLess1, color: correct},
      {name: "<1km", y:this.diameterLess2, color: wrong},
      {name: "<1.5km", y:this.diameterLess3, color: wrong},
      {name: "<2km", y:this.diameterLess4, color: wrong},
      {name: "<2.5km", y:this.diameterLess5, color: wrong},
      {name: "<3km", y:this.diameterLess6, color: wrong},
      {name: ">3km", y:this.diameterOver6, color: wrong}]
    }
    else if (diameter<1){
      highlight = [
        {name: "<0.5km", y:this.diameterLess1, color: wrong},
        {name: "<1km", y:this.diameterLess2, color: correct},
        {name: "<1.5km", y:this.diameterLess3, color: wrong},
        {name: "<2km", y:this.diameterLess4, color: wrong},
        {name: "<2.5km", y:this.diameterLess5, color: wrong},
        {name: "<3km", y:this.diameterLess6, color: wrong},
        {name: ">3km", y:this.diameterOver6, color: wrong}]
    }
    else if (diameter<1.5){
      highlight =[
        {name: "<0.5km", y:this.diameterLess1, color: wrong},
        {name: "<1km", y:this.diameterLess2, color: wrong},
        {name: "<1.5km", y:this.diameterLess3, color: correct},
        {name: "<2km", y:this.diameterLess4, color: wrong},
        {name: "<2.5km", y:this.diameterLess5, color: wrong},
        {name: "<3km", y:this.diameterLess6, color: wrong},
        {name: ">3km", y:this.diameterOver6, color: wrong}]
    }
    else if (diameter<2){
      highlight = [
        {name: "<0.5km", y:this.diameterLess1, color: wrong},
        {name: "<1km", y:this.diameterLess2, color: wrong},
        {name: "<1.5km", y:this.diameterLess3, color: wrong},
        {name: "<2km", y:this.diameterLess4, color: correct},
        {name: "<2.5km", y:this.diameterLess5, color: wrong},
        {name: "<3km", y:this.diameterLess6, color: wrong},
        {name: ">3km", y:this.diameterOver6, color: wrong}]
    }
    else if (diameter<2.5){
      highlight = [
        {name: "<0.5km", y:this.diameterLess1, color: wrong},
        {name: "<1km", y:this.diameterLess2, color: wrong},
        {name: "<1.5km", y:this.diameterLess3, color: wrong},
        {name: "<2km", y:this.diameterLess4, color: wrong},
        {name: "<2.5km", y:this.diameterLess5, color: correct},
        {name: "<3km", y:this.diameterLess6, color: wrong},
        {name: ">3km", y:this.diameterOver6, color: wrong}]
    }
    else if (diameter<3){
      highlight = [
        {name: "<0.5km", y:this.diameterLess1, color: wrong},
        {name: "<1km", y:this.diameterLess2, color: wrong},
        {name: "<1.5km", y:this.diameterLess3, color: wrong},
        {name: "<2km", y:this.diameterLess4, color: wrong},
        {name: "<2.5km", y:this.diameterLess5, color: wrong},
        {name: "<3km", y:this.diameterLess6, color: correct},
        {name: ">3km", y:this.diameterOver6, color: wrong}]
    }
    else{
      highlight = [
        {name: "<0.5km", y:this.diameterLess1, color: wrong},
        {name: "<1km", y:this.diameterLess2, color: wrong},
        {name: "<1.5km", y:this.diameterLess3, color: wrong},
        {name: "<2km", y:this.diameterLess4, color: wrong},
        {name: "<2.5km", y:this.diameterLess5, color: wrong},
        {name: "<3km", y:this.diameterLess6, color: wrong},
        {name: ">3km", y:this.diameterOver6, color: correct}]
    }
    return new Chart({
      chart: {
        type: 'pie',
        plotShadow: false
      },

      credits: {
        enabled: false
      },

      plotOptions:{
        pie: {
          innerSize: '99%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 0,
          dataLabels: {
            connectorWidth: 0
          }
        }
      },

      title:{
        verticalAlign: 'middle',
        floating: true,
        text: 'Diameter'
      },

      legend:{
        enabled: false
      },

      series: [
        {
          type: 'pie',
          data:highlight
        }
      ]
    })
  }











setInitialValues(cacheVelocity, cacheDiameter, cacheHazard, cacheRange){
    this.velocityLess5= cacheVelocity[0]
    this.velocityLess10= cacheVelocity[1]
    this.velocityLess15= cacheVelocity[2]
    this.velocityLess20= cacheVelocity[3]
    this.velocityOver20= cacheVelocity[4]

    this.diameterLess1= cacheDiameter[0]
    this.diameterLess2= cacheDiameter[1]
    this.diameterLess3= cacheDiameter[2]
    this.diameterLess4= cacheDiameter[3]
    this.diameterLess5= cacheDiameter[4]
    this.diameterLess6= cacheDiameter[5]
    this.diameterOver6= cacheDiameter[6]

    this.hazardLess12 = cacheHazard[0]
    this.hazardLess10 = cacheHazard[1]
    this.hazardLess8 = cacheHazard[2]
    this.hazardLess6 = cacheHazard[3]
    this.hazardLess4 = cacheHazard[4]
    this.hazardOver4 = cacheHazard[5]

    this.range2030 = cacheRange[0]
    this.range2040 = cacheRange[1]
    this.range2050 = cacheRange[2]
    this.range2060 = cacheRange[3]
    this.range2070 = cacheRange[4]
    this.range2080= cacheRange[5]
    this.range2090 = cacheRange[6]
    this.range2100= cacheRange[7]
    this.rangeOver2100= cacheRange[8]


}







}
