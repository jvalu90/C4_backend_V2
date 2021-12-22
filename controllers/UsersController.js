const express =require('express');
const { Usuario }=require('../models/Usuario');
const {validarUsuario}=require('../utils/authutils');
const {genSalt, hash, compare}=require('bcrypt');

const router=express.Router();

// Consultar usuarios cRud usuarios

router.get('/data',async(request,response)=>{
   
    const datos=await Usuario.find({},null,{
        sort:{usuario:1}
    }).exec();
    response.json(datos);
});


// Consultar datos del usuario logueado

router.get('/datos_usuario_logueado',async(request,response)=>{
    try{
        console.log("Obteniendo datos del usuario logueado ...");
        console.log(request.query.usuario);
        const usuario_logueado=request.query.usuario;
        const datos=await Usuario.find({usuario:usuario_logueado}).exec();
        return response.json(datos);
    }
    catch(e){
        console.log("Error obteniendo datos del usuario logueado ...");
        console.log(e);
        response.status(500).send("Error al obtener datos del usuario logueado");
    }

});


router.post('/new',async(request,response)=>{
    try{
        console.log("Creando usuario nuevo ...");
        const usr=new Usuario(request.body);
        await usr.save();
        response.json({mensaje:'Usuario guardado con éxito...',usuario:usr.usuario});
    }
    catch(e){
        console.log("Error creando usuario nuevo ...");
        console.log(e);
        response.status(500).send("Error al crear usuario nuevo");
    }

});

router.post('/login', async(request,response)=>{
    try{
        const {refreshToken,accessToken}=await validarUsuario(request.body);
        response.json({token:accessToken});
    }
    catch(e){
        console.log("Error al intentar autenticar el usuario ...");
        console.log(e);
        response.status(401).send("Nombre de usuario o contraseña incorrectos");
    }
});


// Actualizar usuarios crUd usuarios

router.post('/update',async(request,response)=>{
    try{
        let body = request.body;
        const id_usuario=body._id;
        console.log("Actualizando usuario ...",id_usuario);
        Usuario.updateOne({ _id: body._id }, {
            $set: {
                usuario: body.usuario,
                contrasena: body.contrasena,
                nombres: body.nombres,
                rol: body.rol
            }
        }).exec();
        response.json({mensaje:'usuario actualizado con éxito...'});
    }
    catch(e){
        console.log("Error actualizando usuario ...");
        console.log(e);
        response.status(500).send("Error al actualizar usuario");
    }
});


// Eliminar usuarios cruD usuarios
router.post('/delete',async(request,response)=>{
    try{
        const nombre_usuario=request.query.usuario;
        console.log("Borrando usuario ...",nombre_usuario);
        Usuario.findOneAndDelete({usuario: nombre_usuario}).exec();
        response.json({mensaje:'Usuario eliminado con éxito...'});
    }
    catch(e){
        console.log("Error eliminando usuario...");
        console.log(e);
        response.status(500).send("Error al borrar usuario");
    }

});


router.post('/actualiza_datos_usuario',async(request,response)=>{
    try{
        let body = request.body;
        Usuario.updateOne({usuario: body.usuario }, {
            $set: {
                usuario: body.usuario,
                contrasena: body.contrasena,
                nombres: body.nombres
            }
        }).exec();
        response.json({mensaje:'usuario actualizado con éxito...'});
    }
    catch(e){
        console.log("Error actualizando usuario ...");
        console.log(e);
        response.status(500).send("Error al actualizar usuario");
    }
});


module.exports=router;
