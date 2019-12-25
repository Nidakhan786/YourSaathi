const userEntity = require('../common/entities/user');
const sharedHelper = require('../common/utility/helper');

exports.validateRegisterRequest = async(request) =>{
    const user = new userEntity.User();
    let isvalidRequest = false;
    const requestedFieldArr = Object.keys(request.params);
    //All valid props array of User Class
    let realFields  = Object.keys(user);
    //Check if all params are availble in  valid prop list of User
    let isSubset = await sharedHelper.isSubsetArray(requestedFieldArr,realFields);
    //Array of all required field for User
    let requiredFieldArray = user.getRequiredFields();
    //Check for all required fields
    let has_required_fields = await sharedHelper.isSubsetArray(requiredFieldArray,requestedFieldArr);
    if (request.params && isSubset && has_required_fields) {
        isvalidRequest = true;
    }
    return isvalidRequest;
}

exports.validateLoginRequest = async(request) =>{
    const user = new userEntity.User();
    let isvalidRequest = false;
    const requestedFieldArr = Object.keys(request.params);
    //All valid props array of User Class
    let realFields  = Object.keys(user);
    //Check if all params are availble in  valid prop list of User
    let isSubset = await sharedHelper.isSubsetArray(requestedFieldArr,realFields);
    //Array of all required field for User
    let requiredFieldArray = ['email','password'];
    //Check for all required fields
    let has_required_fields = await sharedHelper.isSubsetArray(requiredFieldArray,requestedFieldArr);
    if (request.params && isSubset && has_required_fields) {
        isvalidRequest = true;
    return isvalidRequest;
}



}
