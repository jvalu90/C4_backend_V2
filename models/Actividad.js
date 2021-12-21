const {Schema,model}=require('mongoose');
const actividadSchema=new Schema({
    proyecto:{
        type: String,
        max:[50,'La longitud del campo supera lo permitido (50)'],
        required:[true,'Nombre de proyecto es obligatorio']
    },
    descripcion:{
        type: String,
        max:[250,'La longitud del campo supera lo permitido (250)'],
    },
    horas_planeado:{
        type: Number
    },
    horas_ejecutado:{
        type: Number
    },
    estado:{
        type: String,
        default:'Iniciada'
    },
    fecha_inicio:{
        type: Date
    }
},{collection:'Actividades'});
exports.Actividad=model('Actividad',actividadSchema);

