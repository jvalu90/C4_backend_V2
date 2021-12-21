const express=require('express');
const { Actividad }=require('../models/Actividad');
const router=express.Router();

router.get('/data',async(request,response)=>{
   
    const datos=await Actividad.find({},null,{
        sort:{proyecto:1}
    }).exec();
    response.json(datos);
    //response.json({mensaje:"Hola Mundo"});
});


router.get('/all',async(request,response)=>{
    const page=parseInt(request.query.page);
    const limit=parseInt(request.query.limit);

    const datos=await Actividad.find({},null,{
        sort:{descripcion:1},
        skip:((page-1)*limit),
        limit:limit
    }).exec();
    response.json(datos);
    
    //response.json({mensaje:"Hola Mundo"});

});

router.post('/new',async(request,response)=>{
    try{
        console.log("Creando nueva actividad ...");
        const usr=new Actividad(request.body);
        await usr.save();
        response.json({mensaje:'Actividad guardada con éxito...'});
    }
    catch(e){
        console.log("Error creando actividad nuevo ...");
        console.log(e);
        response.status(500).send("Error al crear actividad nueva");
    }
});


// Actualizar actividades crUd actividades

router.post('/update_lider',async(request,response)=>{
    try{
        let body = request.body;
        const id_actividad=body._id;
        
        console.log("Actualizando actividad ...",id_actividad);
        Actividad.updateOne({ _id: body._id }, {
            $set: {
                proyecto: body.proyecto,
                descripcion: body.descripcion,
                horas_planeado: body.horas_planeado,
                fecha_inicio: body.fecha_inicio
            }
        }).exec();
        response.json({mensaje:'actividad actualizada con éxito...'});
    }
    catch(e){
        console.log("Error actualizando actividad ...");
        console.log(e);
        response.status(500).send("Error al actualizar actividad");
    }
});


// Actualizar actividades crUd actividades desde el usuario subalterno

router.post('/update_subalterno',async(request,response)=>{
    try{
        let body = request.body;
        const id_actividad=body._id;
        console.log("Actualizando actividad ...",id_actividad);
        Actividad.updateOne({ _id: body._id }, {
            $set: {
                horas_ejecutado: body.horas_ejecutado,
                estado: body.estado
            }
        }).exec();
        response.json({mensaje:'actividad actualizada con éxito...'});
    }
    catch(e){
        console.log("Error actualizando actividad ...");
        console.log(e);
        response.status(500).send("Error al actualizar actividad");
    }
});





// Eliminar actividades cruD actividades
router.post('/delete',async(request,response)=>{
    try{
        let body = request.body;
        const id_actividad=body._id;
        console.log("Eliminando actividad ...",id_actividad);
        Actividad.findOneAndDelete({_id: id_actividad}).exec();
        response.json({mensaje:'actividad eliminada con éxito...'});
    }
    catch(e){
        console.log("Error eliminando actividad...");
        console.log(e);
        response.status(500).send("Error al borrar actividad");
    }

});

//************* Opciones del usuario Subalterno *************************************/
// ●	Cargar horas al desarrollo de una actividad de un proyecto.
router.post('/cargar_horas',async(request,response)=>{
    try{
        let body = request.body;
        const id_actividad=body._id;
        console.log("cargando horas de la actividad ...",id_actividad);
        Actividad.updateOne({ _id: body._id }, {
            $set: {
                horas_ejecutado: body.horas_ejecutado
            }
        }).exec();
        response.json({mensaje:'Horas de ejecución de la actividad actualizada con éxito...'});
    }
    catch(e){
        console.log("Error actualizando horas ejecutadas de la actividad ...");
        console.log(e);
        response.status(500).send("Error al cargar horas ejecutadas actividad");
    }
});

//●		Marcar actividad como iniciada/completada.
router.post('/marcar_estado',async(request,response)=>{
    try{
        let body = request.body;
        const id_actividad=body._id;
        console.log("Marcando estado de la actividad ...",id_actividad);
        Actividad.updateOne({ _id: body._id }, {
            $set: {
                estado: body.estado
            }
        }).exec();
        response.json({mensaje:'Estado de la actividad actualizado con éxito...'});
    }
    catch(e){
        console.log("Error actualizando estado de la actividad ...");
        console.log(e);
        response.status(500).send("Error al actualizar estado de la actividad");
    }
});



// Usuario Subalterno: ●	Ver actividades de un proyecto asignado
router.get('/por_proyecto',async(request,response)=>{
    const page=parseInt(request.query.page);
    const limit=parseInt(request.query.limit);
    const proyecto_asignado=request.query.proyecto;

    //const datos=await Proyecto.find().exec();
    const datos=await Actividad.find({proyecto:proyecto_asignado},null,{
        sort:{nombre:1},
        skip:((page-1)*limit),
        limit:limit
    }).exec();
    response.json(datos);

});




module.exports=router;
