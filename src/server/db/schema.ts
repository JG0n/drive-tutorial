import "server-only";

import { bigint, index, int, singlestoreTableCreator, text } from "drizzle-orm/singlestore-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator(
	(name) => `drive_tutorial_${name}`,
);

export const files = createTable(
	"files_table",
	{
		id: bigint({ mode: "number", unsigned: true }).primaryKey().autoincrement(),
		name: text("name"),
		size: int("size"),
		url: text("url").notNull(),
		parent: bigint("parent", { mode: "number", unsigned: true }),
	}, (t) => {
		return [index("parent_index").on(t.parent)];
	},
)


export const folders = createTable(
	"folders_table",
	{
		id: bigint({ mode: "number", unsigned: true }).primaryKey().autoincrement(),
		name: text("name"),
		parent: bigint("parent", { mode: "number", unsigned: true }),
	}, (t) => {
		return [index("parent_index").on(t.parent)];
	},
)
