const exp= require("express")
const fs = require("fs");
const cors= require('cors');
const usersRoute= require('./Routes/usersRoute.js')
const errorController= require('./Controllers/errorController.js')
const CustomError= require("./Utils/CustomError.js")
const got= import("got")
var axios = require('axios');
const {parse} = require("csv-parse");
var {Meteor, meteorSchema}= require("./Models/meteorModel.js")
const fetchData = require("./fetchData.js")



require('dotenv').config({path: './config.env'})



const app= exp();

 
app.use(cors({origin: 'https://aldebaranprojectfe.onrender.com'}));


// app.use(cors({origin: 'http://localhost:4200'}));


app.use(exp.urlencoded({extended: true}))

app.use(exp.json());

const port= process.env.PORT || 4000

app.listen(port);

console.log("porta n.", port)

// READING CSV FILES FROM ANOTHER SOURCES

// GENERIC
// fs.createReadStream("./sbdb_query_results.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     console.log("riga", row);
//   })
//   .on("end", function () {
//     console.log("finished");
//   })
//   .on("error", function (error) {
//     console.log(error.message);
//   });


  // GITHUB globalmeteornetwork
  // fs.readFile('./Summary2024.txt', 'utf8', (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  
  //   rows=[];
  //   let count=0
  //   let righe= data.split("\n").slice(1, 10000)
  //   for (let row of righe ){
  //     let splitted= row.split(";")
  //     if (count>11 && splitted.length>2){
        
        
  //     meteor= {};
  //     let fields= splitted;
  //     console.log("campi", fields, "riga", row)
  //     meteor["id"]=fields[0].trim()
  //     meteor["date"]= fields[2].trim()
  //     meteor["velocity"] = parseInt(fields[21].trim() ) / 2
  //     meteor["magnitude"]= parseInt(fields[76].trim() ) + 2
  //     meteor["hazard"]= -1.0 * (5 + Math.random()*5)
  //     console.log("meteora£, ", meteor)
  //     rows.push(meteor)
  //     }
  //     count+=1
  //   }
    
  
  
  //   fs.writeFileSync('./cache.json', JSON.stringify(rows) , 'utf-8');
  //   console.log("fatto")
    
  // });



  // RECOVER FILE GLOBALMETEORNETWORK IN CACHE

// fs.readFile('./cache.json', 'utf-8', (err, data) =>{
//   if (err) console.log(err)
//   count= 0
//  let data2= JSON.parse(data)
//   for (let row of data2){
//     count+=1
//     console.log("data ", row)
//     if (count> 20) break
//   }
// })





//DA CANCELLARE PROVA
app.get("/signup", (req, res)=> {res.send({name: "Mario", surname: "Luigi"})});


app.get("/task", (req, res)=> {let params= req.query; console.log("p", params); 
if(null) console.log("sono nullo");
if (params ==="null") console.log("è stringa");
if (params) console.log("Hai permesso, ", params); 
else console.log("Non hai permesso", params)});


//FINE DA CANCELLARE PROVA



app.use("/users", usersRoute)

app.get("/", (req, res)=>{let headers = req.headers; console.log(headers) ; if (req.query) console.log("ok autori", headers.auth); res.json({message: "a"})})
// app.get("/", (req, res)=> { console.log("ci arriov"); let headers = req.headers; console.log(headers) ; res.send("ok")   } )


// app.get("/meteore", (req, res)=>{
//     fetch("https://ssd-api.jpl.nasa.gov/sentry.api").then(x=> console.log(x))
// })


console.log("meta app.js")

app.get("/CNEOS_API", async (req, res) => {
  console.log("STARTED CNEOS API")
  
  axios.get('https://ssd-api.jpl.nasa.gov/sentry.api')
.then(function(response) {
    console.log(response.data.data[0]);
    console.log(response.data.data[97]);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    // console.log(response.config);

    response.data.data.map(m => {let d= m["diameter"]; let v=m["v_inf"]; m["v_inf"]=parseFloat(new Number(parseFloat(v)).toFixed(2)); d= parseFloat(parseFloat(d).toFixed(2)); m["diameter"]=d; return m})

    //CANCELLARE MODELLI CON ERRORE DA API (o che hanno una data errata di formattazione o che non hanno veloctà)
    for (let met of response.data.data){
if (met.last_obs=="2020-10-3.80160"){
  console.log("da errore" , met)
  let met_index= response.data.data.indexOf(met)
  response.data.data.splice(met_index, 1)
}
else if(met.v_inf=="NaN"){
  console.log("non ha velocita ", met)

  let met_index= response.data.data.indexOf(met)
  response.data.data.splice(met_index, 1)
}
    }





   
  // console.log("meteors", meteors)
  // console.log("tutto",response.data.data )





  // let meteorsNoDuplicate= meteorsWithDuplicate.filter((value, index, self)=> index== self.findIndex((other)=> other["v_inf"]==value["v_inf"] && other["diameter"]==value["diameter"] && other["range"] == value["range"] && other["magnitude"]== value["magnitude"]))
  // console.log("lunghezze", meteorsWithDuplicate.length, meteorsNoDuplicate.length)
 
    res.status(200).json({status:"success", data: response.data.data})
});}
)



app.get("/CNEOS_API2", async (req, res) => {
  console.log("api2 ACIVED")
  let meteors= await Meteor.find();
  let meteorNASA= fetchData.fetchNasa()  //sdb_query_result

  

console.log("mnasa", meteorNASA.slice(0, 3))

let meteorGBM = fetchData.fecthGBM()  //Summary2024


console.log("seconda ",meteorGBM.slice(0, 3))
  
let lung= meteorNASA.length
let countt=0


for (let met1 of meteorNASA){
  if(!met1["v_inf"]) countt+=1
}
console.log("not velocity ", countt, meteorNASA.slice(1,30))


let meteorsWithDuplicate= meteors.concat(meteorNASA).concat(meteorGBM)

res.status(200).json({status:"success", data: meteorsWithDuplicate})


})



// RETURN DETAILS OF ALL METEORS
app.post("/allDetails2", async (req, res)=> {
  console.log("AUTH", req.body)
  const {author}= req.body
  let meteors= await Meteor.find();
  let meteorNASA= fetchData.fetchNasa()  //sdb_query_result

  

console.log("mnasa", meteorNASA.slice(0, 3))

let meteorGBM = fetchData.fecthGBM()  //Summary2024


console.log("seconda ",meteorGBM.slice(0, 3))
  
let lung= meteorNASA.length
let countt=0


for (let met1 of meteorNASA){
  if(!met1["v_inf"]) countt+=1
}

// console.log('not velocity ', countt, meteorNASA.slice(1,30))



    if(author=="NASA"){
      return res.status(200).json({status:"success", data: meteorNASA})

    }

    if(author=="GBM"){
      return res.status(200).json({status:"success", data: meteorGBM})

    }

// let meteorsWithDuplicate= meteors.concat(meteorNASA).concat(meteorGBM)


res.status(200).json({status:"success", data: []})
  

})



//GET ALL DETAILS OF CNEOS METEORS
app.get("/allDetails3", async (req, res)=> {

  axios.get('https://ssd-api.jpl.nasa.gov/sentry.api')
  .then(async function(response) {
  
  
      response.data.data.map(m => {let d= m["diameter"]; let v=m["v_inf"]; m["v_inf"]=parseFloat(new Number(parseFloat(v)).toFixed(2)); d= parseFloat(parseFloat(d).toFixed(2)); m["diameter"]=d; return m})

      res.status(200).json({status:"success", data: response.data.data})
  }

)
  






  

})











//GIVEN AN ID RETURN DETAILS OF THAT ID
app.post("/allDetails", async (req, res)=> {

  const {id}= req.body

  console.log("ID è ", id)

  axios.get('https://ssd-api.jpl.nasa.gov/sentry.api')
.then(async function(response) {


    response.data.data.map(m => {let d= m["diameter"]; let v=m["v_inf"]; m["v_inf"]=parseFloat(new Number(parseFloat(v)).toFixed(2)); d= parseFloat(parseFloat(d).toFixed(2)); m["diameter"]=d; return m})

    //CANCELLARE MODELLI CON ERRORE DA API (o che hanno una data errata di formattazione o che non hanno veloctà)
    

    console.log("meteorrrr",response.data.data[0] )

    console.log("cerco id ", id)
    const find1= response.data.data.filter(x=> x["des"]==id)
  
    console.log("FIND 1 ", find1)

    if(find1.length>0){
      return res.status(200).json({status:"success", data: find1[0]})

    }



   

    

    //FIND METEOR DETAIL IN NASA AND GBM

  let meteors= await Meteor.find();
  let meteorNASA= fetchData.fetchNasa()  //sdb_query_result

  

console.log("mnasa", meteorNASA.slice(0, 3))

let meteorGBM = fetchData.fecthGBM()  //Summary2024


console.log("seconda ",meteorGBM.slice(0, 3))
  
let lung= meteorNASA.length
let countt=0


for (let met1 of meteorNASA){
  if(!met1["v_inf"]) countt+=1
}

// console.log('not velocity ', countt, meteorNASA.slice(1,30))

const find2= meteorNASA.concat(meteorGBM).filter(x=> x["des"]==id)

    if(find2.length>0){
      return res.status(200).json({status:"success", data: find2[0]})

    }


// let meteorsWithDuplicate= meteors.concat(meteorNASA).concat(meteorGBM)


res.status(200).json({status:"success", data: []})



    
  
})
}
)



  
app.all("*", (req, res, next) => {console.log("altri endpoint"); next(new CustomError("aa", 400))})

app.use(errorController)


module.exports= app

console.log("fine app.js")