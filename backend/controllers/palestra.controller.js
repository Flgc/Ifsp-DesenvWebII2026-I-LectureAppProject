const conexao =
require("../database/conexao");

const cadastrarEvento = async (req, res) => {

    const {
        titulo,
        descricao,
        nomePalestrante,
        localEvento,
        dataEvento
    } = req.body;

    try {

        if (
            !titulo ||
            !descricao ||
            !nomePalestrante ||
            !localEvento ||
            !dataEvento
        ) {
            return res.status(400).json({
                message:
                "Todos os campos são obrigatórios"
            });
        }

        if (titulo.length < 5) {
            return res.status(400).json({
                message:
                "Título muito curto"
            });
        }

        if (descricao.length < 20) {
            return res.status(400).json({
                message:
                "Descrição muito curta"
            });
        }

        const data =
            new Date(dataEvento);

        if (data <= new Date()) {
            return res.status(400).json({
                message:
                "A data do evento deve ser futura"
            });
        }

        await conexao.execute(
            `
            INSERT INTO palestra
            (
                titulo,
                descricao,
                nomePalestrante,
                localEvento,
                dataEvento
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                titulo,
                descricao,
                nomePalestrante,
                localEvento,
                dataEvento
            ]
        );

        return res.status(201).json({
            message:
                "Evento cadastrado com sucesso!"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
                "Erro ao cadastrar evento"
        });
    }
};

const listarEventos = async (req, res) => {

    try {

        const [rows] =
            await conexao.execute(`
                SELECT
                    p.*,
                    COUNT(i.id) totalInscritos
                FROM palestra p
                LEFT JOIN inscricoes i
                ON p.id = i.idPalestra
                GROUP BY p.id
                ORDER BY dataEvento ASC
            `);

        return res.json(rows);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
                "Erro ao buscar eventos"
        });
    }
};


/* const buscarEventoPorId = async (req,res)=>{
    
    const { id } = req.params;

    try{
        const [rows] =
        await conexao.execute(
            `
            SELECT *
            FROM palestra
            WHERE id = ?
            `,
            [id]
        );

        if(rows.length===0){
            return res.status(404).json({
                message:
                "Evento não encontrado"
            });
        }

        return res.json(
            rows[0]
        );

    }catch(error){
        return res.status(500).json({message: "Erro interno" });
    }
}; */

const editarEvento = async (req, res) => {

    const { id } = req.params;

    const {
        titulo,
        descricao,
        nomePalestrante,
        localEvento,
        dataEvento
    } = req.body;

    try {
        await conexao.execute(
            `
            UPDATE palestra
            SET
                titulo = ?,
                descricao = ?,
                nomePalestrante = ?,
                localEvento = ?,
                dataEvento = ?
            WHERE id = ?
            `,
            [
                titulo,
                descricao,
                nomePalestrante,
                localEvento,
                dataEvento,
                id
            ]
        );
        return res.status(200).json({
            message:
                "Evento atualizado com sucesso"
        });
    } catch (error) {
        return res.status(500).json({
            message:
                "Erro ao atualizar evento"
        });
    }
};

const excluirEvento = async (req, res) => {

    const { id } = req.params;

    try {

        await conexao.execute(
            `
            DELETE FROM palestra
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            message:
                "Evento removido com sucesso"
        });

    } catch (error) {

        return res.status(500).json({
            message:
                "Erro ao remover evento"
        });
    }
};

const buscarEventoPorId = async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id); // ajuste conforme seu modelo
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    cadastrarEvento,
    listarEventos,
    buscarEventoPorId,
    editarEvento,
    excluirEvento
};