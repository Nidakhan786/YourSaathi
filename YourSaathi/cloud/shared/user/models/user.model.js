const sharedHelper = require('../../common/utility/helper');
const fieldMapper = require('../../common/utility/fieldMapper').Fields;
const constants = require('../helpers/constants');
const sharedConstants = require('../../common/utility/constants');
const userEntity = require('../../common/entities/user');

/**
 * Check if session token is valid i.e. not expired
 * @param {String} sessionToken sessionToken of user
 * @return {Boolean}
 */
const isAuthToken = async (sessionToken) => {
    sessionToken = sessionToken || "";
    let isAuth = false;
    try {
        Parse.User.enableUnsafeCurrentUser();
        let user = await Parse.User.become(sessionToken);
        if (user.id)
            isAuth = true;
    }
    catch (err) {
        console.log("err ", err);
    }
    return isAuth;
}

/**
 * Validate form data of user Signup
 * @param {Object} params parameters of user save
 */
const validatePostData = async (params) => {
    if (params.email) {
        let email = params.email.replace(/\s+/g, '');
        let isUserExist = await getUser(email);
        if (isUserExist)
            return { error: true, msg: constants.USER_ALREADY_EXISTS }
    }
    return { error: false, msg: null }
}


/**
 * user Login
 * @param {Object} params parameters of user save
 * @return {Object} user
 */
const login = async (params) => {
    const data = { isLoggedIn: false };
    const { email, password ,deviceToken } = params;
    try {
        await Parse.User.enableUnsafeCurrentUser();
        const user = await Parse.User.logIn(email, password);
        user.set( 'isActive' , true );
        await user.save()
        if (user) {
            let email = user.get(fieldMapper.email);
            data.token = user.get(fieldMapper.sessionToken)
            data.email = email;
            data.emailVerified = user.get('emailVerified')
            data.isLoggedIn = true;
            data.userId = user.id;
        }
    }
    catch (err) {
        throw err;
    }
    return data;
}

/**
 * User Logout
 */
const logout = async () => {
    let isLogout = false;
    try {
        await Parse.User.logOut();
        isLogout = true;
    }
    catch (err) {
        throw err;
    }
    return isLogout;
}









/**
 * Validate device token
 * @param {String} deviceToken 
 * @return{Boolean}
 */
const isDeviceTokenExist = async (deviceToken) => {
    try {
        let isExist = false;
        let query = new Parse.Query(Parse.Installation);
        query.equalTo("deviceToken", deviceToken);
        let result = await query.first({ useMasterKey: true });
        if (result)
        isExist = true;
        return isExist;
    }
    catch (err) {
        console.error(err);
        throw (err)
    }
}


module.exports = {
    

    isAuthToken,
    login,
    logout,  
    isDeviceTokenExist
}
