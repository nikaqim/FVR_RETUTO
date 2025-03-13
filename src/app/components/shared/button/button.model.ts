export class Button {
    id: string = "";
    icon: string = "";
    label: string= "";
    size: string= "";
    action: string = "";
    main:boolean = false;
    visible: boolean = false;

    constructor(id: string = "", icon: string = "", label: string = "", size:string = "", action: string = "", visible:boolean = false) {
        this.id = id;
        this.icon = icon;
        this.label = label;
        this.size = size;
        this.action = action;
        this.visible = visible;
    }

    assign(jsonObj: object){
        Object.assign(this, jsonObj);
    }

    get isVisible(){
        return this.visible;
    }

    get url(){
        return this.icon;
    }

}