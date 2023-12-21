export interface IAdminLogDto {
  email: string;
  password: string;
}

export interface IAdminDto extends IAdminLogDto {
  name: string;
  accessKey: string;
}
