"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseUtils {
    // Sucessful response
    static sendSuccess(res, message, code, data = null) {
        return res
            .status(code)
            .json({ status: "success", code, message, time: new Date(), data });
    }
    //   Error Response
    static sendError(res, message, code, error = null) {
        return res
            .status(code)
            .json({ status: "error", code, message, time: new Date(), error });
    }
}
exports.default = ResponseUtils;
//# sourceMappingURL=Response.js.map