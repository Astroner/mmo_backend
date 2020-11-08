export interface UserInterface {
  id: string;
  username: string;
  password: string;
  x: number;
  y: number;
}

export type PublicProfile = Omit<UserInterface, 'password'>;
