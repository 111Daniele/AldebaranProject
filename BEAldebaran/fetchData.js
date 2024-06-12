const fs= require('fs')// READING CSV FILES FROM ANOTHER SOURCES







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