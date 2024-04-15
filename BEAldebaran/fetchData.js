const fs= require('fs')// READING CSV FILES FROM ANOTHER SOURCES

// API GENERIC
// fs.createReadStream("./sbdb_query_results.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     console.log("riga", row);
//   })
//   .on("end", function () {
//     console.log("finished");
//     fs.writeFileSync('./cache.json', JSON.stringify(rows) , 'utf-8');
//     console.log("fatto")
//   })
//   .on("error", function (error) {
//     console.log(error.message);
//   });







//API NASA
// fs.readFile('./sbdb_query_results.csv', 'utf8', (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
      
//         rows=[];
//         let count=0
//         let righe= data.split("\n")
        
//         let righe_r = righe.slice(1)

//         console.log(righe_r.length)

//         let meteors= []


//         for (let row of righe_r){

//             let meteor={}
//             let index1= row.indexOf("(")
//             let index2= row.indexOf(")")
//             let name= row.slice(index1 +1 , index2)
           
//             meteor["des"] = name
//             meteor["id"]= row.split(",")[0] ? row.split(",")[0].trim() : ""
//             meteor["h"]= row.split(",")[8] ? Math.abs( parseFloat(row.split(",")[8]?.trim()) ) : ""

//                 if (meteor["des"] == "" || meteor["des"]== undefined || meteor["h"]== "" || meteor["h"]==undefined){
//                   console.log("ERRORE")
//                   continue
//                 }
//             meteor["diameter"]= row.split(",")[15] ? row.split(",")[15]?.trim() : String((Math.random()*2).toFixed(2))
//             meteor["last_obs"]= row.split(",")[64] ? row.split(",")[64].trim() : 1 + String(Math.floor(Math.random()*7)) + 10751111111
//             meteor["ps_max"]=  (-1.0 * (5 + Math.random()*5)).toFixed(2)
           
//           let vprov= parseInt(row.split(",")[18]) ? parseFloat((parseFloat(row.split(",")[18].trim())).toFixed(2)) + parseFloat(Math.random().toFixed(2)) : parseFloat((Math.random()*20).toFixed(2))
//           if (vprov> 25) {let vdef= 20.00 + parseFloat((Math.random()*10).toFixed(2));  meteor["v_inf"]=vdef}
//           else{meteor["v_inf"] = vprov}
//                let date1 = String(Math.floor(2050 + Math.random()*50))
//                let date2 = String(Math.floor(2100 + Math.random()*50))
//                let date= date1 + "-" + date2
//             meteor["range"]=   date  
//              meteor["author"] = "NASA"
//             meteors.push(meteor)       
            

//         }
      
//         fs.writeFileSync('./cacheNasa.json', JSON.stringify(meteors) , 'utf-8');


        
        
   
//       });


      // TO LOG DATA IN BETTER WAY (insert after fs.writefylesync)
      // let props = righe[0].split(",")
      // let values= righe[2].split(",")
      // for (let i in props ){
      //   console.log("riga ", props[i], values[i])
      // }








//READ AND CONSOLE LOG FILE NASA
// fs.readFile('./cacheNasa.json', 'utf8', (err, data) => {
//       if (err) {
//         console.error(err, err.message);
//         return;
//       }
    
      
//       data2= JSON.parse(data)
//       for(let row of data2){
//        console.log(row)
//       }



//     })






//   GITHUB globalmeteornetwork
//   fs.readFile('./Summary2024.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//   let errori=0
//     rows=[];
//     let count=0
//     // let righe= data.split("\n").slice(1, 10000)
//     let righe= data.split("\n")
//     for (let row of righe ){
//       let splitted= row.split(";")
//       if (count>11 && splitted.length>2){
        
        
//       meteor= {};
//       let fields= splitted;
//       let des1= fields[0].slice(0, 4)
//       let index1 = fields[0].indexOf("_")
//       let des2 = fields[0].slice(index1 +1, index1+1+4).toUpperCase()
//       meteor["des"] = des1 + " " + des2
//       // console.log("desTRUE", des1 + " " + des2 + "," + index1)
//       // console.log("campi", fields, "riga", row)
//       meteor["id"]=fields[0].trim()
//       let htBeg= parseFloat(splitted[67].trim())
//       let htEnd= parseFloat(splitted[73].trim())
//   meteor["diameter"]=  parseFloat((parseFloat((parseFloat(htBeg.toFixed(3)) - parseFloat(htEnd.toFixed(3))).toFixed(3)) /10).toFixed(3))
//       meteor["last_obs"]= splitted[2].trim()

// let a= splitted[23].trim()

//       let space= Math.PI * a*2 * 149597870

//       let time= parseFloat(splitted[47].trim()) * 31540000

      
//         if (!time || time==="NaN" || time===NaN || !space){
          
//           errori+=1
//           continue
//         }
    
//         let velocity= parseFloat((space/time).toFixed(3))

        
//       meteor["v_inf"]= velocity

//          let haz=  parseFloat((parseFloat(splitted[76].trim()) + 20).toFixed(2))
//       meteor["h"]= haz


// let hazprob=0
// if (haz> 22 && velocity>22){
//   hazprob= parseFloat((-1 * parseFloat((Math.random() + 4).toFixed(2))).toFixed(2))
// }
// else{
//   hazprob= parseFloat((-1 * parseFloat((Math.random()*7 + 5).toFixed(2))).toFixed(2))
// }
// meteor["ps_max"]= hazprob




//   meteor["author"] = "GMN"
//   let date1 = String(Math.floor(2050 + Math.random()*50))
//   let date2 = String(Math.floor(2100 + Math.random()*50))
//   let date= date1 + "-" + date2
// meteor["range"]=   date  
//       // console.log("meteora£, ", meteor)
//       // console.log("rowa", rows)
//       rows.push(meteor)
//       }
//       count+=1
//     }
//     console.log("er", errori, "total2", rows.length)
  
  
//     fs.writeFileSync('./cache.json', JSON.stringify(rows) , 'utf-8');
//     console.log("fatto")
    
//   });













//AGGIORNAMNETO 2.0 prove per vedere campi
  // fs.readFile('./Summary2024.txt', 'utf8', (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  
  //   rows=[];
  //   let count=0
  //   // let righe= data.split("\n").slice(200, 10000)
  //   let righe= data.split("\n")
  //   let totals=[]
  //   for (let row of righe ){
  //     let splitted= row.split(";")
  //     if (count>11 && splitted.length>2){
        
        
  //     meteor= {};
  //     let fields= splitted;
  //     // console.log("riga", row)
  //     let htBeg= parseFloat(row.split(";")[67].trim())
  //     let htEnd= parseFloat(row.split(";")[73].trim())
  //     // console.log("a£,£", htBeg, htEnd)
      
  //     let diameter= parseFloat((parseFloat((parseFloat(htBeg.toFixed(3)) - parseFloat(htEnd.toFixed(3))).toFixed(3)) /10).toFixed(3))
        
  //     let a= row.split(";")[23].trim()

  //     let space= Math.PI * a*2 * 149597870

  //     let time= parseFloat(row.split(";")[47].trim()) * 31540000
  //     let velocity= parseFloat((space/time).toFixed(3))

      
  //     // console.log(parseFloat(htEnd.toFixed(3)) ,diameter)
  //     // ddffd
  //     let last_obs= row.split(";")[2].trim()
      
  //     let h= parseFloat((parseFloat(row.split(";")[76].trim()) + 20).toFixed(2))


  //     let hazprob=0
  //     if (h> 22 && velocity>22){
  //       hazprob= parseFloat((-1 * parseFloat((Math.random() + 4).toFixed(2))).toFixed(2))
  //     }
  //     else{
  //       hazprob= parseFloat((-1 * parseFloat((Math.random()*7 + 5).toFixed(2))).toFixed(2))
  //     }
  //     let ps_max= hazprob


  //     totals.push({diameter, last_obs, h, ps_max, velocity})
  //     }
  //     count+=1
  //   }
  //   let counttt=0
  //   let ntoc=0
  //   totals.forEach((el) => { console.log(el);if (el>300) counttt+=1; else {ntoc+=1}})
  //   console.log(counttt, ntoc)
  // })



























// exports.fetchGMN= function(){
//   fs.readFile('./cache.json', 'utf8', (err, data) => {
//         if (err) {
//           console.error("Error has occured: ", err, err.message);
//           return;
//         }
      
        
//         data2= JSON.parse(data)
        
//         return data2
  
  
  
//       })
  
//   }






exports.fetchNasa= function(){
  return JSON.parse(fs.readFileSync('./cacheNasa.json', 'utf8'))}




exports.fecthGBM=  function(){
 return  JSON.parse(fs.readFileSync('./cache.json', 'utf8'))}



// ASYNC METHOD
// exports.fecthGBM= async function(){
//   fs.readFile('./cacheNasa.json', 'utf8', (err, data) => {
//         if (err) {
//           console.error("Error has occured: ", err, err.message);
//           return;
//         }
      
        
//         let data2= JSON.parse(data)
        
//         return data2
  
  
  
//       })
  
//   }