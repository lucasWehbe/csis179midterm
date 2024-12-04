const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByUsername
} = require('../Services/UserService');


const createUserController = async(req,res) => {
    const {user_username, user_pass, user_email, user_phone} = req.body;

    try{
        if(!user_username || !user_email || !user_pass || !user_phone)
            return res.status(400).json({message: 'Please fill in all fields'});

        const existingUser = await getUserByUsername(user_username);
        if(existingUser)
            return res.status(400).json({message: 'User already exists'});

        const newUser = await createUser(
            user_username,
            user_pass,
            user_email,
            user_phone
        );
        
        if(!newUser)
            return res.status(500).json({message: 'Failed to create user'});

        res.status(201).json({ message: "New user created", user: newUser });

    }catch(error){
        res.status(500).json({error : error?.message});

    }
}

const getAllUsersController = async(req,res) => {
    try{
        const users = await getAllUsers();
        res.status(200).json({users});
    }catch(error){
        res.status(500).json({error : error?.message});
    }
            
}

const getUserByIdController = async(req,res) => {
    const user_id = req.params.id;
    try{
        if(!user_id)
            return res.status(400).json({message: 'Missing user id'});
        const user = await getUserById(user_id);
        if(!user)
            return res.status(404).json({message: 'User not found'});
        res.status(200).json({user});
    }catch(error){
        res.status(500).json({error : error?.message});
    }
}

const updateUserController = async(req,res) =>{
    const user_id = req.params.id;
    const {user_username, user_pass, user_email, user_phone, user_role} = req.body;

    if(!user_id)
        return res.status(400).json({message: 'Missing user id'});

    try{
        const updatedUser = await updateUser(
            user_id,
            user_username,
            user_pass,
            user_email,
            user_phone,
            user_role
        );
        
        if(!updatedUser)
            return res.status(500).json({ message: 'Failed to update user'});

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

    }catch(error){
        res.status(500).json({error : error?.message});
    }
}

const deleteUserController = async(req,res) => {
    const user_id = req.params.id;
    if(!user_id)
        return res.status(400).json({message: 'Missing user id'});
    try{
        const deletedUser = await deleteUser(user_id);
        if(!deletedUser)
            return res.status(404).json({message: 'Failed to delete user'});

        res.status(200).json({message: 'User deleted successfully'});

    }catch(error){
        res.status(500).json({error : error?.message});
    }
}

module.exports = {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController
}