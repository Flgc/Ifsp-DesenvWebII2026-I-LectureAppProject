const conexao =
require("../database/conexao");

const realizarInscricao = async (req, res) => {

    const {
        idUsuario,
        idPalestra
    } = req.body;

    try {

        if (!idUsuario || !idPalestra) {

            return res.status(400).json({
                message:
                "Dados inválidos"
            });
        }

        await conexao.execute(
            `
            INSERT INTO inscricoes
            (
                idUsuario,
                idPalestra
            )
            VALUES
            (
                ?,
                ?
            )
            `,
            [
                idUsuario,
                idPalestra
            ]
        );

        return res.status(201).json({
            message:
            "Inscrição realizada :)"
        });

    } catch (error) {

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(400).json({
                message:
                "Você já se inscreveu nesse evento!"
            });
        }

        return res.status(500).json({
            message:
            "Erro ao realizar inscrição"
        });
    }
};

const cancelarInscricao =
async (req, res) => {

    const {
        idUsuario,
        idPalestra
    } = req.params;

    try {

        const [resultado] =
            await conexao.execute(
                `
                DELETE FROM inscricoes
                WHERE
                    idUsuario = ?
                AND
                    idPalestra = ?
                `,
                [
                    idUsuario,
                    idPalestra
                ]
            );

        if (
            resultado.affectedRows === 0
        ) {
            return res.status(404).json({
                message:
                "Inscrição não encontrada"
            });
        }

        return res.status(200).json({
            message:
            "Inscrição cancelada"
        });

    } catch (error) {

        return res.status(500).json({
            message:
            "Erro ao cancelar inscrição"
        });
    }
};

const listarInscricoesUsuario =
async (req, res) => {

    const { idUsuario } =
        req.params;

    try {

        const [rows] =
            await conexao.execute(
                `
                SELECT

                    p.id,
                    p.titulo,
                    p.descricao,
                    p.nomePalestrante,
                    p.localEvento,
                    p.dataEvento

                FROM inscricoes i

                INNER JOIN palestra p
                    ON p.id = i.idPalestra

                WHERE i.idUsuario = ?
                `,
                [idUsuario]
            );

        return res.json(rows);

    } catch (error) {

        return res.status(500).json({
            message:
            "Erro ao carregar inscrições"
        });
    }
};

const verificarInscricao =
async (req, res) => {

    const {
        idUsuario,
        idPalestra
    } = req.params;

    try {

        const [rows] =
            await conexao.execute(
                `
                SELECT *
                FROM inscricoes
                WHERE
                    idUsuario = ?
                AND
                    idPalestra = ?
                `,
                [
                    idUsuario,
                    idPalestra
                ]
            );

        return res.json({
            inscrito:
                rows.length > 0
        });

    } catch (error) {

        return res.status(500).json({
            message:
            "Erro interno"
        });
    }
};

module.exports = {
    realizarInscricao,
    cancelarInscricao,
    listarInscricoesUsuario,
    verificarInscricao
};