import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";

import { Field, FieldType } from "../field-core/field.model";
import { Error } from "../core/error.model";


@Component({
    selector: "app-field-edit",
    templateUrl: "./field-edit.component.html"
})
export class FieldEditComponent implements OnInit {

    FieldType = FieldType;

    @Input()
    solutionId: number;

    innerField: Field;

    private _field: Field;

    get field(): Field {
        return this._field;
    }

    @Input()
    set field(value: Field) {
        this._field = value;
        this.innerField = { ...value };
    }

    @Output()
    fieldSave = new EventEmitter<Field>();

    error: Error;

    constructor(private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {

    }

    cancel(): void {
        window.history.back();
    }

    onSubmit(): void {
        this.saveField();
    }

    private saveField(): void {
        this.fieldSave.emit(this.innerField);
    }

}