import { isFalse } from 'a-type-of-js';
import { DateStore } from '../types';
import { commandParameters } from './commandParameters';
import { gitInfo } from './gitInfo';

/**
 * 数仓
 */
export const dataStore: DateStore = {
  init: false,
  _kind: 'submit',
  get kind() {
    return this._kind;
  },
  set kind(value: string) {
    this._kind = value;
    // 当 kind 为 version 时，默认打 tag
    if (value === 'version' && isFalse(this.tag)) {
      this.tag = this.commandParameters.tag = true;
    }
  },
  message: [],
  tag: false,
  gitInfo,
  commandParameters,
  pkg: {
    version: '',
    path: '',
  },
  voluntaryWIthdrawal: false,
};
