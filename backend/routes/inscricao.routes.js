const express =
require("express");

const router =
express.Router();

const {
    realizarInscricao,
    cancelarInscricao,
    listarInscricoesUsuario,
    verificarInscricao
} = require(
    "../controllers/inscricao.controller"
);

router.post(
    "/inscricao",
    realizarInscricao
);

router.delete(
    "/inscricao/:idUsuario/:idPalestra",
    cancelarInscricao
);

router.get(
    "/inscricoes/:idUsuario",
    listarInscricoesUsuario
);

router.get(
    "/inscricao/verificar/:idUsuario/:idPalestra",
    verificarInscricao
);

module.exports = router;