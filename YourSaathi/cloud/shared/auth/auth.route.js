const validator = require('./validator');
const sharedConstants = require('../common/utility/constants');
const sharedHelper = require('../common/utility/helper');
const userService = require('../user/servies/user.service');

/**
*cloud function for user registeration
*/
Parse.Cloud.define("register", async (request) => {
    request.params  =  await sharedHelper.finalDecryptedParams(request);
    return await validator.validateRegisterRequest(request) ?
        await userService.registerService(request)
        : sharedHelper.createResponse(null, sharedConstants.VALIDATION_ERROR, sharedConstants.BAD_REQUEST_CODE);
});

/**
*cloud function for user login
*/
Parse.Cloud.define("login", async (request) => {
    request.params  =  await sharedHelper.finalDecryptedParams(request);
    return await validator.validateLoginRequest(request) ?
        await userService.loginService(request)
        : sharedHelper.createResponse(null, sharedConstants.VALIDATION_ERROR, sharedConstants.BAD_REQUEST_CODE);
});

/**
*cloud function for user logout
*/
Parse.Cloud.define("logout", async (request) => {
    return await userService.logoutService(request);
});

