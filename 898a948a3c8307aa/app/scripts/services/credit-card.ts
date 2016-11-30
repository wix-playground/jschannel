'use strict';

class CreditCard {

  _saveCreditCardFeatureToggle: boolean = false;

  networks: Array<any> = [
    { type: 'visa', regex: /^4\d{12}(\d{3})?$/ },
    { type: 'amex', regex: /^3([47]\d{3}|[23]\d{3})\d{10}$/ },
    { type: 'dankort', regex: /^5019(34)\d{10}$/ },
    { type: 'diners', regex: /^3(0[0-59]|[689]\d)\d{11}$/ },
    { type: 'discover', regex: /^(6011\d{2}|65\d{4}|64[4-9]\d{3}|601300|3[123689]\d{4}|309\d{3})\d{10}$/ },
    { type: 'isracard', regex: /^\d{8,9}$/ },
    { type: 'jcb', regex: /^35(?:2[89]|[3-8]\d)\d{12}$/ },
    { type: 'maestro', regex: /^(50[^1]\d{3}|501[^9]\d{2}|5019[^3]\d|50193[^4]|5[6789]\d{4}|6[^0245]\d{4}|62[79]\d{3}|628[01]\d{2}|626257|62292[78]|62293[^4]|62294[^14]|62299\d|62298[02369]|62297[^0]|62296[^4569]|62295[^68]|62212[^6789]|62211\d|6220\d{2}|621[^4]\d{2}|6214[^8]\d|62148[^3]|620\d{3}|64[0-3]\d{3}|60[2-7]\d{3}|601[^13]\d{2}|6013[^0]\d|60130[^0]|600\d{3})\d{6,13}$/ },
    { type: 'mastercard', regex: /^5[1-5]\d{14}$/ },
    { type: 'unionpay', regex: /^(62[345]\d{3}|628[2-8]\d{2}|626[^2]\d{2}|6262[^5]\d|62625[^7]|622[^019]|6229[01]\d|62298[14578]|622970|62296[4569]|62295[68]|62294[14]|622934|62292[^78]|622[2-8]\d{2}|6221[^12]|62212[6-9]|621483)\d{10,13}$/ }
  ];

  /* @ngInject */
  constructor(private $translate: any) {
    //
  }

  getSaveCreditCardFeatureToggle(): boolean {
    return this._saveCreditCardFeatureToggle;
  }

  setSaveCreditCardFeatureToggle(value: string) {
    this._saveCreditCardFeatureToggle = (value === 'true') ? true : false;
  }

  getType(ccNumber: string): string {
    if (ccNumber === '' || !this.checkLuhn(ccNumber)) {
      return 'none';
    }
    var i = 0;
    for (i; i < this.networks.length; i++) {
      if (ccNumber.match(this.networks[i].regex)) {
        return this.networks[i].type;
      }
    }
    return 'none';
  }

  checkLuhn(ccNumber: string): boolean {
    let sumTable: number[][] = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]];
    let sum = 0;
    let flip = 0;
    let num = ccNumber.toString();
    for (let i = num.length - 1; i >= 0; --i) {
        /* tslint:disable */
        sum += sumTable[flip++ & 1][parseInt(num.charAt(i), 10)];
        /* tslint:enable */
    }
    return (sum % 10 === 0);
  }

  maskCreditCard(cardNumber: string): string {
    let lastDigits: string = cardNumber.substring(cardNumber.length - 4);
    return `**** **** **** ${lastDigits}`;
  }

  save(data, paymentDto: PaymentDTO) {
    if (data.enc && this.getSaveCreditCardFeatureToggle() && window['wixTouchBridge_saveSecuredInfo']) {
      window['wixTouchBridge_saveSecuredInfo']('CashierCCInfo', { encriptedCardNumber: data.enc, expirationMonth: paymentDto.month, expirationYear: paymentDto.year, nameOnCard: paymentDto.nameOnCard }, this.$translate('payment.saveCreditCardOnMobileTitle'), this.$translate('payment.saveCreditCardOnMobileQuestion'), this.maskCreditCard(paymentDto.ccnumber), 'pay-form');
    }
  }

  load(cb) {
    if (this.getSaveCreditCardFeatureToggle() && window['wixTouchBridge_loadSecuredInfo']) {
      window['wixTouchBridge_loadSecuredInfo']('CashierCCInfo', this.$translate('payment.loadCreditCardOnMobileTitle'), this.$translate('payment.loadCreditCardOnMobileQuestion'), this.$translate('payment.loadCreditCardApproveButtonText'), (response) => {
          if (cb && response.encriptedCardNumber) {
            cb(response);
          }
      }, 'pay-form');
    }
  }
}

angular
  .module('paymentAppInternal')
  .service('creditCard', CreditCard);
