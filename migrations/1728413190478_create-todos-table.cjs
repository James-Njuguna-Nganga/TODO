exports.up = async (pgm) => {
    pgm.createTable('todos', {
      id: {
        type: 'serial',
        primaryKey: true,
        notNull: true,
      },
      user_id: {
        type: 'integer',
        notNull: true,
        references: '"users"',  
        onDelete: 'CASCADE',
      },
      title: {
        type: 'varchar(255)',
        notNull: true,
      },
      description: {
        type: 'text',
        notNull: false,
      },
      completed: {
        type: 'boolean',
        default: false,
      },
      created_at: {
        type: 'timestamp',
        default: pgm.func('current_timestamp'),
      },
      updated_at: {
        type: 'timestamp',
        default: pgm.func('current_timestamp'),
      },
    });
  };
  
  exports.down = async (pgm) => {
    pgm.dropTable('todos');
  };
  