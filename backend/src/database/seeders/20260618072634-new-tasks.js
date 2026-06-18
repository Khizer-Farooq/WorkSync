'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('tasks', [
      {
        id: 5,
        project_id: 6,
        status_id: 2,
        created_by: 6,
        title: 'Rent Car Setup',
        description: 'Implement Setup Of Rent Car',
        due_date: '2026-06-10',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 6,
        project_id: 6,
        status_id: 2,
        created_by: 1,
        title: ' Dashboard layout',
        description: 'Build dashboard',
        due_date: '2026-07-15',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        project_id: 5,
        status_id: 2,
        created_by: 1,
        title: 'Create Activity Feed CaptureNow',
        description: 'Build feed all frontend',
        due_date: '2026-06-25',
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
