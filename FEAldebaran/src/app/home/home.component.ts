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
import { Options } from '@angular-slider/ngx-slider';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit{

  constructor(public states: StatesService, public meteorServices: MeteorsService, public http: HttpClient, private auth: AuthService, private router: Router){

  }

  valueVelocity: number = 0;
  highValueVelocity:number= 42
  optionsVelocity: Options = {
    floor: 1,
    ceil: 42
  };
  fixedValueVelocity
  fixedHighValueVelocity
  
  valueDiameter: number = 0;
  highValueDiameter:number= 7
  optionsDiameter: Options = {
    floor: 0,
    ceil: 7
  };
  fixedValueDiameter
  fixedHighValueDiameter

  valueHazard: number = -12;
  highValueHazard:number= -2
  optionsHazard: Options = {
    floor: -12,
    ceil: -2
  };
  fixedValueHazard
  fixedHighValueHazard

  valueMagnitude: number= 13
  highValueMagnitude: number= 33
  optionsMagnitude: Options = {
    floor: 13,
    ceil: 33
  };
  fixedValueMagnitude
  fixedHighValueMagnitude

  valueLastObs: number= 1979
  highValueLastObs: number= 2024
  optionsLastObs: Options = {
    floor: 1979,
    ceil: 2024
  };
  fixedValueLastObs
  fixedHighValueLastObs

  valueRange: number= 2024
  highValueRange: number= 2880
  optionsRange: Options = {
    floor: 2024,
    ceil: 2880
  };
  fixedValueRange
  fixedHighValueRange

  meteors: Meteor[]

  filteredMeteors= []

  filteringData: boolean= false

  filteringVelocity= false
  filteringDiameter= false
  filteringHazard= false
  filteringMagnitude= false
  filteringLastObs= false
  filteringRange= false

  hide = true;

  fetchSecondPart= false

  CNEOSFilterActive= false;
  NASAFilterActive= false;
  GMNFilterActive= false
  
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


  activeFilterVelocity
  activeFilterDiameter
  activeFilterRange
  activeFilterHazard
  activeFilterMagnitude
  activeFilterLastObs

  page= 1000;

  lastNumberPage: any
  backupLastNumberPage: any

  fields= {"diameter": "none", "v_inf": "none", "ps_max": "none", "n_imp": "none", "range": "none", "last_obs": "none", "h": "none" }
  
  sortedFields= {"diameter": {"asc": [], "desc": []}, "v_inf": {"asc": [], "desc": []}, "ps_max": {"asc": [], "desc": []}, "n_imp": {"asc": [], "desc": []}, "range": {"asc":[], "desc": []}, "last_obs": {"asc":[], "desc":[]}, "h": {"asc": [], "desc":[]}}

  isLoading= true

  formAddMeteor: boolean= this.states.formAddMeteor


  selected_meteors
  
  rform: FormGroup

  rformMeteor: FormGroup

  alertWindow: boolean= false

  tuttidettaglimeteora= false

  velocity: string= "asc"

  user: User

  chartRange
  
  atLeastOneFilterActive= false

  errorFetch: boolean= false

  errorLogin: boolean= false

  backupMeteors

  meteoradamostraredettagli

  chartVelocity
  chartDiameter
  chartHazard


  backupChartVelocity
  backupChartDiameter
  backupChartHazard
  backupChartRange

  lastFilterActive

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
        this.backupLastNumberPage= parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))
        console.log("ending 1", this.meteors)
        localStorage.setItem("cacheMeteors", JSON.stringify(this.meteors))

        console.log("sto costruendo grafici con", this.meteors)


        let buildGraphVelocity= this.buildGraphicVelocity(this.meteors)
      let buildGraphDiameter= this.buildGraphicDiameter(this.meteors)
      let buildGraphHazard= this.buildGraphicHazard(this.meteors)
      let buildGraphRange= this.buildGraphicRange(this.meteors)

      // localStorage.setItem('cacheGraph', "true")
      // localStorage.setItem("cacheVelocity", JSON.stringify([this.velocityLess5, this.velocityLess10, this.velocityLess15, this.velocityLess20, this.velocityOver20]))
      // localStorage.setItem("cacheDiameter", JSON.stringify([this.diameterLess1, this.diameterLess2, this.diameterLess3,  this.diameterLess4, this.diameterLess5, this.diameterLess6, this.diameterOver6]))
  



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


  confirmFilter(parameter, workingMeteors= this.meteors){

    this.resetCacheSortedFields()
    this.filteringData= true

    this.page=1000
    
    console.log("cofnirm filter", parameter)
    let backupValueVelocity= this.valueVelocity
    let backupHighValueVelocity= this.highValueVelocity
    let backupValueDiameter= this.valueDiameter
    let backupHighValueDiameter= this.highValueDiameter
    let backupValueHazard= this.valueHazard
    let backupHighValueHazard= this.highValueHazard
    let backupValueMagnitude= this.valueMagnitude
    let backupHighValueMagnitude= this.highValueMagnitude
    let backupValueLastObs = this.valueLastObs
    let backupHighValueLastObs= this.highValueLastObs
    let backupValueRange= this.valueRange
    let backupHighValueRange = this.highValueRange

    if (parameter=="velocity"){
      if (this.activeFilterVelocity){
        // console.log("since already active velocity, ")
      this.resetFilter("velocity")
    workingMeteors= this.meteors
  this.valueVelocity=backupValueVelocity
  this.highValueVelocity= backupHighValueVelocity
  }


      // console.log("total of metoers velocity:", workingMeteors.length)
        this.activeFilterVelocity= true
        this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.v_inf)>=this.valueVelocity && parseFloat(x.v_inf)<=this.highValueVelocity)
        workingMeteors= [...this.filteredMeteors]
        // console.log("filtered meteors velocity", this.filteredMeteors.length)
        this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 :  parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3))
        // console.log("last number velocity ", this.lastNumberPage)
        this.selected_meteors= this.filteredMeteors.slice(0,this.page)

        this.buildGraphicVelocity(this.filteredMeteors, true);
      this.buildGraphicDiameter(this.filteredMeteors, true);
      this.buildGraphicHazard(this.filteredMeteors, true)
      this.buildGraphicRange(this.filteredMeteors, true)

      this.chartVelocity=this.buildChartVelocity()
      this.chartDiameter= this.buildChartDiameter()
      this.chartHazard= this.buildChartHazard()
      this.chartRange= this.buildChartRange()
      this.filteringVelocity= false

      this.meteors= this.filteredMeteors
      this.filteringData= false

      this.fixedValueVelocity= this.valueVelocity
      this.fixedHighValueVelocity= this.highValueVelocity
      return this.filteredMeteors

}

if (parameter=="diameter"){

  if (this.activeFilterDiameter){
    // console.log("since already active diameter, ")
  this.resetFilter("diameter")
workingMeteors= this.meteors
this.valueDiameter=backupValueDiameter
this.highValueDiameter= backupHighValueDiameter
}

  // console.log("total of metoers diameter:", this.meteors.length)
  
    this.activeFilterDiameter= true
    this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.diameter)>=this.valueDiameter && parseFloat(x.diameter)<=this.highValueDiameter)
    workingMeteors= [...this.filteredMeteors]
    // console.log("filtered meteors diameter", this.filteredMeteors.length)
    this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    // console.log("last number diameter", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
    this.selected_meteors= this.filteredMeteors.slice(0,this.page)
    // console.log("after total of metoers: ", this.filteredMeteors.length)
    this.buildGraphicVelocity(this.filteredMeteors, true);
  this.buildGraphicDiameter(this.filteredMeteors, true);
  this.buildGraphicHazard(this.filteredMeteors, true)
  this.buildGraphicRange(this.filteredMeteors, true)

  this.chartVelocity=this.buildChartVelocity()
  this.chartDiameter= this.buildChartDiameter()
  this.chartHazard= this.buildChartHazard()
  this.chartRange= this.buildChartRange()
  this.filteringDiameter= false
  this.meteors= this.filteredMeteors
  this.filteringData= false

  this.fixedValueDiameter= this.valueDiameter
  this.fixedHighValueDiameter= this.highValueDiameter
  return this.filteredMeteors

}


if (parameter=="hazard"){

  if (this.activeFilterHazard){
    console.log("since already active hazard, ")
  this.resetFilter("hazard")
workingMeteors= this.meteors
this.valueHazard=backupValueHazard
this.highValueHazard= backupHighValueHazard
}

  console.log("total of metoers hazard:", this.meteors.length)
  
    this.activeFilterHazard= true
    this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.ps_max)>=this.valueHazard && parseFloat(x.ps_max)<=this.highValueHazard)
    workingMeteors= [...this.filteredMeteors]
    // console.log("filtered meteors hazard", this.filteredMeteors.length)
    this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    // console.log("last number hazard", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
    this.selected_meteors= this.filteredMeteors.slice(0,this.page)
    // console.log("after total of metoers: ", this.filteredMeteors.length)
    this.buildGraphicVelocity(this.filteredMeteors, true);
  this.buildGraphicDiameter(this.filteredMeteors, true);
  this.buildGraphicHazard(this.filteredMeteors, true)
  this.buildGraphicRange(this.filteredMeteors, true)

  this.chartVelocity=this.buildChartVelocity()
  this.chartDiameter= this.buildChartDiameter()
  this.chartHazard= this.buildChartHazard()
  this.chartRange= this.buildChartRange()
  this.filteringHazard= false
  this.meteors= this.filteredMeteors
  this.filteringData= false

  this.fixedValueHazard= this.valueHazard
  this.fixedHighValueHazard= this.highValueHazard
  return this.filteredMeteors

}


if (parameter=="magnitude"){

  if (this.activeFilterMagnitude){
    // console.log("since already active magnitude, ")
  this.resetFilter("magnitude")
workingMeteors= this.meteors
this.valueMagnitude=backupValueMagnitude
this.highValueMagnitude= backupHighValueMagnitude
}

  // console.log("total of metoers magnitude:", this.meteors.length)
  
    this.activeFilterMagnitude= true
    this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.h)>=this.valueMagnitude && parseFloat(x.h)<=this.highValueMagnitude)
    workingMeteors= [...this.filteredMeteors]
    // console.log("filtered meteors magnitde", this.filteredMeteors.length)
    this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    // console.log("last number magnitude", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
    this.selected_meteors= this.filteredMeteors.slice(0,this.page)
    // console.log("after magnitud efilters total of metoers: ", this.filteredMeteors.length)
    this.buildGraphicVelocity(this.filteredMeteors, true);
  this.buildGraphicDiameter(this.filteredMeteors, true);
  this.buildGraphicHazard(this.filteredMeteors, true)
  this.buildGraphicRange(this.filteredMeteors, true)

  this.chartVelocity=this.buildChartVelocity()
  this.chartDiameter= this.buildChartDiameter()
  this.chartHazard= this.buildChartHazard()
  this.chartRange= this.buildChartRange()
  this.filteringMagnitude= false
  this.meteors= this.filteredMeteors
  this.filteringData= false

  this.fixedValueMagnitude= this.valueMagnitude
  this.fixedHighValueMagnitude= this.highValueMagnitude
  return this.filteredMeteors

}

if (parameter=="last_obs"){

  if (this.activeFilterMagnitude){
    // console.log("since already active lastobs, ")
  this.resetFilter("last_obs")
workingMeteors= this.meteors
this.valueLastObs=backupValueLastObs
this.highValueLastObs= backupHighValueLastObs
}

  // console.log("total of metoers lastobs:", this.meteors.length)
  
    this.activeFilterLastObs= true
    // console.log("sorteddd", workingMeteors[0].last_obs, this.highValueLastObs)
    this.filteredMeteors= workingMeteors.filter(x=> parseFloat(String(x.last_obs).split("-")[0])>=this.valueLastObs && parseFloat(String(x.last_obs).split("-")[0])<=this.highValueLastObs)
    workingMeteors= [...this.filteredMeteors]
    // console.log("filtered meteors last obs", this.filteredMeteors.length)
    this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    // console.log("last number last obs", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
    this.selected_meteors= this.filteredMeteors.slice(0,this.page)
    // console.log("after lastobs efilters total of metoers: ", this.filteredMeteors.length)
    this.buildGraphicVelocity(this.filteredMeteors, true);
  this.buildGraphicDiameter(this.filteredMeteors, true);
  this.buildGraphicHazard(this.filteredMeteors, true)
  this.buildGraphicRange(this.filteredMeteors, true)

  this.chartVelocity=this.buildChartVelocity()
  this.chartDiameter= this.buildChartDiameter()
  this.chartHazard= this.buildChartHazard()
  this.chartRange= this.buildChartRange()
  this.filteringLastObs= false
  this.meteors= this.filteredMeteors
  this.filteringData= false

  this.fixedValueLastObs= this.valueLastObs
  this.fixedHighValueLastObs= this.highValueLastObs
  return this.filteredMeteors

}



if (parameter=="range"){

  if (this.activeFilterRange){
    // console.log("since already active range, ")
  this.resetFilter("range")
workingMeteors= this.meteors
this.valueRange=backupValueRange
this.highValueRange= backupHighValueRange
}

  // console.log("total of metoers range:", this.meteors.length)
  
    this.activeFilterRange= true
    // console.log("FILTRO RANGE: ", workingMeteors[0].range)
    this.filteredMeteors= workingMeteors.filter(x=> (parseFloat(x.range.split("-")[1])>=this.valueRange && parseFloat(x.range.split("-")[1])<=this.highValueRange) || (parseFloat(x.range.split("-")[0])>=this.valueRange && parseFloat(x.range.split("-")[0])<=this.highValueRange))
    workingMeteors= [...this.filteredMeteors]
    // console.log("filtered meteors range", this.filteredMeteors.length)
    this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    // console.log("last number range", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
    this.selected_meteors= this.filteredMeteors.slice(0,this.page)
    // console.log("after range efilters total of metoers: ", this.filteredMeteors.length)
    this.buildGraphicVelocity(this.filteredMeteors, true);
  this.buildGraphicDiameter(this.filteredMeteors, true);
  this.buildGraphicHazard(this.filteredMeteors, true)
  this.buildGraphicRange(this.filteredMeteors, true)

  this.chartVelocity=this.buildChartVelocity()
  this.chartDiameter= this.buildChartDiameter()
  this.chartHazard= this.buildChartHazard()
  this.chartRange= this.buildChartRange()
  this.filteringRange= false
  this.meteors= this.filteredMeteors
  this.filteringData= false

  console.log("RANGE", this.valueRange)
  this.fixedValueRange= this.valueRange
  this.fixedHighValueRange= this.highValueRange
  return this.filteredMeteors

}






this.filteringData= false
this.meteors= this.filteredMeteors
return this.filteredMeteors



  }







  resetFilter(parameter){


    console.log("reset filter ", parameter)
    
    this.disableFilter(parameter)
    
    let initialMeteors= this.backupMeteors
    let workingMeteors= this.backupMeteors//dopo ultimo aggiornamento
    //da qui inizia filtro per parametri: velocity, hazard etc
    console.log("total meteors before reset filter", initialMeteors.length)
    if (this.activeFilterVelocity){
      // initialMeteors= this.confirmFilter("velocity", initialMeteors) prima ultimo aggiornamento
      // console.log("total of metoers velocity:", workingMeteors.length)
      this.activeFilterVelocity= true
      this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.v_inf)>=this.valueVelocity && parseFloat(x.v_inf)<=this.highValueVelocity)
      workingMeteors= [...this.filteredMeteors]
      // console.log("filtered meteors velocity", this.filteredMeteors.length)
      this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 :  parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3))
      // console.log("last number velocity ", this.lastNumberPage)
      this.selected_meteors= this.filteredMeteors.slice(0,this.page)

      this.buildGraphicVelocity(this.filteredMeteors, true);
    this.buildGraphicDiameter(this.filteredMeteors, true);
    this.buildGraphicHazard(this.filteredMeteors, true)
    this.buildGraphicRange(this.filteredMeteors, true)

    this.chartVelocity=this.buildChartVelocity()
    this.chartDiameter= this.buildChartDiameter()
    this.chartHazard= this.buildChartHazard()
    this.chartRange= this.buildChartRange()
    this.filteringVelocity= false

    this.meteors= this.filteredMeteors
    this.filteringData= false

    this.fixedValueVelocity= this.valueVelocity
    this.fixedHighValueVelocity= this.highValueVelocity
    
    }

    console.log("total meteors after velocityfilter", initialMeteors.length)

    if (this.activeFilterDiameter){
      // initialMeteors= this.confirmFilter("diameter", initialMeteors)
      this.activeFilterDiameter= true
      this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.diameter)>=this.valueDiameter && parseFloat(x.diameter)<=this.highValueDiameter)
      workingMeteors= [...this.filteredMeteors]
      // console.log("filtered meteors diameter", this.filteredMeteors.length)
      this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      // console.log("last number diameter", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
      this.selected_meteors= this.filteredMeteors.slice(0,this.page)
      // console.log("after total of metoers: ", this.filteredMeteors.length)
      this.buildGraphicVelocity(this.filteredMeteors, true);
    this.buildGraphicDiameter(this.filteredMeteors, true);
    this.buildGraphicHazard(this.filteredMeteors, true)
    this.buildGraphicRange(this.filteredMeteors, true)
  
    this.chartVelocity=this.buildChartVelocity()
    this.chartDiameter= this.buildChartDiameter()
    this.chartHazard= this.buildChartHazard()
    this.chartRange= this.buildChartRange()
    this.filteringDiameter= false
    this.meteors= this.filteredMeteors
    this.filteringData= false
  
    this.fixedValueDiameter= this.valueDiameter
    this.fixedHighValueDiameter= this.highValueDiameter
    
    }

    console.log("total meteors after diameter filter", initialMeteors.length)

    if (this.activeFilterHazard){
      // initialMeteors= this.confirmFilter("hazard", initialMeteors)
      this.activeFilterHazard= true
    this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.ps_max)>=this.valueHazard && parseFloat(x.ps_max)<=this.highValueHazard)
    workingMeteors= [...this.filteredMeteors]
    // console.log("filtered meteors hazard", this.filteredMeteors.length)
    this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
    // console.log("last number hazard", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
    this.selected_meteors= this.filteredMeteors.slice(0,this.page)
    // console.log("after total of metoers: ", this.filteredMeteors.length)
    this.buildGraphicVelocity(this.filteredMeteors, true);
  this.buildGraphicDiameter(this.filteredMeteors, true);
  this.buildGraphicHazard(this.filteredMeteors, true)
  this.buildGraphicRange(this.filteredMeteors, true)

  this.chartVelocity=this.buildChartVelocity()
  this.chartDiameter= this.buildChartDiameter()
  this.chartHazard= this.buildChartHazard()
  this.chartRange= this.buildChartRange()
  this.filteringHazard= false
  this.meteors= this.filteredMeteors
  this.filteringData= false

  this.fixedValueHazard= this.valueHazard
  this.fixedHighValueHazard= this.highValueHazard

    }

    console.log("total meteors after hazard filter", initialMeteors.length)

    if (this.activeFilterMagnitude){
      // initialMeteors= this.confirmFilter("magnitude", initialMeteors)
      this.activeFilterMagnitude= true
      this.filteredMeteors= workingMeteors.filter(x=> parseFloat(x.h)>=this.valueMagnitude && parseFloat(x.h)<=this.highValueMagnitude)
      workingMeteors= [...this.filteredMeteors]
      // console.log("filtered meteors magnitde", this.filteredMeteors.length)
      this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      // console.log("last number magnitude", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
      this.selected_meteors= this.filteredMeteors.slice(0,this.page)
      // console.log("after magnitud efilters total of metoers: ", this.filteredMeteors.length)
      this.buildGraphicVelocity(this.filteredMeteors, true);
    this.buildGraphicDiameter(this.filteredMeteors, true);
    this.buildGraphicHazard(this.filteredMeteors, true)
    this.buildGraphicRange(this.filteredMeteors, true)
  
    this.chartVelocity=this.buildChartVelocity()
    this.chartDiameter= this.buildChartDiameter()
    this.chartHazard= this.buildChartHazard()
    this.chartRange= this.buildChartRange()
    this.filteringMagnitude= false
    this.meteors= this.filteredMeteors
    this.filteringData= false
  
    this.fixedValueMagnitude= this.valueMagnitude
    this.fixedHighValueMagnitude= this.highValueMagnitude
   
    }

    if (this.activeFilterLastObs){
      // initialMeteors= this.confirmFilter("last_obs", initialMeteors)
      this.activeFilterLastObs= true
      // console.log("sorteddd", workingMeteors[0].last_obs, this.highValueLastObs)
      this.filteredMeteors= workingMeteors.filter(x=> parseFloat(String(x.last_obs).split("-")[0])>=this.valueLastObs && parseFloat(String(x.last_obs).split("-")[0])<=this.highValueLastObs)
      workingMeteors= [...this.filteredMeteors]
      // console.log("filtered meteors last obs", this.filteredMeteors.length)
      this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      // console.log("last number last obs", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
      this.selected_meteors= this.filteredMeteors.slice(0,this.page)
      // console.log("after lastobs efilters total of metoers: ", this.filteredMeteors.length)
      this.buildGraphicVelocity(this.filteredMeteors, true);
    this.buildGraphicDiameter(this.filteredMeteors, true);
    this.buildGraphicHazard(this.filteredMeteors, true)
    this.buildGraphicRange(this.filteredMeteors, true)
  
    this.chartVelocity=this.buildChartVelocity()
    this.chartDiameter= this.buildChartDiameter()
    this.chartHazard= this.buildChartHazard()
    this.chartRange= this.buildChartRange()
    this.filteringLastObs= false
    this.meteors= this.filteredMeteors
    this.filteringData= false
  
    this.fixedValueLastObs= this.valueLastObs
    this.fixedHighValueLastObs= this.highValueLastObs
    
    }

    if (this.activeFilterRange){
      // initialMeteors= this.confirmFilter("range", initialMeteors)
      this.activeFilterRange= true
      // console.log("FILTRO RANGE: ", workingMeteors[0].range)
      this.filteredMeteors= workingMeteors.filter(x=> (parseFloat(x.range.split("-")[1])>=this.valueRange && parseFloat(x.range.split("-")[1])<=this.highValueRange) || (parseFloat(x.range.split("-")[0])>=this.valueRange && parseFloat(x.range.split("-")[0])<=this.highValueRange))
      workingMeteors= [...this.filteredMeteors]
      // console.log("filtered meteors range", this.filteredMeteors.length)
      this.lastNumberPage= this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      let provaultimo=  this.filteredMeteors.length<1000 ? 1 : parseInt(String(this.filteredMeteors.length).slice(0, String(this.filteredMeteors.length).length- 3)) 
      // console.log("last number range", provaultimo,String(this.filteredMeteors.length), String(this.filteredMeteors.length).length- 3 )
      this.selected_meteors= this.filteredMeteors.slice(0,this.page)
      // console.log("after range efilters total of metoers: ", this.filteredMeteors.length)
      this.buildGraphicVelocity(this.filteredMeteors, true);
    this.buildGraphicDiameter(this.filteredMeteors, true);
    this.buildGraphicHazard(this.filteredMeteors, true)
    this.buildGraphicRange(this.filteredMeteors, true)
  
    this.chartVelocity=this.buildChartVelocity()
    this.chartDiameter= this.buildChartDiameter()
    this.chartHazard= this.buildChartHazard()
    this.chartRange= this.buildChartRange()
    this.filteringRange= false
    this.meteors= this.filteredMeteors
    this.filteringData= false
  
    console.log("RANGE", this.valueRange)
    this.fixedValueRange= this.valueRange
    this.fixedHighValueRange= this.highValueRange
    
    }

    initialMeteors= [...workingMeteors]//iNSERITO IN ULTIMO AGGIORNAMENTO

    console.log("total meteors after magnitude filter", initialMeteors.length)


//da qui finsice filtro per parametri





    //da qui inizia filtro cneos, nasa, gmn

    if (this.atLeastOneFilterActive){
     
        
  
    console.log("clicked on ", this.lastFilterActive, initialMeteors.length)
      initialMeteors  = initialMeteors.filter(x=> x["author"]==this.lastFilterActive)
      
      // this.lastNumberPage= initialMeteors.length<1000? 1: parseInt(String(this.meteors.length).slice(0, String(this.meteors.length).length- 3))
      // this.selected_meteors= this.meteors.slice(0,this.page)
  
   
  
     
    }


    //qui finisce filtro

    console.log("total meteors after rest filter", initialMeteors.length)
    this.meteors= initialMeteors
    this.selected_meteors= this.meteors.slice(0,this.page)
    this.lastNumberPage= this.meteors.length<1000 ? 1 : parseInt(String(this.meteors.length).slice(0, String(this.meteors.length).length- 3))

    this.buildGraphicVelocity(initialMeteors, true);
    this.buildGraphicDiameter(initialMeteors, true);
    this.buildGraphicHazard(initialMeteors, true)
    this.buildGraphicRange(initialMeteors, true)

    console.log("after build graphic")

    this.chartVelocity=this.buildChartVelocity()
    this.chartDiameter= this.buildChartDiameter()
    this.chartHazard= this.buildChartHazard()
    this.chartRange= this.buildChartRange()

    console.log("after build chart")

    console.log("fine reset filter")
   
  }








  undoFiltering(parameter){
    if (parameter=="velocity"){
      console.log("disabilitato filtro velocity")
      this.filteringVelocity= false
      this.valueVelocity=0
      this.highValueVelocity= 42
    }
    if (parameter=="diameter"){
      this.filteringDiameter= false
      this.valueDiameter= 0
      this.highValueDiameter=7
    }
    if (parameter=="hazard"){
      this.filteringHazard= false
      this.valueHazard= -12
      this.highValueHazard= -2
    }
    if (parameter=="range"){
      this.filteringRange= false
      this.valueRange= 2024
      this.highValueRange= 2880
    }
    if (parameter=="magnitude"){
      this.filteringMagnitude= false
      this.valueMagnitude= 0
      this.highValueMagnitude
    }
    if (parameter=="last_obs"){
      this.filteringLastObs= false
      this.valueLastObs= 1979
      this.highValueLastObs= 2024
    }
  }

  disableFilter(parameter){
    if (parameter=="velocity"){
      console.log("disabilitato filtro velocity")
      this.activeFilterVelocity= false
      this.valueVelocity=0
      this.highValueVelocity= 42
    }
    if (parameter=="diameter"){
      this.activeFilterDiameter= false
      this.valueDiameter= 0
      this.highValueDiameter=7
    }
    if (parameter=="hazard"){
      this.activeFilterHazard= false
      this.valueHazard= -12
      this.highValueHazard=-2
    }
    if (parameter=="range"){
      this.activeFilterRange= false
      this.valueRange= 2024
      this.highValueRange= 2880
    }
    if (parameter=="magnitude"){
      this.activeFilterMagnitude= false
      this.valueMagnitude= 13
      this.highValueMagnitude= 33
    }
    if (parameter=="last_obs"){
      this.activeFilterLastObs= false
      this.valueLastObs= 1979
      this.highValueLastObs= 2024
    }
  }


showFilterSlider(parameter){
  if (parameter=="velocity"){
    this.filteringVelocity= true
    this.filteringDiameter=false
    this.filteringHazard= false
    this.filteringLastObs= false
    this.filteringMagnitude= false
    this.filteringRange= false
  }
  if (parameter=="diameter"){
    this.filteringVelocity= false
    this.filteringDiameter=true
    this.filteringHazard= false
    this.filteringLastObs= false
    this.filteringMagnitude= false
    this.filteringRange= false
  }
  if (parameter=="hazard"){
    this.filteringVelocity= false
    this.filteringDiameter=false
    this.filteringHazard= true
    this.filteringLastObs= false
    this.filteringMagnitude= false
    this.filteringRange= false
  }
  if (parameter=="magnitude"){
    this.filteringVelocity= false
    this.filteringDiameter=false
    this.filteringHazard= false
    this.filteringLastObs= false
    this.filteringMagnitude= true
    this.filteringRange= false
  }
  if (parameter=="last_obs"){
    this.filteringVelocity= false
    this.filteringDiameter=false
    this.filteringHazard= false
    this.filteringLastObs= true
    this.filteringMagnitude= false
    this.filteringRange= false
  }
  if (parameter=="range"){
    this.filteringVelocity= false
    this.filteringDiameter=false
    this.filteringHazard= false
    this.filteringLastObs= false
    this.filteringMagnitude= false
    this.filteringRange= true
  }
}


minimumMax(){
  console.log("begin minimum macx", this.valueVelocity, this.highValueVelocity)
  // if (this.valueVelocity>this.highValueVelocity){
  //   this.valueVelocity=this.highValueVelocity
  // }
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


      if (!this.meteors){window.location.reload()}
      this.meteors= this.meteors.concat(this.meteors2)
      this.backupMeteors= this.meteors

      let totalMeteors= this.meteors.length
      console.log("TOALE 2,", totalMeteors)
      this.lastNumberPage= parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))
      this.backupLastNumberPage= parseInt(String(totalMeteors).slice(0, String(totalMeteors).length- 3))
      console.log("last page ", this.lastNumberPage, totalMeteors)
      localStorage.setItem("cacheGraph", "true");
      this.fetchSecondPart= true
      // localStorage.setItem("cacheMeteors", JSON.stringify(this.meteors))
      
    },
    error: (e) => {this.errorFetch= true; console.log("SCATTATO ERROE")}});}
    else{
      this.meteors= JSON.parse(localStorage.getItem("cacheMeteors"))
      console.log("cach met act 2")
      this.isLoading=false

    }
  }, 1000)
  }



  isCreatingMeteor: boolean= false

  signup: boolean= this.states.signup

  provaAccordion(meteor){
    this.tuttidettaglimeteora=true
    meteor["listedIn"] = meteor["author"];
     
    this.meteoradamostraredettagli=meteor
    console.log("ok tutti dettagli")
  
  }
  

  //utilize fot CNEOS, GMN, NASSA
 filterMeteors(id){
  this.resetCacheSortedFields()
  this.filteringData= true
  this.page=1000
  if (this.atLeastOneFilterActive){
    if(this.lastFilterActive==id){

      //ultime aggiunte
      this.atLeastOneFilterActive= false
      this.lastFilterActive= undefined
      this.CNEOSFilterActive= false;
    this.GMNFilterActive= false;
    this.NASAFilterActive= false;

    console.log("filter disabled identical")
    this.resetFilter(id)
    this.filteringData= false
    return
      

      //ultimeaggiutne fine



    //   console.log("same active ", this.backupMeteors.length)
    //   this.meteors= this.backupMeteors
    //   this.lastNumberPage= this.backupLastNumberPage
    //   console.log("last number ",this.lastNumberPage)
    //   this.selected_meteors= this.meteors.slice(0,this.page)
    //   this.CNEOSFilterActive= false;
    // this.GMNFilterActive= false;
    // this.NASAFilterActive= false;
    // this.atLeastOneFilterActive=false

    // // RESET GRAPH WITH DATE IN CACHE
    // this.setInitialValues(JSON.parse(localStorage.getItem("cacheVelocity")), 
    //   JSON.parse(localStorage.getItem("cacheDiameter")),
    //   JSON.parse(localStorage.getItem("cacheHazard")),
    //   JSON.parse(localStorage.getItem("cacheRange")))

    //   this.chartVelocity=this.buildChartVelocity()
    //   this.chartDiameter= this.buildChartDiameter()
    //   this.chartHazard= this.buildChartHazard()
    //   this.chartRange= this.buildChartRange()

    
    }
    this.CNEOSFilterActive= false;
    this.GMNFilterActive= false;
    this.NASAFilterActive= false;
    this.atLeastOneFilterActive= false;
    this.lastFilterActive= undefined

    // this.resetFilter(id) COMMENTATO IN ULTIMO AGGIORNAMENTO

  
    // this.meteors= this.backupMeteors
    // this.lastNumberPage= this.backupLastNumberPage
    // console.log("last number ",this.lastNumberPage)
    // this.selected_meteors= this.meteors.slice(0,this.page)
  }

  console.log("different filter disable")
  this.atLeastOneFilterActive= true
  this.lastFilterActive= id

  console.log("before reset different filter")
  this.resetFilter(id)
  console.log("after reset filter different filter")
  // console.log("clicked on ", id, this.meteors.length)
  //   this.meteors  = this.meteors.filter(x=> x["author"]==id)
  //   this.backupLastNumberPage= this.lastNumberPage
  //   this.lastNumberPage= parseInt(String(this.meteors.length).slice(0, String(this.meteors.length).length- 3))
  //   this.selected_meteors= this.meteors.slice(0,this.page)

  //   console.log("build graphics", this.meteors.length)

  //   this.buildGraphicDiameter(this.meteors, true)
  //   this.buildGraphicHazard(this.meteors, true)
  //   this.buildGraphicVelocity(this.meteors, true)
  //   this.buildGraphicRange(this.meteors, true)
  //   this.chartVelocity=this.buildChartVelocity()
  //     this.chartDiameter= this.buildChartDiameter()
  //     this.chartHazard= this.buildChartHazard()
  //     this.chartRange= this.buildChartRange()

    console.log("after selection ", this.meteors.length)
    this.filteringData= false
    if (id=="CNEOS") {this.CNEOSFilterActive=true; console.log("active cneos filter ", this.CNEOSFilterActive)}
    else if(id=="NASA"){this.NASAFilterActive= true; console.log("active NASA filter", this.NASAFilterActive)}
    else if (id=="GMN"){this.GMNFilterActive= true}
    else{console.log("altro")}
 }

  closeDettagliMeteora(){
    this.tuttidettaglimeteora= undefined
  }

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

    console.log("firstdigi", firstDigits, "lastNumberPage", this.lastNumberPage, this.meteors.length)
    this.selected_meteors= [...this.meteors.slice(firstDigits*1000+1)]


    this.page= firstDigits*1000
    console.log("page", this.page)
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
  


  buildGraphicVelocity(meteors, resetValues=false){
   
    if (resetValues){
    this.velocityLess5=0
    this.velocityLess10=0
    this.velocityLess15=0
     this.velocityLess20=0
      this.velocityOver20=0}
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



  buildGraphicDiameter(meteors, resetValues=false){
    if (resetValues){
    this.diameterLess1 =0
    this.diameterLess2=0
    this.diameterLess3=0
    this.diameterLess4=0
    this.diameterLess5=0
    this.diameterLess6=0
    this.diameterOver6=0}
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



  buildGraphicHazard(meteors, resetValues=false){
    if (resetValues){
    this.hazardLess12 =0
    this.hazardLess10=0
    this.hazardLess8=0
    this.hazardLess6=0
    this.hazardLess4=0
    this.hazardOver4=0}
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




  buildGraphicRange(meteors, resetValues=false){
    if (resetValues){
    this.range2030=0
    this.range2040=0
    this.range2050=0
    this.range2060=0
    this.range2070=0
    this.range2080=0
    this.range2090=0
    this.range2100=0
    this.rangeOver2100=0}
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






resetCacheSortedFields(){
  this.fields= {"diameter": "none", "v_inf": "none", "ps_max": "none", "n_imp": "none", "range": "none", "last_obs": "none", "h": "none" }
  
  this.sortedFields={"diameter": {"asc": [], "desc": []}, "v_inf": {"asc": [], "desc": []}, "ps_max": {"asc": [], "desc": []}, "n_imp": {"asc": [], "desc": []}, "range": {"asc":[], "desc": []}, "last_obs": {"asc":[], "desc":[]}, "h": {"asc": [], "desc":[]}}

}






}
