import "server-only";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
	folders_table as foldersSchema,
	files_table as filesSchema,
} from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export const QUERIES = {
	getAllParentsForFolder: async function (folderId: number) {
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
	},

	getFolders: async function (folderId: number) {
		return db
			.select()
			.from(foldersSchema)
			.where(eq(foldersSchema.parent, folderId));
	},

	getFiles: async function (folderId: number) {
		return db
			.select()
			.from(filesSchema)
			.where(eq(filesSchema.parent, folderId));
	},
};

export const MUTATIONS = {
	createFile: async function (input: {
		file: {
			name: string;
			size: number;
			url: string;
		};
		userId: string;
	}) {
		return await db
			.insert(filesSchema)
			.values({ ...input.file, parent: 1 });
	},
};
