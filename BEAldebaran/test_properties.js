// TEST ALL PROPERTY PRESENTS IN ALL METEORS


let properties=["ip", "ps_cum", "last_obs", "n_imp", "last_obs_jd", "ts_max", "diameter", "range", "ps_max", "id", "des", "h", "v_inf", "fullname"]
    let eliminare=[]
    let salta= false
    let trovato= false
    for (let prop of properties) {
    console.log("prop", prop)
    for(meteor of response.data.data){
      console.log("meteor", meteor)

      for (let key of Object.keys(meteor)){
        console.log("key", key)
        
        if (key==prop) trovato=true;
        if (trovato) {
          
          
          break
        }
      }



      if (!trovato){
        eliminare.push(prop)
        console.log("non presente", prop)
        sss
        salta= true
      }

      trovato = false
      if (salta){
        salta= false;
        break
      }

    }
  }