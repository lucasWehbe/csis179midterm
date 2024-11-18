const User = require('../Models/User');
const bcrypt = require("bcrypt");
const saltRounds = 10;


const createUser = async (username, password, email, phone) => {
    try{
        const hashedPass = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            user_username: username,
            user_pass: hashedPass,
            user_email: email,
            user_phone: phone,
            created_at: new Date(),
        });

        return newUser;

    } catch (error){
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
};

const getAllUsers = async () =>{
    try{
        const users = await User.findAll();
        
        return users;
    }catch(error){
        console.log('Error retrieving users: ', error);
        throw new Error('Failed to retrieve users');
    }
};

const getUserById = async(id) => {
    try{
        const user = await User.findByPk(id);

        return user;

    }catch(error){
        console.log('Error retrieving user by id: ', error);
        throw new Error('Failed to retrieve user');
    }
};

const updateUser = async (id, username, password, email, phone) => {
    try{
        let hashedPass;
        if (password) {
            hashedPass = await bcrypt.hash(password, saltRounds);
        }
        const user = await User.findByPk(id);
        if (!user) throw new Error(`User with id ${id} not found`);


        const updated = await User.update({
            user_username: username,
            user_pass: hashedPass || user.user_pass,
            user_email: email,
            user_phone: phone,
        }, {
            where: { user_id : id}
        });
        
        return updated;

    }catch(error){
        console.error('Error updating user: ', error);
        throw new Error('Failed to update user');

    }
};

const deleteUser = async (id) => {
    try{
        const user = await User.findByPk(id);
        if(!user){
            throw new Error(`User with id ${id} is not found`);
        }
        const deletedUser = await user.destroy();
        return deletedUser;

    }catch(error){
        console.error('Error deleting user: ', error);
        throw new Error('Failed to delete user');
    }
};

const getUserByUsername = async(user_username) => {
    try{
        const user = await User.findOne({
            where: { user_username: user_username }
                });
        
        return user || null;

    }catch(error){
        console.error('Error getting user by username: ', error);
        throw new Error(`Failed to get user by username ${user_username}`);
    }
}

const findUserByPhone = async (phone) => {
    return await User.findOne({ where: { user_phone: phone } });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByUsername,
    findUserByPhone
};