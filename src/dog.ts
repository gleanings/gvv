import { Dog } from '@vvi/log';

export const dog = new Dog({
  name: 'gvv',
  type: 'error',
});

/**
 * ## 开发环境
 */
export const dun = !!dog.type;
