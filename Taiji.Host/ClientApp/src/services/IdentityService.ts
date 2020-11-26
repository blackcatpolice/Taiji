import qs from 'qs'
import axios from 'axios';

export default class IdentityService {
    host = location.protocol+"//"+location.host+`/api`;
    constructor() {
    }

    public async getRoles(): Promise<any> {
        return axios.get(`${this.host}/Identity/GetRole`)
    }
    public async getPermission(): Promise<any> {
        return axios.get(`${this.host}/Identity/GetPermission`)
    }
    public async ChangePassword(): Promise<any> {
        return axios.get(`${this.host}/Identity/ChangePassword`)
    }
}