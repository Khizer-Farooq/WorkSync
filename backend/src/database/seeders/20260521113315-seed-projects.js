'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('projects', [
      {
        id: 1,
        created_by: 1,
        title: 'WorkSync ',
        description: 'NestJS full stack project',
        status: 'ACTIVE',
        deadline: '2026-07-10',
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: 2,
        created_by: 1,
        title: 'SMS Frontend',
        description: 'SMS Nextjs frontend',
        status: 'ACTIVE',
        deadline: '2026-07-30',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        created_by: 2,
        title: 'Mobile Frontend',
        description: 'REACT-native expo frontend',
        status: 'ARCHIVED',
        deadline: '2026-03-30',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        created_by: 3,
        title: 'Api testing',
        description: 'Nestjs all api backend testing',
        status: 'COMPLETED',
        deadline: '2026-05-20',
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
