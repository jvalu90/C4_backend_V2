const { Usuario }=require("../models/Usuario");

const { sign }=require("jsonwebtoken");

const getTokenPair=async(user)=>{
    // user: Datos del usuario en la base de datos
    const accessToken=await sign(
        {
            user:{_id:user._id,rol:user.rol,usuario:user.usuario},
        },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn:'1d'}
    );

    const refreshToken=await sign(
        {user:{_id:user._id,usuario:user.usuario}},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'7d'}
    );

    return {refreshToken,accessToken};

};

const validarUsuario=async(loginData)=> {
    //console.log('Tratando de validar Login...');
    const usr=await Usuario.findOne({usuario:loginData.usuario});
    if(!usr) throw new Error ('Usuario incorrecto.');
    console.log('Validando Login...');
    const passwordMatch=await usr.compararPasswords(loginData.contrasena);
    if(!passwordMatch) throw new Error ('Contraseña incorrecta.');
    return await getTokenPair(usr);
}

exports.validarUsuario=validarUsuario;
exports.getTokenPair=getTokenPair;