import { IPermissionStrategy } from './IPermissionStrategy';

export class AdminPermissionStrategy implements IPermissionStrategy {
  canCreateTopic(): boolean {
    return true;
  }

  canEditTopic(): boolean {
    return true;
  }

  canDeleteTopic(): boolean {
    return true;
  }
}
