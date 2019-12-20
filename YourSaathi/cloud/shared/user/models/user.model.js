const sharedHelper = require('../../common/utility/helper');
const fieldMapper = require('../../common/utility/fieldMapper').Fields;
const constants = require('../helpers/constants');
const sharedConstants = require('../../common/utility/constants');
const userEntity = require('../../common/entities/user');


class SearchUser {
    constructor(birthDate, username, name, gender, mobileNumber, email, profileImage, userObjectId, isFollower) {
        this.birthDate = birthDate;
        this.username = username;
        this.name = name;
        this.gender = gender;
        this.mobileNumber = mobileNumber;
        this.email = email;
        this.profileImage = profileImage;
        this.userObjectId = userObjectId;
        this.isFollower = isFollower;
    }
}

/**
 * Get User by Email Address
 * @param {String} email email address of user
 * @return {Object}
 */
const getUser = async (email) => {
    let userData, user = null;
    user = await sharedHelper.getDataByField(Parse.User, fieldMapper.username, email);
    if (user)
        userData = user;
    else
        userData = await sharedHelper.getDataByField(Parse.User, fieldMapper.email, email);
    return userData;
}
/**
 * Get User by ObjectId
 * @param {String} objectId id of user
 * @return {Object}
 */
const getUserById = async (userId) => {
    let userData = new Parse.Query(Parse.User);
    userData.equalTo(fieldMapper.objectId, userId);
    let user = await userData.first({ useMasterKey: true });
    return user;
}

/**
 *  GET USER GROUPS
 * @param {String} emailAddress
 * @returns {String} user role id
 */
const getUserRoleByEmail = async (emailAddress) => {
    let groupName;
    let { userEmailPattern, supllierEmailPattern,
        externalEmailPattern, internalGroupName, externalGroupName, otherGroupName
    } = fieldMapper;
    let beforeAtEmailString = emailAddress.split("@")[0];

    if (emailAddress.includes(userEmailPattern) && (beforeAtEmailString.includes(supllierEmailPattern) || beforeAtEmailString.includes(externalEmailPattern)))
        groupName = externalGroupName;
    else if (emailAddress.includes(userEmailPattern))
        groupName = internalGroupName;
    else
        groupName = otherGroupName;
    let group = await sharedHelper.getDataByField(Parse.Role, fieldMapper.name, groupName);
    return group.id;
}

/**
 *
 * @param {String} imageData
 * @return {String}  saved image data
 */
const saveProfileImage = async (imageData) => {
    return await sharedHelper.saveBase64Image(imageData);
}

/**
 * Get user role id by email
 * @param {String} email email address of user
 * @return {String}
 */
const getUserGroupCode = async (email) => {
    let userData = new Parse.Query(Parse.User);
    userData.equalTo(fieldMapper.email, email);
    userData.include(fieldMapper.userRoleObjectId);
    let user = await userData.first();
    return user.get(fieldMapper.userRoleObjectId).get(fieldMapper.code);
}

/**
 * Get formatted User object
 * @param {Object} user user object
 * @return {Object} userObject
 */
const getUserObject = async (user) => {
    let userObject = {};
    let userImage = await user.get(fieldMapper.profileImage);
    userObject.username = sharedHelper.getFieldValue(user, fieldMapper.username);
    userObject.email = sharedHelper.getFieldValue(user, fieldMapper.email);
    userObject.password = null;
    userObject.profileImage = userImage ? userImage.url() : null;
    userObject.userObjectId = user.id ? user.id : null;
    userObject.name = sharedHelper.getFieldValue(user, fieldMapper.name);
    userObject.birthDate = sharedHelper.getFieldValue(user, fieldMapper.birthDate);
    userObject.gender = sharedHelper.getFieldValue(user, fieldMapper.gender);
    userObject.mobileNumber = sharedHelper.getFieldValue(user, fieldMapper.mobileNumber);
    return userObject;
}

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
 * Validate form data of Profile request
 * @param {Object} params parameters of user save
 */
const validateData = async (params) => {
    let isValidEmail, isValidUserId = false;
    if (params.email) {
        let email = params.email.replace(/\s+/g, '');
        let isUserExist = await getUser(email);
        if (isUserExist)
            isValidEmail = true;
    }
    if (params.userId) {
        let isUserExist = await getUserById(params.userId);
        if (isUserExist)
            isValidUserId = true;
    }
    return { isValidEmail: isValidEmail, isValidUserId: isValidUserId };
}

/**
 * Validate form data of user search request
 * @param {Object} params parameters of user search service
 */
const validateSearchUserData = async (params) => {
    let { searchKey, userId, token } = params;
    try {

        //check for the users session existance
        if (!await isAuthToken(token)) {
            return { error: true, msg: constants.INVALID_SESSION };
        } else {
            if (!!searchKey && !!userId) {
                return { error: false, msg: null };
            }
            return { error: true, msg: constants.VALIDATION_ERROR }
        }


    }
    catch (err) {
        throw err;
    }
}

/**
 * SAVE USER
 * @param{Object} all fields of user
 * @return {Object} user
 */
const save = async (data) => {
    let isRegistered = false;
    let user = new Parse.User();
    let { name, email, password, profileImage, birthDate, gender, mobileNumber } = data;
    email = email.replace(/\s+/g, '');
    try {
        let userRoleObjectId = await getUserRoleByEmail(email);
        user.set(fieldMapper.username, email);
        user.set(fieldMapper.name, name);
        user.set(fieldMapper.password, password);
        user.set(fieldMapper.email, email);
        user.set(fieldMapper.gender, gender);
        user.set(fieldMapper.mobileNumber, parseInt(mobileNumber));
        if (birthDate instanceof Date)
            user.set(fieldMapper.birthDate, birthDate);
        if (userRoleObjectId)
            user.set(fieldMapper.userRoleObjectId, { className: fieldMapper.roleClassName, __type: 'Pointer', objectId: userRoleObjectId });
        if (profileImage) {
            //Save profile image i.e. base64 String
            let profileImageName = await saveProfileImage(profileImage);
            user.set(fieldMapper.profileImage, profileImageName);
        }
        let NewUser = await user.signUp();
        if (NewUser)
            isRegistered = true;
        return isRegistered;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
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
            data.userType = await getUserGroupCode(email);
            if(deviceToken)
                await saveUserForPushNotification(user.id,deviceToken);
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
    getUserRoleByEmail,
    login,
    logout,  
    isDeviceTokenExist
}