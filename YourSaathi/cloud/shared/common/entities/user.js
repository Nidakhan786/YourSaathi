// Model class for the User
class User {
    constructor(username,email,password,profileImage,backgroundImage,userObjectId,name,birthDate,gender,mobileNumber,deviceToken){
        this.username = username;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
        this.backgroundImage = backgroundImage;
        this.userObjectId = userObjectId;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.mobileNumber = mobileNumber;
        this.deviceToken = deviceToken;
    }
    getRequiredFields(){
        return ['name','email','password']
    }
}

module.exports = { User }
