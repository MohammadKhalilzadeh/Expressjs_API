const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    // main info
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
        match: /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/
    },
    phone:{
        type: Number,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
    },
    // system role
    role:{
        type: String,
        required: true,
        default: "customer"
    },
    // account states
    permium:{
        type: mongoose.Schema.Types.Mixed,
    },
    owner:{
        type: Boolean,
        default: false,
    },
    // selling items
    books:{
        type : [String],
    },
    // identifications
    cardnumber:{
        type: Number,
    },
    sheba:{
        type: String,
    },
    city:{
        type: String,
    },
    province:{
        type: String,
    },
    address:{
        type: String,
    },
    postalcode:{
        type: Number,
    },
    imgs:{
        type: mongoose.Schema.Types.Mixed,
    }
})


module.exports = mongoose.model('User', userSchema)