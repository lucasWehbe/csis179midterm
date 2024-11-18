import http from "../http-common";

const getAll = () => {
    return http.get("/sos-alerts");
}

const get = (id) => {
    return http.get(`/sos-alerts/${id}`);
}

const create = (data) =>{
    return http.post("/sos-alerts",data);
}

const update = (id, data) =>{
    return http.put(`/sos-alerts/${id}`,data);
}

const remove = (id) => {
    return http.delete(`/sos-alerts/${id}`);
}

const send = (data) => {
    return http.post(`/sos-alerts/wp`, data);
}

const SosService = {
    getAll,
    get,
    create,
    update,
    remove,
    send
}

export default SosService;