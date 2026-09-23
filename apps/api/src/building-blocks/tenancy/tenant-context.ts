import { AsyncLocalStorage } from "node:async_hooks";

export interface Principal {
  readonly userId: string;
  readonly tenantId: string;
  readonly sessionId: string;
  readonly permissions: ReadonlySet<string>;
  readonly isTenantOwner: boolean;
}

const storage = new AsyncLocalStorage<Principal>();

export const tenantContext = {
  run: <T>(principal: Principal, callback: () => T): T => storage.run(principal, callback),
  enter: (principal: Principal): void => { storage.enterWith(principal); },
  get: (): Principal | undefined => storage.getStore(),
  require: (): Principal => {
    const value = storage.getStore();
    if (!value) throw new Error("Trusted tenant context is required");
    return value;
  },
};
