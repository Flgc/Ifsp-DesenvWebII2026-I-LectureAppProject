const express = require("express");

const router = express.Router();

const {
    cadastrarUsuario,
    login
} = require(
    "../controllers/auth.controller"
);

router.post(
    "/cadastro",
    cadastrarUsuario
);

router.post(
    "/login",
    login
);

module.exports = router;