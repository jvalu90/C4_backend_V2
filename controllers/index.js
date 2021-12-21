const {authGuard} = require ('../middlewares/auth'); 
const ProjectsController=require('./ProjectsController');
const UsersController=require('./UsersController');
const ActivitiesController=require('./ActivitiesController');

exports.registrarControladores=(app)=>{
    //app.use('/projects/',authGuard,ProjectsController);
    app.use('/projects/',ProjectsController);
    app.use('/users/',UsersController);
    app.use('/activities/',ActivitiesController);
}