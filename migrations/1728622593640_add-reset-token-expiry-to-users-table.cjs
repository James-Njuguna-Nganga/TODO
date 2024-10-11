exports.up = (pgm) => {
    pgm.addColumn('users', {
        reset_token_expiry: {
            type: 'timestamp',
            nullable: true 
        }
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('users', 'reset_token_expiry');
};
