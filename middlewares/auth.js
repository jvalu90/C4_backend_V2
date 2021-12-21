const { verify } = require('jsonwebtoken');
exports.authGuard=(request,response,next)=>{
    console.log('Entrando a middleware auth ...');
    //console.log(request.headers);
    const authorization=request.headers.authorization;
    if(!authorization){
        console.log('No hay encabezado de Authorization ...');
        response.status(401).send('Usted no tiene permiso para acceder a esta acción');
    }
    else{
        try{
            const token = authorization.split(' ')[1];
            // La siguiente instruccion permite desencriptar el token
            const tokenData=verify(token,process.env.JWT_ACCESS_SECRET);
            request.jwtData=tokenData;
            return next();
        }
        catch(e){
            console.log('Error en Middleware de autenticación');
            console.log(e);
            response.status(401).send('Usted no tiene permiso para acceder a esta acción');
        }
    }
}

