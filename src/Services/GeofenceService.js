import http from "../http-common";

const getAll = () => {
    return http.get("/geofences");
}

const get = (id) => {
    return http.get(`/geofences/${id}`);
}

const create = (data) =>{
    return http.post("/geofences",data);
}

const update = (id, data) =>{
    return http.put(`/geofences/${id}`,data);
}

const remove = (id) => {
    return http.delete(`/geofences/${id}`);
}

const GeofencesService = {
    getAll,
    get,
    create,
    update,
    remove
}

export default GeofencesService