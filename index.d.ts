declare function _exports(config?: {}): {
    tracer: import("@opentelemetry/api").Tracer;
    addTraceId: (req: any, res: any) => Promise<void>;
};
export = _exports;
