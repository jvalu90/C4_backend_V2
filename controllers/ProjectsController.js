const express=require('express');
const { Proyecto }=require('../models/Proyecto');
const { Actividad }=require('../models/Actividad');
const router=express.Router();

// Consultar proyectos cRud Proyectos

router.get('/data',async(request,response)=>{
   
    const datos=await Proyecto.find({},null,{
        sort:{nombre:1}
    }).exec();
    response.json(datos);
    //response.json({mensaje:"Hola Mundo"});
});


router.get('/all',async(request,response)=>{
    const page=parseInt(request.query.page);
    const limit=parseInt(request.query.limit);

    //const datos=await Proyecto.find().exec();
    const datos=await Proyecto.find({},null,{
        sort:{nombre:1},
        skip:((page-1)*limit),
        limit:limit
    }).exec();
    response.json(datos);
    
    //response.json({mensaje:"Hola Mundo"});
});

// Crear proyectos Crud Proyectos
router.post('/new',async(request,response)=>{
    try{
        console.log("Creando nuevo proyecto ...");
        const usr=new Proyecto(request.body);
        await usr.save();
        response.json({mensaje:'Proyecto creado con éxito...'});
    }
    catch(e){
        console.log("Error creando proyecto nuevo ...");
        console.log(e);
        response.status(500).send("Error al crear proyecto nuevo");
    }
});

// Actualizar proyectos crUd proyectos

router.post('/update',async(request,response)=>{
    try{
        let body = request.body;
        const id_proyecto=body._id;
        console.log("Actualizando proyecto ...",id_proyecto);
        Proyecto.updateOne({ _id: body._id }, {
            $set: {
                nombre: body.nombre,
                descripcion: body.descripcion,
                usuario_asignado: body.usuario_asignado,
                finalizado: body.finalizado,
                fecha_inicio: body.fecha_inicio
            }
        }).exec();
        response.json({mensaje:'Proyecto actualizado con éxito...'});
    }
    catch(e){
        console.log("Error actualizando proyecto ...");
        console.log(e);
        response.status(500).send("Error al actualizar proyecto");
    }
});


// Eliminar proyectos cruD proyectos
router.post('/delete',async(request,response)=>{
    try{
        const nombre_proyecto=request.query.nombre;
        console.log("Borrando proyecto ...",nombre_proyecto);
        Proyecto.findOneAndDelete({nombre: nombre_proyecto}).exec();
        response.json({mensaje:'Proyecto eliminado con éxito...'});
    }
    catch(e){
        console.log("Error eliminando proyecto...");
        console.log(e);
        response.status(500).send("Error al borrar proyecto");
    }

});

// Usuario Lider: Consulta Proyectos terminados

router.get('/terminados',async(request,response)=>{
    const page=parseInt(request.query.page);
    const limit=parseInt(request.query.limit);

    //const datos=await Proyecto.find().exec();
    const datos=await Proyecto.find({finalizado:'Si'},null,{
        sort:{nombre:1},
        skip:((page-1)*limit),
        limit:limit
    }).exec();
    response.json(datos);
    
    //response.json({mensaje:"Hola Mundo"});
});


// Usuario Lider: Consulta Proyectos inicados

router.get('/iniciados',async(request,response)=>{
    const page=parseInt(request.query.page);
    const limit=parseInt(request.query.limit);

    //const datos=await Proyecto.find().exec();
    const datos=await Proyecto.find({finalizado:'No'},null,{
        sort:{nombre:1},
        skip:((page-1)*limit),
        limit:limit
    }).exec();
    response.json(datos);
    
    //response.json({mensaje:"Hola Mundo"});
});

// Usuario Lider

// Combinar colecciones proyectos y actividades 
router.get('/info_actividades',async(request,response)=>{
    //const datos=await Proyecto.find().exec();
    console.log("generando reporte combinado");
    try{
        const datos=await Actividad.aggregate(
            [
            {
                $lookup:
                {
                    from:"Proyectos", //exports.Proyecto=model('Proyecto',proyectoSchema);
                    localField:"proyecto", // campo en la tabla proyectos
                    foreignField:"nombre", // campo en la tabla actividades
                    as: "ProyectoActividad" //Alias
                }
            },
            
            {
                $replaceRoot:{newRoot:{$mergeObjects:[{$arrayElemAt:['$ProyectoActividad',0]},"$$ROOT"]}}
            },
            { $unwind:"$ProyectoActividad" }  
        ]);
        response.json(datos);
        console.log(datos);
        console.log("reporte generado exitosamente");
    }
    catch(e){
        console.log("error al generar reporte");
        console.log(e);
    }
       
    //response.json({mensaje:"Hola Mundo"});
});


//	Horas por proyecto.
//■	Sumatoria de horas definidas dentro de las actividades.
//■	Sumatoria de horas reportadas por los empleados.

router.get('/horas_por_proyecto',async(request,response)=>{
    //const datos=await Proyecto.find().exec();
    console.log("generando reporte combinado");
    try{
        const datos=await Actividad.aggregate(
            [
            {
                $lookup:
                {
                    from:"Proyectos", //exports.Proyecto=model('Proyecto',proyectoSchema);
                    localField:"proyecto", // campo en la tabla proyectos
                    foreignField:"nombre", // campo en la tabla actividades
                    as: "ProyectoActividad" //Alias
                }
            },
            
            {
                $replaceRoot:{newRoot:{$mergeObjects:[{$arrayElemAt:['$ProyectoActividad',0]},"$$ROOT"]}}
            },
            { 
                $unwind:"$ProyectoActividad" 
            },

            { 
                $project:{
                proyecto:1,
                horas_planeado:1,
                horas_ejecutado:1
                }
            },

            {$group:{_id:'$proyecto',total_horas_planeado:{$sum:'$horas_planeado'},total_horas_ejecutado:{$sum:'$horas_ejecutado'}}}
 
        ]);
        response.json(datos);
        console.log(datos);
        console.log("reporte generado exitosamente");
    }
    catch(e){
        console.log("error al generar reporte");
        console.log(e);
    }
       
    //response.json({mensaje:"Hola Mundo"});
});


//	Horas por proyecto y empleado.
//■	Sumatoria de horas definidas dentro de las actividades.
//■	Sumatoria de horas reportadas por los empleados.

router.get('/horas_por_proyecto_empleado',async(request,response)=>{
    //const datos=await Proyecto.find().exec();
    console.log("generando reporte combinado");
    try{
        const datos=await Actividad.aggregate(
            [
            {
                $lookup:
                {
                    from:"Proyectos", //exports.Proyecto=model('Proyecto',proyectoSchema);
                    localField:"proyecto", // campo en la tabla proyectos
                    foreignField:"nombre", // campo en la tabla actividades
                    as: "ProyectoActividad" //Alias
                }

                
            },
            
            {
                $replaceRoot:{newRoot:{$mergeObjects:[{$arrayElemAt:['$ProyectoActividad',0]},"$$ROOT"]}}
            },
            { 
                $unwind:"$ProyectoActividad" 
            },

            { 
                $project:{
                proyecto:1,
                usuario_asignado:1,
                horas_planeado:1,
                horas_ejecutado:1
                }
            },

           {$group:{_id:{proyecto:'$proyecto', usuario_asignado:'$usuario_asignado'},total_horas_planeado:{$sum:'$horas_planeado'},total_horas_ejecutado:{$sum:'$horas_ejecutado'}}}
 
        ]);
        response.json(datos);
        //console.log(datos);
        console.log("reporte generado exitosamente");
    }
    catch(e){
        console.log("error al generar reporte");
        console.log(e);
    }
       
    //response.json({mensaje:"Hola Mundo"});
});




// Usuario Subalterno: Consulta de Proyectos asignados a un usuario Subalterno

router.get('/asignados',async(request,response)=>{
    const usuario=request.query.usuario;
    //const datos=await Proyecto.find().exec();
    const datos=await Proyecto.find({usuario_asignado:usuario},null,{}).exec();
    response.json(datos);

});



// usuario subalterno
// Reporte de Actividades asignadas al usuario subalterno 
router.get('/info_actividades_asignadas',async(request,response)=>{
    //const datos=await Proyecto.find().exec();
    console.log("generando reporte combinado");
    try{
        const datos=await Actividad.aggregate(
            [
            {
                $lookup:
                {
                    from:"Proyectos", //exports.Proyecto=model('Proyecto',proyectoSchema);
                    localField:"proyecto", // campo en la tabla proyectos
                    foreignField:"nombre", // campo en la tabla actividades
                    as: "ProyectoActividad" //Alias
                }
            },
            
            {
                $replaceRoot:{newRoot:{$mergeObjects:[{$arrayElemAt:['$ProyectoActividad',0]},"$$ROOT"]}}
            },
            { $unwind:"$ProyectoActividad" }  
        ]);
        let datos_filtrado = datos.filter(e => e.usuario_asignado == request.query.usuario)
        response.json(datos_filtrado);
        console.log(datos_filtrado);
        console.log("reporte generado exitosamente");
    }
    catch(e){
        console.log("error al generar reporte");
        console.log(e);
    }
       
    //response.json({mensaje:"Hola Mundo"});
});

module.exports=router;
