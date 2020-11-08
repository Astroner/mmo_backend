import { PublicProfile, UserInterface } from './user.interface';

export const transformEntity = (item: UserInterface): PublicProfile => {
  return {
    id: item.id,
    username: item.username,
    x: item.x,
    y: item.y,
  };
};
