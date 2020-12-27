module.exports = function(app) {
    const authController = require('../controllers/authController');
    const tasksController = require('../controllers/tasksController');
    const middlewares = require('../middlewares/middlewares');

    app.route('/login').post(authController.loginUser)
    app.route('/me').get(middlewares.isAuthenticated, authController.userProfile)
    app.route('/tasks').post(middlewares.isAuthenticated, tasksController.createTask)
                        .get(middlewares.isAuthenticated, tasksController.fetchTasks)
    app.route('/tasks/:id').put(middlewares.isAuthenticated, tasksController.updateTask)
                            .delete(middlewares.isAuthenticated, tasksController.deleteTask)
    app.route('/overview').get(middlewares.isAuthenticated, tasksController.fetchTasksOverView)
};