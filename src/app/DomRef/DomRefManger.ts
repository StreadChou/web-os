import {DomRef} from "./DomRef.ts";

export class DomRefManger {

    static get windowMaxWidth() {
        let dom = DomRef.windowLayoutRef || document.body;
        return dom.offsetWidth;
    }

    static get windowMaxHeight() {
        let dom = DomRef.windowLayoutRef || document.body;
        return dom.offsetHeight;
    }


}