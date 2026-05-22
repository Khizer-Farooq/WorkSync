'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('task_statuses', [
      {
        id: 1,
        name: 'TODO',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'IN_PROGRESS',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'COMPLETED',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('task_statuses', 'id'), (SELECT MAX(id) FROM task_statuses));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('task_statuses', null, {});
  },
};
