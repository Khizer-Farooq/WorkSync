'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('task_comments', [
      {
        id: 1,
        task_id: 1,
        user_id: 2,
        comment: 'Started implementation',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 2,
        task_id: 2,
        user_id: 3,
        comment: 'Dashboard almost done',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        task_id: 3,
        user_id: 4,
        comment: 'activity almost ends today',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        task_id: 4,
        user_id: 1,
        comment: 'SETUP complete database',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('task_comments', 'id'), (SELECT MAX(id) FROM task_comments));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('task_comments', null, {});
  },
};
