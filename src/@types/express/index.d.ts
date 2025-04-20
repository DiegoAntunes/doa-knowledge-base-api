import { User } from '../../models/User';

declare global {
  namespace Express {
    // extend interface Request do Express to include user property
    interface Request {
      user?: User;
    }
  }
}
