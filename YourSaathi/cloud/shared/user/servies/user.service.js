const userModel = require('../models/user.model');
const userEntity = require('../../common/entities/user');
const sharedHelper = require('../../common/utility/helper');
const sharedConstants = require('../../common/utility/constants');

exports.registerService = async (request) => {
    let responseObject;
    let userObject = new userEntity.User();
    try {
        let userRequestObj = Object.assign(userObject, request.params);
        let validateRequestData = await userModel.validatePostData(userRequestObj);
        if (!validateRequestData.error) {
            let savedUser = await userModel.save(userRequestObj);
            responseObject = savedUser ? sharedHelper.createResponse(savedUser, sharedConstants.SUCCESS, sharedConstants.SUCCESS_CODE) :
                sharedHelper.createResponse(null, sharedConstants.FAILED, sharedConstants.INTERNAL_SERVER_ERROR_CODE);
        }
        else {
            responseObject = sharedHelper.createResponse(null, validateRequestData.msg, sharedConstants.BAD_REQUEST_CODE);
        }
        return responseObject;
    }
    catch (err) {
        console.log(err.message);
        return sharedHelper.createResponse(null, err.message, sharedConstants.INTERNAL_SERVER_ERROR_CODE);
    }
}

exports.loginService = async (request) => {
    let responseObject;
    let userObject = this.getUserEntity();
    try {
        let userRequestObj = Object.assign(userObject, request.params);
        let loggedUser = await userModel.login(userRequestObj);
        responseObject = loggedUser.isLoggedIn ? sharedHelper.createResponse(loggedUser, sharedConstants.SUCCESS, sharedConstants.SUCCESS_CODE) :
            sharedHelper.createResponse(null, sharedConstants.FAILED, sharedConstants.UNAUTHORIZED_CODE);
    }
    catch (err) {
        console.log(err);
        if (err.code === 205)
            responseObject = sharedHelper.createResponse(null, sharedConstants.UNVERIFIED_EMAIL_ADDRESS, sharedConstants.UNVERIFIED_CODE);
        else
            responseObject = sharedHelper.createResponse(null, sharedConstants.INVALID_LOGIN_CREDENTIALS, sharedConstants.UNAUTHORIZED_CODE);
    }
    return responseObject;
}

exports.logoutService = async () => {
    let responseObject;
    try {
        let data = await userModel.logout();
        responseObject = data ? sharedHelper.createResponse(data, sharedConstants.SUCCESS, sharedConstants.SUCCESS_CODE) :
            sharedHelper.createResponse(null, sharedConstants.FAILED, sharedConstants.BAD_REQUEST_CODE);
        return responseObject;
    }
    catch (err) {
        console.log(err.message);
        return sharedHelper.createResponse(null, err.message, sharedConstants.INTERNAL_SERVER_ERROR_CODE);
    }
}
exports.getUserEntity = () => {
    return new userEntity.User();
}






// exports.resendVerificationMail = async (request) => {
//     let responseObject;
//     try {
//         let validateUserEmail = await userModel.validateResendVerificationEmail(request.params);
//         if (!validateUserEmail.error) {
//             let result = await userModel.resendVerificationMail(request.params);
//             responseObject = result ? await sharedHelper.createResponse(result, sharedConstants.SUCCESS, sharedConstants.SUCCESS_CODE) :
//                 await sharedHelper.createResponse(null, sharedConstants.FAILED, sharedConstants.INTERNAL_SERVER_ERROR_CODE);
//         } else {
//             responseObject = await sharedHelper.createResponse(null, validateUserEmail.msg, sharedConstants.BAD_REQUEST_CODE);
//         }
//         return responseObject;

//     } catch (error) {
//         return sharedHelper.createResponse(null, error.message, sharedConstants.INTERNAL_SERVER_ERROR_CODE);
//     }
// }



//Function to check device token
exports.checkInstallationDeviceTokenService = async (request) => {
    let {deviceToken} = request.params;
    try {
        let isExist = await userModel.isDeviceTokenExist(deviceToken);
        return sharedHelper.createResponse(isExist, sharedConstants.SUCCESS, sharedConstants.SUCCESS_CODE)
    }
    catch (err) {
        return sharedHelper.createResponse(null, err.message, sharedConstants.INTERNAL_SERVER_ERROR_CODE);
    }
}