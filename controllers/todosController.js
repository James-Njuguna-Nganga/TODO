import { pool } from '../config/database.js';

export const createTodo = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId; 

    try {
        const existsResult = await pool.query('SELECT check_todo_exists($1)', [title]);
        if (existsResult.rows[0].check_todo_exists) {
            return res.status(400).json({ success: false, message: 'TODO already exists' });
        }

    await pool.query('CALL create_todo($1, $2, $3)', [title, description, userId]);

        res.status(201).json({ success: true, message: 'TODO created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        await pool.query('UPDATE todos SET title = $1, description = $2 WHERE id = $3', [title, description, id]);
        res.status(200).json({ success: true, message: 'TODO updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const softDeleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('UPDATE todos SET deleted_at = current_timestamp WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: 'TODO soft deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const fetchTodos = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const todos = await pool.query(
            'SELECT * FROM todos WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, (page - 1) * limit]
        );
        res.status(200).json({ success: true, data: todos.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
