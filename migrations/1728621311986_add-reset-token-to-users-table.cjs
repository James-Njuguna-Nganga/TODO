exports.up = (pgm) => {
    pgm.addColumn('users', {
        reset_token: {
            type: 'varchar(255)',
            nullable: true // Set to false if you want to make it required
        }
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('users', 'reset_token');
};
