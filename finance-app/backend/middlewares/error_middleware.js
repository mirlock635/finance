    function error_handler(err, req, res, next) {
        console.error(err); 
        // Find the mapped error response to hide sensitive info 
        const error = errorMapping[err.message] || errorMapping[err.name] || default_error;
        // Send the error response
        res.status(error.status).json({
            error: error.message,
            status: error.status
        });
    }

    const default_error={ status: 500, message: "Internal Server Error." }
    const errorMapping = {
        // Custom Errors
        "Failed to delete user account": { status: 400, message: "Failed to delete user account. Please try again." },
        "Failed reset password": { status: 400, message: "Failed to reset password. Please try again." },
        "Failed to add user": { status: 400, message: "Failed to add user. Please try again." },
        "Internal Server Error": { status: 500, message: "An internal server error occurred. Please try again later." },
        "Invalid token payload": { status: 401, message: "Unauthorized." },
        "Unauthorized: Token missing user ID": { status: 401, message: "Unauthorized." },
        "Unauthorized: invalid refresh token": { status: 401, message: "Unauthorized." },

        // Token Errors (JWT)
        "TokenExpiredError": { status: 401, message: "Your session has expired. Please log in again." },
        "JsonWebTokenError": { status: 401, message: "Invalid token. Please log in again." },
    };

module.exports=error_handler
