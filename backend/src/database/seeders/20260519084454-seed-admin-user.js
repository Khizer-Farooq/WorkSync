'use strict';

const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('khizer12', 10);
    const taimoorPassword = await bcrypt.hash('taimoor12', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: ' Khizer Farooq',
        email: 'khizer@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: ' Taimoor ',
        email: 'taimoor@gmail.com',
        password: taimoorPassword,
        role: 'ADMIN',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Op.in]: ['khizer@gmail.com', 'taimoor@gmail.com'],
      },
    });
  },
};
