import request from "../utils/request";
let baseUrl = "http://39.105.182.121:8088/";
/*switch (process.env.NODE_ENV) {
    case 'dev':
        baseUrl = "http://localhost:8088/"  //开发环境url
        break
    case 'serve':
        baseUrl = "http://localhost:8089/"   //生产环境url
        break
}*/
 
export default baseUrl;

export const fetchData = query => {
    return request({
        url: 'http://localhost:8080/static/table' +'.json',
        method: 'get',
        params: query
    });
};

export const fetchUserSide = query => {
    return request({
        url: 'http://localhost:8080/static/Siderbar_user' +'.json',
        method: 'get',
        params: query
    });
};

export const fetchAdminSide = query => {
    return request({
        url: 'http://localhost:8080/static/Siderbar_admin' +'.json',
        method: 'get',
        params: query
    });
};

export const fetchDevSide = query => {
    return request({
        url: 'http://localhost:8080/static/Siderbar_dev' +'.json',
        method: 'get',
        params: query
    });
};