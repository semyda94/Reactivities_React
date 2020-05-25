import axios, { AxiosResponse } from 'axios';
import {IActivity} from '../Models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(undefined, error => {
const {status, data, config} = error.response;

    if (error.message ==='Network Error' && !error.response) {
        toast.error('API server down');
    }

    if (status === 404) {
        history.push('/notfound');
    }

    if (status === 400 && config.method === 'get') {
        history.push('/notfound');
    }

    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }

    console.log(error.response);
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => 
new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    get: (url: string) => axios.get(url).then(sleep(1)).then(responseBody),
    post:(url: string, body: {}) => axios.post(url, body).then(sleep(1)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(1)).then(responseBody)
}

const Activities = {
    list: () : Promise<IActivity[]> => request.get('/activities'),
    detatil: (id: string) => request.get(`/activities/${id}`),
    create: (activity: IActivity) => request.post(`/activities`, activity),
    update: (activity: IActivity) => request.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.delete(`/activities/${id}`)
}

export default  { Activities }