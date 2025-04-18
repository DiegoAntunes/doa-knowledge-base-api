import { IPermissionStrategy } from './IPermissionStrategy';

export class ViewerPermissionStrategy implements IPermissionStrategy {
  canCreateTopic(): boolean { return false; }
  canEditTopic(): boolean { return false; }
  canDeleteTopic(): boolean { return false; }
}
