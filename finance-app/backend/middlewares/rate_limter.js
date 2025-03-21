const rateLimit = require('express-rate-limit')

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const GENERAL_MESSAGE = "Too many requests, try again later.";

let rateLimits = {
    "/auth" : 5,    // Strict limit for signup
    "/user": 200,         // Higher limit for user actions
};

// Dynamic Rate Limiter Function 

rateLimits=Object.fromEntries( // make object out of an array
    Object.entries(rateLimits) // generate an array from rateLimits object
    .map( ([path , max]) => //replace the max by limiter in the  array
            [ path , rateLimit( {windowMs: WINDOW_MS, max, message: GENERAL_MESSAGE })]));

const Dynamic_rate_limiter = (req, res, next) => {
    let path=req.path.split('/')[1];
    if (!path) { return next(); }
    const rateLimiter = rateLimits[`/${path}`];
    if (rateLimiter) {
        return rateLimiter(req, res, next);
    }
    next(); // No rate limit for some routes
};

module.exports=Dynamic_rate_limiter