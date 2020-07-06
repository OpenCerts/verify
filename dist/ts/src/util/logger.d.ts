import debug from "debug";
export declare const trace: (namespace: string) => debug.Debugger;
export declare const info: (namespace: string) => debug.Debugger;
export declare const error: (namespace: string) => debug.Debugger;
export declare const getLogger: (namespace: string) => {
    trace: debug.Debugger;
    info: debug.Debugger;
    error: debug.Debugger;
};
