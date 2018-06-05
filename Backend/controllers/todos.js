const Todo = require("../models").Todo;
const TodoItem = require("../models").TodoItem;

module.exports = {
  create: (req, res, next)=> {
    return Todo
      .create({
        title: req.body.title,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => next(error));
  },
  list: (req, res, next) => {
    return Todo.findAll({
      include: [{
        model: TodoItem,
        as: "todoItems",
        attributes: ["id", "content", "complete"]
      }]
    })
      .then(todos=> res.status(200).json(todos))
      .catch(err=> next(err));
  },
  find: (req, res, next) =>{
    return Todo.findById(req.params.id, {
      include: [{
        model: TodoItem,
        as: "todoItems",
        attributes: ["id", "content", "complete"]
      }]
    })
      .then(todo=> {
        if (!todo) {
          return res.status(404).send({
            message: "Todo Not Found",
          });
        }
        return res.status(200).json(todo);
      })
      .catch(err=> next(err));
  },
  update: (req, res, next)=> {
    return Todo
      .findById(req.params.id, {
        include: [{
          model: TodoItem,
          as: "todoItems",
          attributes: ["id", "content", "complete"]
        }]
      })
      .then(todo => {
        if (!todo) {
          return res.status(404).send({
            message: "Todo Not Found",
          });
        }
        return todo
          .update(req.body, { fields: Object.keys(req.body) })
          .then((updated) => res.status(200).send(updated))  // Send back the updated todo.
          .catch((error) => next(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  destroy: (req, res, next)=> {
    return Todo
      .findById(req.params.id)
      .then(todo => {
        if (!todo) {
          return res.status(400).send({
            message: "Todo Not Found",
          });
        }
        return todo
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => next(error));
      })
      .catch(error => next(error));
  }
};
