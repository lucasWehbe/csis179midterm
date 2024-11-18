import http from  "../http-common";
import { getToken, getTokenBearer } from "../Utils/Utils";


const getAll = () => {
    return http.get("/users", {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
}

const get = (id) =>{
    return http.get(`/users/${id}`, {
        headers: {
            Authorization: getTokenBearer()
        }
    });
}

const create = (data) =>{
    return http.post(`/users`, data);
}

const update = (id, data) => {
    return http.put(`/users/${id}`, data, {
        headers: {
            Authorization: getTokenBearer()
        }
    });
}

const remove = (id) =>{
    return http.delete(`/users/${id}`, {
        headers: {
            Authorization: getTokenBearer()
        }
    });
}

const authenticate = (user) => {
    return http.post(`/users/auth/login`, user);
}



const UserService = {
    getAll,
    get,
    create,
    update,
    remove,
    authenticate,
}

export default UserService;