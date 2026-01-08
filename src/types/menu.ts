export interface MenuResponseDTO {
	id: number;
	parentId: number;
	menuName: string;
	perms?: string;
	orderNum?: number;
	path?: string;
	filePath?: string;
	component?: string;
	menuType: string;
	frame?: string;
	visible: string;
	status: string;
	icon?: string;
	children?: MenuResponseDTO[];
}