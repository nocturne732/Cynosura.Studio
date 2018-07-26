import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Modal } from "ngx-modialog/plugins/bootstrap";

import { Entity } from "./entity.model";
import { EntityService } from "./entity.service";

import { StoreService } from "../core/store.service";
import { Error } from "../core/error.model";
import { Page } from "../core/page.model";

@Component({
    selector: "entity-list",
    templateUrl: "./list.component.html"
})
export class EntityListComponent implements OnInit {
    content: Page<Entity>;
    error: Error;
    pageSize = 10;
    private _solutionId: number;
    get solutionId(): number {
        return this._solutionId;
    }
    set solutionId(val: number) {
        this._solutionId = val;
        this.storeService.set("entitiesSolutionId", this._solutionId);
        this.getEntities(0);
    }

    constructor(
        private modal: Modal,
        private entityService: EntityService,
        private router: Router,
        private route: ActivatedRoute,
        private storeService: StoreService
        ) {}

    ngOnInit(): void {
        this._solutionId = this.storeService.get("entitiesSolutionId");
        let pageIndex = this.storeService.get("entitiesPageIndex");
        if (!pageIndex) pageIndex = 0;
        this.getEntities(pageIndex);
    }

    getEntities(pageIndex: number): void {
        if (this.solutionId) {
            this.entityService.getEntities(this.solutionId, pageIndex, this.pageSize)
                .then(content => {
                    if (content.pageItems.length == 0 && content.totalItems != 0) {
                        this.content.currentPageIndex--;
                        this.storeService.set("entitiesPageIndex", this.content.currentPageIndex);
                        this.getEntities(this.content.currentPageIndex);
                    }
                    this.content = content;
                })
                .catch(error => this.error = error);
        } else {
            this.content = null;
        }
    }

    reset(): void {
        this.entityService.getEntities(this.content.currentPageIndex, this.pageSize)
            .then(content => { this.content = content; },
                error => this.error = error.json() as Error);
    }

    edit(id: string): void {
        this.router.navigate([id], { relativeTo: this.route, queryParams: { solutionId: this.solutionId } });
    }

    add(): void {
        this.router.navigate([0], { relativeTo: this.route, queryParams: { solutionId: this.solutionId } });
    }

    delete(id: number): void {
        const dialogRef = this.modal
            .confirm()
            .size("sm")
            .keyboard(27)
            .title("Удалить?")
            .body("Действительно хотите удалить?")
            .okBtn("Удалить")
            .cancelBtn("Отмена")
            .open();
		dialogRef.result.then(dialog => dialog.result)
            .then(() => {
                this.entityService.deleteEntity(this.solutionId, id)
                    .then(() => {
                        this.getEntities(this.content.currentPageIndex);
                    })
                    .catch(error => this.error = error)
            })
            .catch(() => {});
    }

    onPageSelected(pageIndex: number) {
        this.storeService.set("entitiesPageIndex", pageIndex);
        this.getEntities(pageIndex);
    }
}
