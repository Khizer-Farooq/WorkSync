'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('projects', [
      {
        id: 5,
        created_by: 6,
        title: 'CaptureNow ',
        description: 'CaptureNow full stack project',
        status: 'ACTIVE',
        deadline: '2026-08-10',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 6,
        created_by: 5,
        title: 'Car Rent',
        description: 'Car Rent Nextjs frontend',
        status: 'ACTIVE',
        deadline: '2026-09-22',
        created_at: new Date(),
        updated_at: new Date(),
      },
      
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('projects', 'id'), (SELECT MAX(id) FROM projects));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('projects', null, {});
  },
};
