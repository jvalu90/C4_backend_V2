require('dotenv').config();
const express=require('express');
const { registrarControladores } = require('./controllers');
const { conectarAMongoDB, subscribirCerrar } = require('./db/db');
const app=express();
const port=process.env.PORT || 9000;
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
conectarAMongoDB();
registrarControladores(app);
subscribirCerrar();
app.listen(port,()=>{
    console.log(`Backend está corriendo en el puerto ${port}`);
});
