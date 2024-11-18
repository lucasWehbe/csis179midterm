import http from "../http-common";

const getAll = () => {
    return http.get("/emergency-contacts");
}

const get = (id) => {
    return http.get(`/emergency-contacts/${id}`);
}

const create = (data) =>{
    return http.post("/emergency-contacts",data);
}

const update = (id, data) =>{
    return http.put(`/emergency-contacts/${id}`,data);
}

const remove = (id) => {
    return http.delete(`/emergency-contacts/${id}`);
}

const EmergencyContactsService = {
    getAll,
    get,
    create,
    update,
    remove
}

export default EmergencyContactsService