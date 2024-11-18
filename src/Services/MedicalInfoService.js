import http from "../http-common";

const getAll = () => {
    return http.get("/medical-info");
}

const get = (id) => {
    return http.get(`/medical-info/${id}`);
}

const create = (data) =>{
    return http.post("/medical-info",data);
}

const update = (id, data) =>{
    return http.put(`/medical-info/${id}`,data);
}

const remove = (id) => {
    return http.delete(`/medical-info/${id}`);
}

const MedicalInfoService = {
    getAll,
    get,
    create,
    update,
    remove
}

export default MedicalInfoService;