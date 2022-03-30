declare function _exports(config: any, instrumentations: any): {
    tracer: opentelemetry.Tracer;
    addTraceId: (req: any, res: any) => Promise<void>;
};
export = _exports;
import opentelemetry = require("@opentelemetry/api");
