/**
 * @description Google configuration interface used for Google login
 * @author Nhut Tan
 * @since 2025-09-11
 * @version 1.0.0
 */

export interface GoogleConfig {
  /**
   * Client id of Google
   */
  clientID: string;

  /**
   * Client secret of Google
   */
  clientSecret: string;

  /**
   * Callback URL of Google
   */
  callbackURL: string;

  /**
   * Access type of Google
   */
  accessType: string;
}
