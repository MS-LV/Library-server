export interface IUserLoginDto {
  password: string;
  email: string;
}

export interface IUserDto extends IUserLoginDto {
  name: string;
}

export interface IUserResponse {
  token: string;
  userInfo: IUserDto | IUserLoginDto;
}
