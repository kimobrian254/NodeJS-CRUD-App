const TodoItem = require("../models").TodoItem;

let findTodoItemByTodoIdAndItemId = (todoId, todoItemId) => {
  return TodoItem.findOne({id: todoItemId, todoId })
    .then(todoItem => {
      if (!todoItem) {
        return  Promise.reject({
          status: 404,
          message: "Todo Item Not Found"
        });
      }
      return Promise.resolve(todoItem);
    }).catch(err=> {
      return  Promise.reject({
        status: 400,
        message: err
      });
    });
};

module.exports = {
  create: (req, res, next)=> {
    return TodoItem
      .create({
        content: req.body.content,
        todoId: req.params.todoId,
      })
      .then(todoItem => res.status(201).send(todoItem))
      .catch(error => next(error));
  },
  list: (req, res, next) =>{
    return TodoItem.findAll({where: { todoId: req.params.todoId }})
      .then(todoItems=> res.status(200).json(todoItems))
      .catch(err=> next(err));
  },
  find: (req, res, next) =>{
    return TodoItem.findOne({ id: req.params.id })
      .then(todoItem=> res.status(200).json(todoItem))
      .catch(err=> next(err));
  },
  update: (req, res, next) => {
    return findTodoItemByTodoIdAndItemId(req.params.todoId, req.params.itemId).then(todoItem=> {
      return todoItem
        .update(req.body, { fields: Object.keys(req.body) })
        .then((updated) => res.status(200).send(updated))  // Send back the updated todo.
        .catch((error) => next(error));
    }).catch(err=> {
      return res.status(err.status).send({
        message: err.message,
      });
    });
  },
  delete: (req, res, next) => {
    return findTodoItemByTodoIdAndItemId(req.params.todoId, req.params.itemId).then(todoItem=> {
      return todoItem
        .destroy()
        .then(() => res.status(204).send())
        .catch(error => next(error));
    }).catch(err=> {
      return res.status(err.status).send({
        message: err.message,
      });
    });
  }
};
