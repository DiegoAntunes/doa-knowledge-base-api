import { IPermissionStrategy } from './IPermissionStrategy';
import { AdminPermissionStrategy } from './AdminPermissionStrategy';
import { EditorPermissionStrategy } from './EditorPermissionStrategy';
import { ViewerPermissionStrategy } from './ViewerPermissionStrategy';

export class PermissionContext {
  private strategy: IPermissionStrategy;

  constructor(role: string) {
    switch (role) {
      case 'Admin':
        this.strategy = new AdminPermissionStrategy();
        break;
      case 'Editor':
        this.strategy = new EditorPermissionStrategy();
        break;
      case 'Viewer':
        this.strategy = new ViewerPermissionStrategy();
        break;
      default:
        throw new Error(`Unknown permission: ${role}`);
    }
  }

  canCreate() {
    return this.strategy.canCreateTopic();
  }

  canEdit() {
    return this.strategy.canEditTopic();
  }

  canDelete() {
    return this.strategy.canDeleteTopic();
  }
}
