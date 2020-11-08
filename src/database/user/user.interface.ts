export interface UserInterface {
  id: string;
  username: string;
  password: string;
}

export type PublicProfile = Omit<UserInterface, 'password'>;
