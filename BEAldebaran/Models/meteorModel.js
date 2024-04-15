const mongoose= require("mongoose")
const validator= require("validator")



const meteorSchema= mongoose.Schema({
    id: String,
    des: String,
    range: String,
    ps_max: String,
    fullname: String,
    v_inf: String,
    h: String,
    last_obs_jd: String,
    ip: String,
    ps_cum: String,
    last_obs: Date,
    n_imp: Number,
    diameter: String,
    ts_max: String,
    author: String
   
})

const Meteor = mongoose.model("meteor", meteorSchema)


// exports.meteor= meteorSchema;

module.exports= {Meteor, meteorSchema}