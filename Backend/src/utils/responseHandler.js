const responseHandler = (res, code, message, data = null) => {
    if (data) {
        res.status(code).json({ success: true, message, data });
    } else {
        res.status(code).json({ success: true, message });
    }
};

export { responseHandler };
