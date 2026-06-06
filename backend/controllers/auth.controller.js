const bcrypt = require("bcrypt");
const conexao = require("../database/conexao");

const cadastrarUsuario = async (req, res) => {

    const {
        nome,
        email,
        senha
    } = req.body;

    try {

        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios"
            });
        }

        if (nome.length < 3) {
            return res.status(400).json({
                message: "Nome deve possuir no mínimo 3 caracteres"
            });
        }

        const regexEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(email)) {
            return res.status(400).json({
                message: "Email inválido"
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                message: "Senha deve possuir no mínimo 8 caracteres"
            });
        }

        const [usuarioExistente] =
            await conexao.execute(
                "SELECT * FROM usuarios WHERE email = ?",
                [email]
            );

        if (usuarioExistente.length > 0) {
            return res.status(400).json({
                message: "Email já cadastrado"
            });
        }

        const senhaHash =
            await bcrypt.hash(senha, 10);

        await conexao.execute(
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha
            )
            VALUES
            (
                ?,
                ?,
                ?
            )
            `,
            [
                nome,
                email,
                senhaHash
            ]
        );

        return res.status(201).json({
            message:
                "Usuário cadastrado com sucesso!"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
                "Erro interno ao cadastrar usuário"
        });
    }
};

const login = async (req, res) => {

    const {
        email,
        senha
    } = req.body;

    try {

        if (!email || !senha) {
            return res.status(400).json({
                message:
                    "Informe email e senha"
            });
        }

        const [usuario] =
            await conexao.execute(
                "SELECT * FROM usuarios WHERE email = ?",
                [email]
            );

        if (usuario.length === 0) {

            return res.status(404).json({
                message:
                    "Usuário não encontrado"
            });
        }

        const usuarioBanco =
            usuario[0];

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuarioBanco.senha
            );

        if (!senhaValida) {

            return res.status(401).json({
                message:
                    "Senha inválida"
            });
        }

        return res.status(200).json({

            message:
                "Login realizado com sucesso!",

            tipoMensagem:
                "success",

            userData: {

                id:
                    usuarioBanco.id,

                nome:
                    usuarioBanco.nome,

                email:
                    usuarioBanco.email,

                admin:
                    Boolean(
                        usuarioBanco.admin
                    )
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
                "Erro interno ao realizar login"
        });
    }
};

module.exports = {
    cadastrarUsuario,
    login
};