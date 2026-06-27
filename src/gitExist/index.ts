import { gitInstalled } from './installed';
import { gitUserEmail } from './user-email';
import { gitUser } from './user-name';

/**
 * # git 的存在
 */
export async function gitExist(): Promise<void> {
  // git 是否安装
  await gitInstalled(); 

  // git 用户名
  await gitUser(); 

  // git 邮箱
  await gitUserEmail(); 
}
