


/**
 * cloud function for creation of schema
 */
Parse.Cloud.define("createSchema", async () => {
    await createSchemaforUser();
    await createSchemaforRole();
    await createSchemaforTweetLikes();
    await createSchemaforTweetComments();
    await createSchemaforTweetPosts();
    await createSchemaforTweetPostsPointer();
    await createSchemaforNotifications();
    await createSchemaforFile();
    await createSchemaforModule();
    await createSchemaforRestrictPushUsers();
    await createSchemaforConfiguration();
    await createSchemaforVote();
});

/**
 * This function will create the fields for User Class
 */
const createSchemaforUser = async () => {
    try {
        const schema = new Parse.Schema('_User');
        schema.addString('gender');
        schema.addRelation('followers', '_User');
        schema.addPointer('userRoleObjectId', '_Role');
        schema.addNumber('mobileNumber');
        schema.addString('name');
        schema.addDate('birthDate');
        schema.addFile('profileImage');
        schema.update({ useMasterKey: true });
    }
    catch (ex) {
        console.log(ex);
        // throw  ex;
    }
}

// // /**
// //  * This function will create the fields for Role Class
// //  */
const createSchemaforRole = async () => {
    try {
        const schema = new Parse.Schema('_Role');
        schema.addNumber('code');
        schema.update({ useMasterKey: true });
        var roleACL = new Parse.ACL();
        roleACL.setPublicWriteAccess(true);
        roleACL.setPublicReadAccess(true);
        var role = new Parse.Role("_Role", roleACL);
        role.set('code', 1);
        role.set('name', "internal");
        await role.save();
        var role1 = new Parse.Role("_Role", roleACL);
        role1.set('code', 2);
        role1.set('name', "external");
        await role1.save();
        var role2 = new Parse.Role("_Role", roleACL);
        role2.set('code', 3);
        role2.set('name', "other");
        await role2.save();
    }
    catch (ex) {
        console.log(ex);
        //         throw ex;
    }
}
