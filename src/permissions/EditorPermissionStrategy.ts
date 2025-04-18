import { IPermissionStrategy } from './IPermissionStrategy';

export class EditorPermissionStrategy implements IPermissionStrategy {
  canCreateTopic(): boolean {
    return true;
  }

  canEditTopic(): boolean {
    return true;
  }

  canDeleteTopic(): boolean {
    return false;
  }
}
