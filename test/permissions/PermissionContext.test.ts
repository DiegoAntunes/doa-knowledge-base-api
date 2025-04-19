import { PermissionContext } from '../../src/permissions/PermissionContext';

describe('PermissionContext', () => {
  it('should allow Admin to create, edit, and delete', () => {
    const permissions = new PermissionContext('Admin');

    expect(permissions.canCreate()).toBe(true);
    expect(permissions.canEdit()).toBe(true);
    expect(permissions.canDelete()).toBe(true);
  });

  it('should allow Editor to create and edit, but not delete', () => {
    const permissions = new PermissionContext('Editor');

    expect(permissions.canCreate()).toBe(true);
    expect(permissions.canEdit()).toBe(true);
    expect(permissions.canDelete()).toBe(false);
  });

  it('should not allow Viewer to create, edit, or delete', () => {
    const permissions = new PermissionContext('Viewer');

    expect(permissions.canCreate()).toBe(false);
    expect(permissions.canEdit()).toBe(false);
    expect(permissions.canDelete()).toBe(false);
  });

  it('should throw an error for unknown role', () => {
    expect(() => new PermissionContext('SuperUser')).toThrow('Unknown permission: SuperUser');
  });
});
