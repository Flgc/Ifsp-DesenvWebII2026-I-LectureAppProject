const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ========== USER REGISTRATION (with bcrypt) ==========
app.post('/api/cadastro', async (req, res) => {
    const { email, nome, senha } = req.body;
    if (!email || !nome || !senha) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if email already exists
        const [existing] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Insert new user (non-admin by default)
        await db.execute(
            'INSERT INTO usuarios (email, nome, senha, admin) VALUES (?, ?, ?, 0)',
            [email, nome, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// ========== LOGIN ==========
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password', tipoMensagem: 'danger' });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password', tipoMensagem: 'danger' });
        }

        const userData = {
            id: user.id,
            email: user.email,
            nome: user.nome,
            admin: user.admin === 1
        };

        res.json({ message: 'Login successful', userData, tipoMensagem: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// ========== CREATE EVENT (admin only - no token check for simplicity) ==========
app.post('/api/admin', async (req, res) => {
    const { titulo, descricao, nomePalestrante, localEvento, dataEvento } = req.body;

    if (!titulo || !descricao || !nomePalestrante || !localEvento || !dataEvento) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await db.execute(
            'INSERT INTO palestra (titulo, descricao, nomePalestrante, localEvento, dataEvento) VALUES (?, ?, ?, ?, ?)',
            [titulo, descricao, nomePalestrante, localEvento, dataEvento]
        );
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

// ========== GET ALL EVENTS ==========
app.get('/api/palestras', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM palestra ORDER BY dataEvento ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// ========== SUBSCRIBE TO EVENT ==========
app.post('/api/inscricao', async (req, res) => {
    const { idUsuario, idPalestra } = req.body;

    if (!idUsuario || !idPalestra) {
        return res.status(400).json({ message: 'User ID and Event ID required' });
    }

    try {
        await db.execute(
            'INSERT INTO inscricoes (idUsuario, idPalestra) VALUES (?, ?)',
            [idUsuario, idPalestra]
        );
        res.status(201).json({ message: 'Successfully subscribed!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'You are already subscribed to this event' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error while subscribing' });
    }
});

// ========== CANCEL SUBSCRIPTION (extra feature) ==========
app.delete('/api/inscricao', async (req, res) => {
    const { idUsuario, idPalestra } = req.body;

    try {
        const [result] = await db.execute(
            'DELETE FROM inscricoes WHERE idUsuario = ? AND idPalestra = ?',
            [idUsuario, idPalestra]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cancelling subscription' });
    }
});

// ========== DELETE EVENT (admin only) ==========
app.delete('/api/admin/evento/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        // First delete all subscriptions linked to this event
        await db.execute('DELETE FROM inscricoes WHERE idPalestra = ?', [eventId]);
        // Then delete the event
        const [result] = await db.execute('DELETE FROM palestra WHERE id = ?', [eventId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event and its subscriptions deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

// ========== GET USER SUBSCRIPTIONS (extra) ==========
app.get('/api/minhas-inscricoes/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [rows] = await db.execute(
            `SELECT p.* FROM palestra p
             JOIN inscricoes i ON p.id = i.idPalestra
             WHERE i.idUsuario = ?`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user subscriptions' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});