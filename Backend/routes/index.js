const todosController = require("../controllers").todos;
const todosItemsController = require("../controllers").todoItems;

module.exports = (router) => {
  router.get("/", (req, res) => res.status(200).send({
    message: "Welcome to the Todos API!",
  }));

  router.route("/todos")
    .post(todosController.create) 
    .get(todosController.list);

  router.route("/todos/:todoId/items")
    .post(todosItemsController.create)
    .get(todosItemsController.list);
  
  router.route("/todos/:todoId/items/:itemId")
    .put(todosItemsController.update)
    .delete(todosItemsController.delete);

  router.route("/todoItems/:id")
    .get(todosItemsController.find);

  router.route("/todos/:id")
    .get(todosController.find)
    .put(todosController.update)
    .delete(todosController.destroy);

  router.route("/todos/:todoId/items")
    .all(((req, res)=> res.status(405).send({ message: "Method Not Allowed" })));

  router.route("/todos")
    .all(((req, res)=> res.status(405).send({ message: "Method Not Allowed" })));
};
