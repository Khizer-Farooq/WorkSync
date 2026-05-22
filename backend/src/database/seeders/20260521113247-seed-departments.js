'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('departments', [
      {
        id: 1,
        name: 'Engineering',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Design',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'HR',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'SQA',
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
