import ToDoStore from "./ToDo/ToDo.store";
import ToDoModalStore from "./ToDo/ToDo.Modal.store";

class CombinedStore {
    constructor() {
        this.resetAllStore();
    }

    resetAllStore = () => {
        this.todo = new ToDoStore(this);
        this.todoModal = new ToDoModalStore(this);
    };
}
export default CombinedStore;
