import { AfterContentInit, AfterRenderRef, AfterViewChecked, AfterViewInit, Component, OnInit, inject } from '@angular/core';
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

import { Chart } from 'angular-highcharts';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{

  constructor(public states: StatesService, public meteorServices: MeteorsService, public http: HttpClient, private auth: AuthService, private router: Router){

  }

  meteors: Meteor[]

  hide = true;

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

  chartRange

  errorFetch: boolean= false

  errorLogin: boolean= false

  chartVelocity
  chartDiameter
  chartHazard

  meteors2
  
  ngOnInit(): void {
   
    let cacheGraph = localStorage.getItem("cacheGraph")

    if (cacheGraph){
      this.setInitialValues(JSON.parse(localStorage.getItem("cacheVelocity")), 
      JSON.parse(localStorage.getItem("cacheDiameter")),
      JSON.parse(localStorage.getItem("cacheHazard")),
      JSON.parse(localStorage.getItem("cacheRange")))
    }


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
    

    let cacheMeteors= localStorage.getItem("cacheMeteors")
    console.log("cache meteor 1", cacheMeteors)
    if (!cacheMeteors){ //NO CACHE
      console.log("dentro if")
      let subscription1= this.meteorServices.getMeteors().subscribe(
        {next: x=> {
        this.meteors= x; 
        console.log("iniziation 1", this.meteors.length); 
        this.selected_meteors= this.meteors.slice(0,this.page)
        this.isLoading=false;
        let totalMeteors= this.meteors.length
        this.lastNumberPage= parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))
        console.log("ending 1", this.meteors)
        localStorage.setItem("cacheMeteors", JSON.stringify(this.meteors))

        console.log("sto costruendo grafici con", this.meteors)


        let buildGraphVelocity= this.buildGraphicVelocity(this.meteors)
      let buildGraphDiameter= this.buildGraphicDiameter(this.meteors)
      let buildGraphHazard= this.buildGraphicHazard(this.meteors)
      let buildGraphRange= this.buildGraphicRange(this.meteors)

      localStorage.setItem("cacheGraph", "true")
      localStorage.setItem("cacheVelocity", JSON.stringify([this.velocityLess5, this.velocityLess10, this.velocityLess15, this.velocityLess20, this.velocityOver20]))
      localStorage.setItem("cacheDiameter", JSON.stringify([this.diameterLess1, this.diameterLess2, this.diameterLess3,  this.diameterLess4, this.diameterLess5, this.diameterLess6, this.diameterOver6]))




      this.chartVelocity= this.buildChartVelocity()
      this.chartDiameter= this.buildChartDiameter()
      this.chartHazard= this.buildChartHazard()
      this.chartRange= this.buildChartRange()
    
        
      },
      error: (e) => {this.errorFetch= true; console.log("SCATTATO ERROE")}});}

      // CACHE
    else{
      console.log("cache meteors 1 act")
      this.meteors= JSON.parse(localStorage.getItem("cacheMeteors"))
      console.log("contenuto ",  JSON.parse(localStorage.getItem("cacheMeteors")))
      this.isLoading=false
      this.selected_meteors= this.meteors.slice(0,this.page)

      let buildGraph= this.buildGraphicVelocity(this.meteors)
      let buildGraphDiameter= this.buildGraphicDiameter(this.meteors)
      let buildGraphHazard= this.buildGraphicHazard(this.meteors)
      let buildGraphRange= this.buildGraphicRange(this.meteors)

      this.chartVelocity= this.buildChartVelocity()
      this.chartDiameter= this.buildChartDiameter()
      this.chartHazard= this.buildChartHazard()
      this.chartRange= this.buildChartRange()

    }
    







    //  this.lineChart= new Chart({
    //   chart: {
    //     type: "line"
    //   },
    //   title: {
    //     text: "Future Impacts"
    //   },
    //   credits:{
    //     enabled: false
    //   },
    //   series:[{
    //     name:"aaa",
    //     data: [1,2,3]
    //   } as any],
      
    //  })

    



  
   

    // console.log("meteore ", this.meteors= this.meteorServices.meteors)
    // this.meteors= this.meteorServices.meteors;
    
    

    this.rform= new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      password: new FormControl()
    })



    
  }









  ngAfterViewInit() {
    
  
    setTimeout(()=>{
    console.log("ngAFTERCONTENITNIT")

    let cacheMeteorsD= localStorage.getItem("cacheMeteors")

    if (true){
    let subscription2= this.meteorServices.getMeteors2().subscribe(
      {next: x=> {
      this.meteors2= x; 
      console.log("iniziation", this.meteors2.length); 
      let cacheGraph = localStorage.getItem("cacheGraph")


        if (!cacheGraph){
        
      this.buildGraphicVelocity(this.meteors2);
      this.buildGraphicDiameter(this.meteors2);
      this.buildGraphicHazard(this.meteors2)
      this.buildGraphicRange(this.meteors2)

      this.chartVelocity=this.buildChartVelocity()
      this.chartDiameter= this.buildChartDiameter()
      this.chartHazard= this.buildChartHazard()
      this.chartRange= this.buildChartRange()}

     

      if (!cacheGraph){
        
      localStorage.setItem("cacheVelocity", JSON.stringify([this.velocityLess5, this.velocityLess10, this.velocityLess15, this.velocityLess20, this.velocityOver20]))
      localStorage.setItem("cacheDiameter", JSON.stringify([this.diameterLess1, this.diameterLess2, this.diameterLess3, this.diameterLess4, this.diameterLess5, this.diameterLess5, this.diameterLess6, this.diameterOver6]))
      localStorage.setItem("cacheHazard", JSON.stringify([this.hazardLess12, this.hazardLess10, this.hazardLess8, this.hazardLess6, this.hazardLess4, this.hazardOver4]))
      localStorage.setItem("cacheRange", JSON.stringify([this.range2030, this.range2040, this.range2050, this.range2060, this.range2070, this.range2080, this.range2090, this.range2100, this.rangeOver2100]))
      }



      this.meteors= this.meteors.concat(this.meteors2)
      
      let totalMeteors= this.meteors.length
      console.log("TOALE 2,", totalMeteors)
      this.lastNumberPage= parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))
      localStorage.setItem("cacheGraph", "true")
      // localStorage.setItem("cacheMeteors", JSON.stringify(this.meteors))
      
    },
    error: (e) => {this.errorFetch= true; console.log("SCATTATO ERROE")}});}
    else{
      this.meteors= JSON.parse(localStorage.getItem("cacheMeteors"))
      console.log("cach met act 2")
      this.isLoading=false

    }
  }, 3000)
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


































  buildChartDiameter(){
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
          data:[
            {name: "<0.5km", y:this.diameterLess1, color: '#26B632'},
            {name: "<1km", y:this.diameterLess2, color: '#C5D112'},
            {name: "<1.5km", y:this.diameterLess3, color: '#12D182'},
            {name: "<2km", y:this.diameterLess4, color: '#EA1FF6'},
            {name: "<2.5km", y:this.diameterLess5, color: '#605408'},
            {name: "<3km", y:this.diameterLess6, color: '#2849BF'},
            {name: ">3km", y:this.diameterOver6, color: '#D20103'}
          ]
        }
      ]
    })
  }








  buildChartHazard(){
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
          data:[
            {name: "<-12", y:this.hazardLess12, color: '#26B632'},
            {name: "<-10", y:this.hazardLess10, color: '#C5D112'},
            {name: "<-8", y:this.hazardLess8, color: '#12D182'},
            {name: "<-6", y:this.hazardLess6, color: '#EA1FF6'},
            {name: "<-4", y:this.hazardLess4, color: '#605408'},
           
            {name: "<-2", y:this.hazardOver4, color: '#D20103'}
          ]
        }
      ]
    })
}





buildChartRange(){
  return new Chart({
    chart:{
      type: "area"
    },
    title: {
      text: "Future Impacts"
    },
    xAxis: {
      categories: [
        "2030", "2040", "2050", "2060", "2070", "2080", "2090", "2100", "2100+"
      ]
    },
    yAxis:{
      title: {
        text: "N. Meteors"
      }
    },
    credits: {
      enabled: false
    },
    series: [{
         name: "Meteors/Year",
          data: [this.range2030, this.range2040, this.range2050, this.range2060, this.range2070, this.range2080, this.range2090, this.range2100, this.rangeOver2100]
        } as any],
    exporting:{
      enabled: false
    },
    rangeSelector:{
      enabled: false
    },
    navigator:{
      enabled: false
    },
    scrollbar: {
      enabled: false
    }
  })

}









  buildChartVelocity(){
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
          data:[
            {name: "<5km/s", y:this.velocityLess5, color: '#26B632'},
            {name: "<10km/s", y:this.velocityLess10, color: '#C5D112'},
            {name: "<15km/s", y:this.velocityLess15, color: '#12D182'},
            {name: "<20km/s", y:this.velocityLess20, color: '#EA1FF6'},
            {name: ">20km/s", y:this.velocityOver20, color: '#D20103'}
          ]
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
