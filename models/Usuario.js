const {genSalt, hash, compare}=require('bcrypt');
const {Schema,model}=require('mongoose');


const usuarioSchema=new Schema({
    usuario:{
        type: String,
        unique: [true,'No se puede repetir nombre de usuario'],
        required:[true,'El usuario es obligatorio'],
        max:[20,'La longitud del campo supera lo permitido (20)']
        
    },
    nombres:{
        type: String,
        required:[true,'El nombre completo de usuario es obligatorio']
    },
    contrasena:{
        type: String,
        required:[true,'La contraseña es obligatoria']
    },
    rol:{
        type: String,
        required:[true,'El rol de usuario es obligatorio']
    }
},{
    collection:'Usuarios'
});

usuarioSchema.pre('save',async function(next){
    console.log("Encriptando Contraseña");
    const salt=await genSalt(parseInt(process.env.BCRYPT_ROUNDS));
    this.contrasena=await hash(this.contrasena,salt);
    next();
});


usuarioSchema.methods.compararPasswords=async function(passwordTextoPlano){
    console.log('Comparando contraseñas...');
    // password texplano es el que se recibe
    // this.contrasena es la contraseña ya encriptada
    console.log(passwordTextoPlano);
    console.log(this.contrasena);
    return await compare(passwordTextoPlano,this.contrasena);
};

exports.Usuario=model('Usuario',usuarioSchema);


