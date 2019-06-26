const express = require("express");

const server = express();
let reqs = 0;
server.use(express.json());

const projects = [];

//middleware para verificar se o req.param id existe
function checkProjectExists(req, res, next) {
  const project = projects[req.params.id];
  if (!project) {
    return res
      .status(400)
      .json({ error: "usuário inexistente na base de dados" });
  }

  return next();
}

//verificador de quantas requisições foram feitas
function checkReqSystem(req, res, next) {
  next();

  if (res.status(200)) {
    reqs += 1;
    console.log("numero de requisicoes : " + reqs);
  }
}

// criando um novo projeto
server.post("/projects", checkReqSystem, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const project = {};

  project.id = id;
  project.title = title;

  projects.push(project);
  return res.json(projects);
});

//criando uma nova task para o projeto
server.post(
  "/projects/:id/tasks",
  checkReqSystem,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { tasks } = req.body;
    projects[id].tasks = [];
    projects[id].tasks.push(tasks);

    return res.json(projects);
  }
);

//listando todas os projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//listando um projeto de id especifico
server.put("/projects/:id", checkReqSystem, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;

  return res.json(projects);
});

//deletando um projeto de id especifico
server.delete(
  "/projects/:id",
  checkReqSystem,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;

    projects.splice(id, 1);

    return res.json(projects);
  }
);
server.listen(3000);
