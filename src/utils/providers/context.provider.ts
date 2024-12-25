import { ClsServiceManager } from 'nestjs-cls';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authIdentifyKey = 'identify_key';

  private static readonly languageKey = 'language_key';

  private static get<T>(key: string) {
    const store = ClsServiceManager.getClsService();

    return store.get<T>(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    const store = ClsServiceManager.getClsService();

    store.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthIdentify(identify: unknown): void {
    ContextProvider.set(ContextProvider.authIdentifyKey, identify);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getAuthIdentify<T>() {
    return ContextProvider.get<T>(ContextProvider.authIdentifyKey);
  }
}
