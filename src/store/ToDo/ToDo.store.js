
import { message } from "antd";
import { makeAutoObservable, runInAction } from "mobx";
import ToDoService from "../../services/ToDo.service";

class ToDoStore {
    isFetchingData = false;
    isFetchingSingleData = false;
    dataList = {};
    singleToDo = {};

    constructor(allStores) {
        makeAutoObservable(this);
        this.allStores = allStores;
    }

    reset = () => {
        this.isFetchingData = false;
        this.isFetchingSingleData = false;
        this.dataList = {};
        this.singleToDo = {};
    };

    fetchAllToDos = async () => {
        try {
            this.dataList = {};

            this.isFetchingData = true;
            const data = await ToDoService.fetchToDoService();
            if (data.status === 200) {
                this.dataList = data.data;
                this.isFetchingData = false;
            } else {
                this.isFetchingData = false;
                message.error("Something went Wrong.!");
            }
        } catch (error) {
            message.error(error || "Something went Wrong.!");
            this.isFetchingData = false;
        }
    };

    fetchSingleToDo = async (id) => {
        try {
            this.singleToDo = {};
            await this.allStores.todoModal.openShowEditModal(true);
            this.isFetchingSingleData = true;
            const data = await ToDoService.fetchSingleToDoService(id);

            if (data.status === 200) {
                this.singleToDo = data.data;
                this.isFetchingSingleData = false;
            } else {
                this.isFetchingSingleData = false;
                message.error("Something went Wrong.!");
            }
        } catch (error) {
            message.error(error || "Something went Wrong.!");
            this.isFetchingSingleData = false;
        }
    };

    insertToDo = async (values, myForm) => {
        try {
            this.isFetchingData = true;
            const data = await ToDoService.insertToDoService(values);

            if (data.status === 200) {
                await this.fetchAllToDos();
                myForm.resetFields();
                message.success(data.data.message);
            } else {
                this.isFetchingData = false;
                message.error(data.data.message || "Something went Wrong.!");
            }
        } catch (error) {
            message.error(error || "Something went Wrong.!");
            this.isFetchingData = false;
        }
    };

    deleteToDo = async (id) => {
        try {
            this.isFetchingData = true;
            const data = await ToDoService.deleteToDoService(id);

            if (data.status === 200) {
                await this.fetchAllToDos();
                message.success(data.data.message);
            } else {
                this.isFetchingData = false;
                message.error(data.data.message || "Something went Wrong.!");
            }
        } catch (error) {
            message.error(error || "Something went Wrong.!");
            this.isFetchingData = false;
        }
    };

    updateToDo = async (values, myForm) => {
        try {
            this.isFetchingSingleData = true;
            const data = await ToDoService.updateToDoService(values);

            if (data.status === 200) {
                await this.fetchAllToDos();
                myForm.resetFields();
                await this.allStores.todoModal.openShowEditModal(false);
                message.success(data.data.message);
            } else {
                this.isFetchingSingleData = false;
                message.error(data.data.message || "Something went Wrong.!");
            }
        } catch (error) {
            message.error(error || "Something went Wrong.!");
            this.isFetchingSingleData = false;
        }
    };

    updateLoadingStatus = (visibility) => {
        runInAction(() => {
            this.isFetchingData = visibility;
        });
    };
}

export default ToDoStore;
