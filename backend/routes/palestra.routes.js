const express =
require("express");

const router =
express.Router();

const verificarAdmin =
require("../middleware/admin.middleware");

const {
    cadastrarEvento,
    listarEventos,
    editarEvento,
    excluirEvento,
    buscarEventoPorId 
} = require(
    "../controllers/palestra.controller"
);

router.post(
    "/admin",
    verificarAdmin,
    cadastrarEvento
);

router.get(
    "/palestras",
    listarEventos
);

router.put(
    "/eventos/:id",
    verificarAdmin,
    editarEvento
);

router.delete(
    "/eventos/:id",
    verificarAdmin,
    excluirEvento
);

router.get(
    "/eventos/:id",
    buscarEventoPorId
);

module.exports = router;