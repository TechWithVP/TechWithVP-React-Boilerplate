import axios from "axios";

class ToDoService {
    fetchToDoService = async () => {
        return new Promise((resolve, reject) => {
            axios
                .get(`${process.env.REACT_APP_API_ENDPOINT}`)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    fetchSingleToDoService = async (id) => {
        return new Promise((resolve, reject) => {
            axios
                .get(`${process.env.REACT_APP_API_ENDPOINT}/${id}`)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    insertToDoService = async (data) => {
        return new Promise((resolve, reject) => {
            axios
                .post(`${process.env.REACT_APP_API_ENDPOINT}/`, data)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    deleteToDoService = async (id) => {
        return new Promise((resolve, reject) => {
            axios
                .delete(`${process.env.REACT_APP_API_ENDPOINT}/${id}`)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    updateToDoService = async (data) => {
        return new Promise((resolve, reject) => {
            axios
                .put(`${process.env.REACT_APP_API_ENDPOINT}/${data.id}`, data)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
}
export default new ToDoService();
