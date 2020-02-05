import * as firebase from 'firebase-admin';
export declare function apps(): apps.Apps;
export declare namespace apps {
    let singleton: apps.Apps;
    let init: () => Apps;
    interface AuthMode {
        admin: boolean;
        variable?: any;
    }
    class Apps {
        private _refCounter;
        constructor();
        _appAlive(appName: string): boolean;
        _destroyApp(appName: string): void;
        retain(): void;
        release(): Promise<void>;
        readonly admin: firebase.app.App;
        private readonly firebaseArgs;
    }
}
