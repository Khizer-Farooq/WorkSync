'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('activities', [
      {
        id: 1,
        user_id: 1,
        action: 'PROJECT_CREATED',

        entity_type: 'PROJECT',

        entity_id: 1,

        metadata: JSON.stringify({
          title: 'WorkSync Backend',
        }),

        created_at: new Date(),

        updated_at: new Date(),
      },

      {
        id: 2,
        user_id: 1,

        action: 'TASK_CREATED',

        entity_type: 'TASK',

        entity_id: 1,

        metadata: JSON.stringify({
          title: 'Create Auth',
        }),

        created_at: new Date(),

        updated_at: new Date(),
      },

       {
        id: 3,
        user_id: 4,

        action: 'Clocked-In',

        entity_type: 'SHIFTS',

        entity_id: 1,

        metadata: JSON.stringify({
          title: 'Create Auth',
        }),

        created_at: new Date(),

        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('activities', 'id'), (SELECT MAX(id) FROM activities));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('activities', null, {});
  },
};
