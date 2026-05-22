'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('task_assignments', [
      {
        id: 1,
        task_id: 1,
        user_id: 2,
        assigned_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 2,
        task_id: 2,
        user_id: 3,
        assigned_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        task_id: 3,
        user_id: 4,
        assigned_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        task_id: 2,
        user_id: 4,
        assigned_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('task_assignments', 'id'), (SELECT MAX(id) FROM task_assignments));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('task_assignments', null, {});
  },
};
