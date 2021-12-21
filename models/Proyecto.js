const {Schema,model}=require('mongoose');
const proyectoSchema=new Schema({
    nombre:{
        type: String,
        max:[50,'La longitud del campo supera lo permitido (50)'],
        required:[true,'El nombre es obligatorio']
    },
    descripcion:{
        type: String,
        max:[250,'La longitud del campo supera lo permitido (250)'],
    },
    usuario_asignado:{
        type: String
    },
    finalizado:{
        type: String,
        default:'NO'
    },
    fecha_inicio:{
        type: Date
    }
},{collection:'Proyectos'});
exports.Proyecto=model('Proyecto',proyectoSchema);

