import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Keyboard from "simple-keyboard";

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
        full_name: null,
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
            img: '/assets/imgs/carteirinha@3x.jpg',
            card_title: 'LEMBRE-SE',
            text: 'você pode achar o número na sua carteira de motorista :)',
            keyboard: null,
            type: 'keyboard',
            placeholder: 'Digite seu nome',
        },
    ]
    constructor(private modalService: NgbModal) {
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
        this.verify();
    }

    next(index: number) {
        this.actualSlide = (index + 1);
        this.fullpage_api.moveSectionDown();
        this.verify();
    }

    verify() {
        if (this.isModal()) {
            this.openModal(this.content);
        } else if (this.isLoading() || this.isLoadingContent()) {
            setTimeout(() => this.next(this.actualSlide), 2000);
        } else {
       //     this.keyboads(); 
        }
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

    isModal() {
        return (this.render[this.actualSlide].type === 'modal');
    }

    isLoading() {
        const { type } = this.render[this.actualSlide];
        return (this.render[this.actualSlide].type === 'loading');
    }

    isLoadingContent() {
        const { type } = this.render[this.actualSlide];
        return (this.render[this.actualSlide].type === 'content-loading');
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
}
