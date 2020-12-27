const Task = require('../models/tasks');

exports.createTask = function(req, res) {
    var task = new Task(req.body);
    task.save(function(err, createdTask) {
        if (err) {
            return res.status(400).json(err);
        }
        return res.status(201).json(createdTask);
    })
}

exports.updateTask = function(req, res) {
    var id = req.params.id
    var dataToUpdate = req.body
    Task.findByIdAndUpdate(id, dataToUpdate, {useFindAndModify: false}).then(function(task) {
        if(!task) {
            return res.status(404).json({
                message: "Task not found with id " + id
            });
        }
        return res.status(200).send(task);
    }).catch(function(err) {
        if(err.kind === 'ObjectId') {
            return res.status(400).send({
                message: "Task not found with id " + id
            });
        }
    })
}

exports.deleteTask = function(req, res) {
    var id = req.params.id;
    Task.findByIdAndRemove(id, {useFindAndModify: false}).then(function(task) {
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + id
          });
        }
        return res.status(204).send({message: "task deleted successfully!"});
    }).catch(function(err) {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + id
            });
        }
    })
}
exports.fetchTasks = function(req, res) {
    console.log(req.query);
    var params = {};
    if(req.query.searchTerm && req.query.searchTerm.length) {
        params = {"name" : {$regex : `.*${req.query.searchTerm}.*`}}
    }
    Task.find(params, {name: 1, is_completed: 1, _id: 1}).sort({ created_at:-1 }).then(function(tasks) {
        return res.status(200).json(tasks);
    }).catch(function(err) {
        return res.status(500).json({
            'message': 'Error occured while fetching tasks..'
        });
    })
}

exports.fetchTasksOverView = async function(req, res) {
    var tasksOverview = await Task.aggregate([
        {
            "$group": { 
                "_id" : 1,
                "complete": {"$sum": {"$cond": ["$is_completed", 1, 0]}},
                "incomplete": {"$sum": {"$cond": ["$is_completed", 0, 1]}},
                "total": {"$sum": 1}
            }
        }, 
        {
            "$project": {"_id":0}
        }
    ]).then(function(values) {
        return values[0]
    })
    var latestTasks = await Task.find({}, {name: 1, is_completed: 1}).sort({ updated_at:-1 }).limit(3).then(function(tasks) {
        return tasks;
    }).catch(function(err) {
        return [];
    })
    tasksOverview.latestTasks = latestTasks || [];
    return res.status(200).json(tasksOverview);
}