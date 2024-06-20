const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error.name === "CastError") {
                error.statusCode = 400;
                error.message = "Invalid ID format";
            }
            next(error);
        }
    };
};

export { asyncHandler };
