export interface IPermissionStrategy {
    canCreateTopic(): boolean;
    canEditTopic(): boolean;
    canDeleteTopic(): boolean;
  }
  