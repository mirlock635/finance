function error_handler(err, req, res, next) {
    console.error(" Error:", err );
    const statusCode = err.status || 500;   
    res.status(statusCode).json({ error: err.message || "Internal Server Error" });
}
