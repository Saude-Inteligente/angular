import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { TotemRouting, TotemComponents } from './totem.routing';

let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
    declarations: TotemComponents,
    imports: [
        TotemRouting,
        AngularFullpageModule,
        CommonModule,
        NgxMaskModule.forRoot(options),
    ],
    providers: [],
    bootstrap: TotemComponents
})
export class TotemModule { }
