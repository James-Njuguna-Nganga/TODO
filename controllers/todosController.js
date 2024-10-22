import { pool } from '../config/database.js';
import { redisClient } from '../config/redisClient.js';


export const createTodo = async (req, res, next) => {
  const { title, description } = req.body;
  const userId = req.userId;

  const { rows } = await pool.query('SELECT check_todo_exists($1)', [title]);
  if (rows[0].check_todo_exists) {
    return next({ 
        statusCode: 400, 
        message: 'TODO already exists' 
    });
  }

  await pool.query('CALL create_todo($1, $2, $3)', [title, description, userId]);
  return res.status(201).json({ success: true, message: 'TODO created successfully' });
};

export const updateTodo = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const result = await pool.query('UPDATE todos SET title = $1, description = $2 WHERE id = $3', [title, description, id]);
  if (result.rowCount === 0) {
    return next({ 
        statusCode: 404, 
        message: 'TODO not found' 
    });
  }

  return res.status(200).json({ 
    success: true, 
    message: 'TODO updated successfully' 
});
};

export const softDeleteTodo = async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query('UPDATE todos SET deleted_at = current_timestamp WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    return next({ 
        statusCode: 404, 
        message: 'TODO not found' 
    });
  }

  return res.status(200).json({ 
    success: true, 
    message: 'TODO soft deleted successfully' });
};


export const fetchTodos = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const cacheKey = `todos:page:${page}:limit:${limit}`;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({ 
                success: true, 
                data: JSON.parse(cachedData) 
            });
        }

        const { rows } = await pool.query(
            'SELECT * FROM todos WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, (page - 1) * limit]
        );

        await redisClient.set(cacheKey, JSON.stringify(rows), {
            EX: 3600, 
        });

        return res.status(200).json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        return next({ 
            statusCode: 500, 
            message: 'Failed to fetch TODOs' 
        });
    }
};

  
