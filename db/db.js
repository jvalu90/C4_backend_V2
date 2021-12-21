const mongoose =require('mongoose');
const conectarAMongoDB=async()=>{
    try{
        console.log("Estableciendo conexión con MongoDB...");
        //await mongoose.connect('mongodb+srv://romerojose:romerojose8751@misiontic.tfou7.mongodb.net/DB1241Equipo4?retryWrites=true&w=majority');
        await mongoose.connect(process.env.MONGODB_URI);
        //console.log(process.env.MONGODB_URI);
        console.log("Conexión establecida con MongoDB...");
    }
    catch(e){
        console.log("Ha ocurrido un error al conectarse a MongoDB");
        console.log(e);
    }
}

const cerrarMongoDB=async()=>{
    if(mongoose.connection){
        try{
            console.log("Cerrando conexión");
            mongoose.connection.close();
            console.log("Conexión cerrada");
        }
        catch(e){
            console.log("Error al cerrar conexión");
            console.log(e);
        }
    }
}

const subscribirCerrar=async()=>{
    process.on('exit',cerrarMongoDB);
    process.on('SIGINT',cerrarMongoDB);
    process.on('SIGTERM',cerrarMongoDB);
    process.on('SIGKILL',cerrarMongoDB);
    process.on('uncaughtException',cerrarMongoDB);
}


exports.conectarAMongoDB=conectarAMongoDB;
exports.cerrarMongoDB=cerrarMongoDB;
exports.subscribirCerrar=subscribirCerrar;
