import {Component} from "angular2/core";

@Component({
    selector: "alert-area",
    template: `
        <div class="row">
            <div class="col-md-7 col-md-offset-2 alert alert-success scrollableMessageArea">
                <div>{{ "message" }}</div>
            </div>
            <div class="col-md-1">
                <button type="button" id="btnClear" class=" btn btn-sm btn-danger" (click)="onClear()">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button>
            </div>
        </div>`
})
export class AlertAreaComponent {
    onClear() {
    }
}
