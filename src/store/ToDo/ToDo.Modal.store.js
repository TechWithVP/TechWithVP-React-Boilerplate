import { makeAutoObservable, runInAction } from "mobx";

class ToDoModal {
    isFetchingData = false;
    showEditModal = false;

    constructor() {
        makeAutoObservable(this);
    }

    reset = () => {
        this.isFetchingData = false;
        this.showEditModal = false;
    };

    openShowEditModal = async (visibility) => {
        runInAction(() => {
            this.showEditModal = visibility;
        });
    };
}

export default ToDoModal;
