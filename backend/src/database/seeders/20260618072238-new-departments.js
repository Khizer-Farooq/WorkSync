'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('departments', [
      {
        id: 5,
        name: 'Sales',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: 'Networking',
        created_at: new Date(),
        updated_at: new Date(),
      },
      
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('departments', 'id'), (SELECT MAX(id) FROM departments));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', null, {});
  },
};
