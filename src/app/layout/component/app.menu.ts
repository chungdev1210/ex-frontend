import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Danh mục',
                items: [{ label: 'Trang chủ', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Hệ thống',
                items: [
                    {
                        label: 'Quản lý người dùng',
                        icon: 'pi pi-fw pi-user'
                    },
                    {
                        label: 'Quản lý vai trò',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/roles']
                    },
                    {
                        label: 'Quản lý quyền',
                        icon: 'pi pi-fw pi-shield',
                        routerLink: ['/pages/permissions']
                    }
                ]
            }
        ];
    }
}
