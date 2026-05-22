'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('shifts', [
      {
        id: 1,
        user_id: 2,
        clock_in: new Date('2026-05-20 09:00'),

        clock_out: new Date('2026-05-20 17:00'),

        shift_type: 'REGULAR',

        created_at: new Date(),

        updated_at: new Date(),
      },

      {
        id: 2,
        user_id: 3,
        clock_in: new Date('2026-05-20 10:00'),

        clock_out: new Date('2026-05-20 18:00'),

        shift_type: 'REGULAR',

        created_at: new Date(),

        updated_at: new Date(),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('shifts', 'id'), (SELECT MAX(id) FROM shifts));",
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('shifts', null, {});
  },
};
