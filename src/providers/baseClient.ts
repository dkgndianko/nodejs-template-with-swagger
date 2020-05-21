import axios from "axios";

export default class BaseClient {

    endPoint: string;

    constructor(_endPoint: string) {
        this.endPoint = _endPoint;
    }

    /**
     * method to call all ttc post endpoint
     * @param pathUrl: the path to add in the the global api
     * @param headers
     * @param requestData: the data you will use to send a request
     */


    postRequests(pathUrl: string, headers: any, requestData: any, authentication: any) {
        return new Promise((resolve, reject) => {
            axios.post(this.endPoint + pathUrl, requestData, {
                headers: headers,
                auth: authentication
            }).then(response => {
                console.log(`Status: ${response.status}`);
                resolve(response);
            }).catch(error => {
                const response = error.response;
                console.log(`Status of response: ${response.status}`);
                console.log(response.data);
                reject(response.data)
            });
        });
    }

    /**
     * method to call all ttc get endpoint
     * @param pathUrl: the path to add in the the global api
     * @param headers
     */
    getRequests(pathUrl: string, headers: any, authentication: any) {

        return new Promise((resolve, reject) => {
            axios.get(this.endPoint + pathUrl, {
                headers: headers,
                auth: authentication
            }).then(response => {
                console.log(`Status: ${response.status}`);
                resolve(response.data);
            }).catch(error => {
                const response = error.response;
                console.log(`Status of response: ${response.status}`);
                console.log(response.data);
                reject(response.data)
            });
        });
    }
}
