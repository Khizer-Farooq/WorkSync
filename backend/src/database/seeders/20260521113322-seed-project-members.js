'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('project_members', [
      {
        id: 1,
        project_id: 1,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 2,
        project_id: 1,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 3,
        project_id: 2,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        project_id: 3,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        project_id: 4,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('project_members', 'id'), (SELECT MAX(id) FROM project_members));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('project_members', null, {});
  },
};
