'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('tasks', [
      {
        id: 1,
        project_id: 1,
        status_id: 1,
        created_by: 1,
        title: 'Create Auth',
        description: 'Implement login',
        due_date: '2026-06-10',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 2,
        project_id: 1,
        status_id: 2,
        created_by: 1,
        title: 'Create Dashboard',
        description: 'Build dashboard',
        due_date: '2026-06-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        project_id: 3,
        status_id: 2,
        created_by: 1,
        title: 'Create Activity Feed',
        description: 'Build feed all stack',
        due_date: '2026-06-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        project_id: 4,
        status_id: 1,
        created_by: 2,
        title: 'Create nestjs nextjs settup',
        description: 'complete the setup of full stack nestjs nextjs project',
        due_date: '2026-06-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('tasks', 'id'), (SELECT MAX(id) FROM tasks));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {});
  },
};
