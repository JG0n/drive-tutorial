import DriveContents from "~/app/drive-contents";
import {
	getAllParentsForFolder,
	getFiles,
	getFolders,
} from "~/server/db/queries";

export default async function GoogleDriveClone(props: {
	params: Promise<{ folderId: string }>;
}) {
	const params = await props.params;
	const parsedFolderId = parseInt(params.folderId);
	if (isNaN(parsedFolderId)) {
		return <div>Invalid folder id </div>;
	}

	const filesPromisse = getFiles(parsedFolderId);
	const foldersPromisse = getFolders(parsedFolderId);

	const parentsPromisse = getAllParentsForFolder(parsedFolderId);

	const [folders, files, parents] = await Promise.all([
		foldersPromisse,
		filesPromisse,
		parentsPromisse,
	]);

	return <DriveContents files={files} folders={folders} parents={parents} />;
}
