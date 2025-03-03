import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
	folders_table as foldersSchema,
	files_table as filesSchema,
} from "~/server/db/schema";

export async function getAllParentsForFolder(folderId: number) {
	const parents = [];
	let currentId: number | null = folderId;
	while (currentId !== null) {
		const folder = await db
			.select()
			.from(foldersSchema)
			.where(eq(foldersSchema.id, currentId));

		if (!folder[0]) {
			throw new Error("Parent folder was not found");
		}
		parents.unshift(folder[0]);
		currentId = folder[0].parent;
	}
	return parents;
}

export async function getFolders(folderId: number) {
	return db
		.select()
		.from(foldersSchema)
		.where(eq(foldersSchema.parent, folderId));
}

export async function getFiles(folderId: number) {
	return db
		.select()
		.from(filesSchema)
		.where(eq(filesSchema.parent, folderId));
}
