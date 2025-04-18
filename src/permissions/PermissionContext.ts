import { IPermissionStrategy } from './IPermissionStrategy';

export class PermissionContext {
  private strategy: IPermissionStrategy;

  constructor(strategy: IPermissionStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: IPermissionStrategy) {
    this.strategy = strategy;
  }

  canCreateTopic() {
    return this.strategy.canCreateTopic();
  }

  canEditTopic() {
    return this.strategy.canEditTopic();
  }

  canDeleteTopic() {
    return this.strategy.canDeleteTopic();
  }
}
