'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 2,
        department_id: 1,
        name: 'Ali',
        email: 'ali@test.com',
        password,
        role: 'EMPLOYEE',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 3,
        department_id: 1,
        name: 'Ahmed',
        email: 'ahmed@test.com',
        password,
        role: 'EMPLOYEE',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 4,
        department_id: 2,
        name: 'Sara',
        email: 'sara@test.com',
        password,
        role: 'EMPLOYEE',
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
      role: 'EMPLOYEE',
    });
  },
};
