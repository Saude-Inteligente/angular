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
    letters = 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS';
    config;
    fullpage_api;
    keyboard: Keyboard;
    modalRef: NgbModal;
    actualSlide: number = 0;
    loading: boolean = false;
    loading_text: string;
    result: boolean = false;

    form = {
        full_name: null,
        arterial_pressure: null,
        height: null,
        weight: null,
        imc: null,
        temperature: null,
        cardiac_problems: null,
        breating_problems: null,
        smoking: null,
        city: null,

    }

    modalTitle = '';
    render = [
        {
            title: '<strong>Qual é o seu nome?</strong>',
            subTitle: 'Pedimos esse dado para que suas informações de saúde sejam armazenadas com segurança no sistema da Digital Innovation One.',
            input: 'full_name',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite seu nome',
        },
        {
            title: '<strong>Qual sua cidade?</strong>',
            input: 'city',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua cidade',
        },
        {
            title: '<strong>Qual sua data de aniversário?</strong>',
            input: 'date_of_birth',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite seu aniversário',
            mask: '00/00/0000'
        },
        {
            title: '<strong>Qual seu genero?</strong>',
            input: 'gender',
            keyboard: null,
            type: 'select',
            placeholder: 'Digite seu genero',
            options: [
                { value: 'female', label: 'feminino' },
                { value: 'male', label: 'masculino' },
            ]
        },
        {
            title: '<strong>Qual seu peso?</strong>',
            input: 'weight',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite seu peso',
            mask: "000.00"
        },
        {
            title: '<strong>Qual sua altura?</strong>',
            input: 'height',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite sua altura',
            mask: "0.00"
        },
        {
            title: '<strong>Você fuma ou bebe?</strong>',
            input: 'smoking',
            keyboard: null,
            type: 'select',
            placeholder: 'Sim ou não',
        },
        {
            title: '<strong>Você tem problemas cardíaco?</strong>',
            input: 'cardiac_problems',
            keyboard: null,
            type: 'select',
            placeholder: 'Digite sim ou não',
            options: [
                { value: false, label: 'não' },
                { value: true, label: 'sim' },
            ]
        },
        {
            title: '<strong>Você tem problemas respiratórios?</strong>',
            input: 'breating_problems',
            keyboard: null,
            type: 'select',
            placeholder: 'Digite sim ou não',
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

        this.middleware()

        if (this.actualSlide === this.render.length) {
            this.submit()
        }
        else if (!this.loading) {
            this.fullpage_api.moveSectionDown();
        }
    }

    middleware() {
        const checkIndex = (this.actualSlide - 1);
        const { input } = this.render[checkIndex];

        if (input === 'temperature') {
            this.loading_text = 'Medindo sua temperatura';
            this.setTimeLoading()
        } else if (input === 'arterial_pressure') {
            this.loading_text = 'Medindo sua pressão arterial';
            this.setTimeLoading()
        }
    }

    setTimeLoading(second: number = 2000) {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            if (this.actualSlide !== this.render.length) {
                this.fullpage_api.moveSectionDown();
            }
        }, second)
    }

    async submit() {
        await this.request.request('https://api-health-analytics.herokuapp.com/users',
            'POST', this.form)

        // NEGATIVO
        this.result = false;
        console.log(this.result)

        /* POSITIVO
        this.result = true;
        */
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

    defineValue($event: any, input: string) {
        this.form[input] = $event.target.value;
    }
}
