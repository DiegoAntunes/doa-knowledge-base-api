import { UserRole } from '../models/User';
import { IPermissionStrategy } from './IPermissionStrategy';
import { AdminPermissionStrategy } from './AdminPermissionStrategy';
import { EditorPermissionStrategy } from './EditorPermissionStrategy';
import { ViewerPermissionStrategy } from './ViewerPermissionStrategy';

export function getPermissionStrategyByRole(role: UserRole): IPermissionStrategy {
  switch (role) {
    case 'Admin':
      return new AdminPermissionStrategy();
    case 'Editor':
      return new EditorPermissionStrategy();
    case 'Viewer':
    default:
      return new ViewerPermissionStrategy();
  }
}
