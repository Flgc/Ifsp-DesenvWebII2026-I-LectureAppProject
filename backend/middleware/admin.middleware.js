const verificarAdmin = async (req, res, next) => {

    const { admin } = req.body;

    if (!admin) {
        return res.status(403).json({
            message: "Acesso permitido apenas para administradores"
        });
    }

    next();
};

module.exports = verificarAdmin;