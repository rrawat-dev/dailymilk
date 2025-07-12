import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable('customers', {
  mobile: text('mobile').notNull(),
  name: text('name').notNull(),
  photo: blob('photo')
});

export const calendar = sqliteTable('calendar', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerId: integer('customerId'),
  year: text(),
  month: text(),
  day01: text(),
  day02: text(),
  day03: text(),
  day04: text(),
  day05: text(),
  day06: text(),
  day07: text(),
  day08: text(),
  day09: text(),
  day10: text(),
  day11: text(),
  day12: text(),
  day13: text(),
  day14: text(),
  day15: text(),
  day16: text(),
  day17: text(),
  day18: text(),
  day19: text(),
  day20: text(),
  day21: text(),
  day22: text(),
  day23: text(),
  day24: text(),
  day25: text(),
  day26: text(),
  day27: text(),
  day28: text(),
  day29: text(),
  day30: text(),
  day31: text(),
  status: text()
});

// Export Task to use as an interface in your app
export type Customer = typeof customers.$inferSelect;