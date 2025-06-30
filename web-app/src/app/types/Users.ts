export interface User {
  username: string;
  isSuperuser: boolean;
  isCreateDB: boolean;
  isReplicable: boolean;
  byPassRLS: boolean;
  passwordExpire: Date;
}
