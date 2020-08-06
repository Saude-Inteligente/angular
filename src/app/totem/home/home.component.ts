import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Keyboard from "simple-keyboard";

import { RequestService } from '../../services/request/request.service'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


export class DashboardWelcomeComponent {

}

@Component({
    selector: 'app-totem-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class TotemHomeComponent implements OnInit {
    @ViewChild('fullpageRef') fp_directive: ElementRef;
    @ViewChild('content') content: any;
    config;
    fullpage_api;
    keyboard: Keyboard;
    modalRef: NgbModal;
    actualSlide: number = 0;

    form = {
        full_name: 123,
        arterial_pressure: null,
        height: null,
        weight: null,
        imc: null,
        temperature: null,
    }

    modalTitle = '';
    render = [
        {
            title: '<strong>Qual é o seu nome?</strong>',
            subTitle: 'Pedimos esse dado para que suas informações de saúde sejam armazenadas com segurança nos sistemas da Digital Innovetion One.',
            input: 'full_name',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite seu nome',
        },
        {
            title: '<strong>Qual sua data de aniversário?</strong>',
            input: 'date_of_birth',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua pressão arterial',
        },
        {
            title: '<strong>Qual seu genero?</strong>',
            input: 'gender',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua pressão arterial',
        },
        {
            title: '<strong>Qual seu peso?</strong>',
            input: 'weight',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite seu peso',
        },
        {
            title: '<strong>Qual sua altura?</strong>',
            input: 'height',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua altura',
        },
        {
            title: '<strong>Qual sua temperatura ?</strong>',
            input: 'temperature',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua temperatura',
        },
        {
            title: '<strong>Qual sua pressão arterial?</strong>',
            input: 'arterial_pressure',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua pressão arterial',
        },
    ]
    constructor(private modalService: NgbModal, private request: RequestService) {
        this.config = {
            licenseKey: 'YOUR LICENSE KEY HERE',
            menu: '#menu',
            navigation: false,
        };
    }

    ngOnInit() { }

    value: any;

    back(index: number) {
        this.actualSlide = (index - 1);
        this.fullpage_api.moveSectionUp();
    }

    next(index: number) {
        this.actualSlide = (index + 1);

        if (this.actualSlide === this.render.length) {
            this.submit()
        }
        else {
            this.fullpage_api.moveSectionDown();
        }
    }

    async submit() {
        await this.request.request('https://api-health-analytics.herokuapp.com/users',
        'POST',this.form)

        this.fullpage_api.moveSectionDown();
    }

    exit() {

    }

    getRef(fullPageRef: any) {
        this.fullpage_api = fullPageRef;
    }

    randomColor() {
        return '#' + Math.random().toString(16).slice(-3);
    }

    hasBack(index: number) {
        return (index > 0);
    }

    hasItemType(type: string, result: string) {
        return type === result;
    }

    openModal(content) {
        this.modalService.open(content, { backdrop: 'static', centered: true, size: 'xl', backdropClass: 'bg-dark', scrollable: true }).result.then((result) => {
            if (result) {
                this.next(this.actualSlide);
            } else if (!result) {
                this.back(this.actualSlide);
            }
        }, () => {
            // this.back(this.actualSlide);
        });
    }

    hideModal() {
        this.modalService.dismissAll();
    }

    hasContent(item) {
        return this.hasItemType(item.type, 'keyboard') ||
            this.hasItemType(item.type, 'content-result') ||
            this.hasItemType(item.type, 'content-result-temperature') ||
            this.hasItemType(item.type, 'content-loading');
    }

    defineValue($event: any, input: string) {
        this.form[input] = $event.target.value;
    }
}
