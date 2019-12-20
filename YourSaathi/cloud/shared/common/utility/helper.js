// const responseModel = require('../entities/response');
//const crypto = require('cryptography');
/**
 * Creating a response
 * @param {Object} object
 * @param {string} message
 * @param {number} statuscode
 * @returns {Object} Response
 */
const createResponse= async(data, message, statuscode) => {
    const finalObj = {data,message,statuscode};
    let responseObject = finalObj;
    responseObject.data = data;
    responseObject.message = message;
    responseObject.statuscode = statuscode;
    // if(crypto.isEnable)
    //     responseObject =  await crypto.ecryptData(responseObject);
    return responseObject;
}

/**
 * Reusable  Function which will use to fetch the data
 * @param {string} objectName
 * @param {string} attributeName
 * @param {string} attributeName
 * @return {object} Object
 */
const getDataByField = async (objectName, attributeName, attributeValue) => {
    try {
        var query = new Parse.Query(objectName);
        query.equalTo(attributeName, attributeValue);
        var result = await query.first({ useMasterKey: true });
        if (result) {
            return result;
        }
    }
    catch (ex) {
        console.log(ex);
        throw ex;
    }
}

/**
 * Reusable  Function which will use to search the data
 * @param {string} objectName Class name in parse dashboard
 * @param {string} attributeName Column to be matched in collection
 * @param {string} attributeValue Value to be checked in column
 * @return {object} Object
 */
const searchDataByField = async (objectName, attributeName, attributeValue , includedPointers) => {
    try {
        var query = new Parse.Query(objectName);
        query.startsWith(attributeName, attributeValue);
        if (includedPointers.length > 0) {
            includedPointers.forEach(column => {
                query.include(column);
            });
        }
        let  result = await this.getAllRecords(query, 0, []);
        if(result) {
            return result;
        }
    }
    catch (ex) {
        throw ex;
    }
}

function convertDate(inputFormat) {
    function pad(value) { return (value < 10) ? '0' + value : value; }
    var date = new Date(inputFormat);
    return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/');
}
function getHours(milliseconds)
 {
     let hours = milliseconds
     hours /= 1000;
     hours /= 60;
     hours /= 60;
    return hours;
 }
 async function isEqualArray(_arr1, _arr2) {
    if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
      return false;

    var arr1 = _arr1.concat().sort();
    var arr2 = _arr2.concat().sort();

    for (var i = 0; i < arr1.length; i++) {

        if (arr1[i] !== arr2[i])
            return false;

    }

    return true;

}

async function isSubsetArray (array1,array2) {
    var isSubset = true;
    array1.map((item) => {
        if(array2.includes(item) === false){
             isSubset = false;
            }
    })
    return isSubset;
}

const getFieldValue= (object,field)=> {
    return object.get(field) ? object.get(field):null;
}

const finalDecryptedParams = async(request) =>{
    let ciphertext = request.params.ciphertext;
    return request.params;//iphertext ? await crypto.decryptData(ciphertext): request.params;
}

const saveBase64Image = async(data,postFix = '')=>{
    let fileData = null;
    let file = new Parse.File("profileImg", { base64: data });
    await file.save();
    if(file.url())
        fileData = file;
    return fileData;
}

const getRecordsByBatch = async (query, batchNumber) => {
    query.limit(1000);
    query.skip(batchNumber * 1000);

    return query.find({useMasterKey:true}).then(
        function (objects) {
            return objects;
        },
        function (error) {
            return error;
        }
    );
}

const getAllRecords = async (query, batchNumber, allObjects) => {
    return getRecordsByBatch(query, batchNumber).then(function (objects) {
        // concat the intermediate objects into the final array
        allObjects = allObjects.concat(objects);
        // if the objects length is 1000, it means that we are not at the end of the list
        if (objects.length === 1000 ) {
            batchNumber = batchNumber + 1;
            return getAllRecords(query, batchNumber, allObjects);
        } else {
            return allObjects;
        }
    });
}


module.exports = {
    createResponse,
    convertDate,
    isEqualArray,
    isSubsetArray,
    getFieldValue,
    getHours,
    getDataByField,
    finalDecryptedParams,
    saveBase64Image,
    searchDataByField,
    getAllRecords
}
