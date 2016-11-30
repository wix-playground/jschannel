'use strict';

describe('Service: creditCard', () => {

  let creditCard: CreditCard;

  let invalid = ['4222222222223'];

  let visa = ['4111111111111111', '4012888888881881', '4222222222222', '4000056655665556'];
  let amex = ['371449635398431', '378282246310005', '378734493671000'];
  let diners = ['38520000023237', '30569309025904'];
  let discover = ['6011000990139424', '6011111111111117'];
  let jcb = ['3530111333300000', '3566002020360505'];
  let mastercard = ['5555555555554444', '5105105105105100', '5200828282828210'];
  let maestro = ['6759649826438453', '6799990100000000019'];
  //let dankort = ['76009244561', '5019717010103742'];
  //let isracard = ['5105105105105100', '5555555555554444'];
  //let unionpay = [];

  beforeEach(() => {
    module('paymentAppInternal');
  });

  beforeEach(inject((_creditCard_: CreditCard) => {
    creditCard = _creditCard_;
  }));

  it('should return "none" for not "luhn" credit card', () => {
    invalid.forEach((number) => {
      expect(creditCard.getType(number)).toBe('none');
    });
  });

  it('should return "visa"', () => {
    visa.forEach((number) => {
      expect(creditCard.getType(number)).toBe('visa');
    });
  });

  it('should return "amex"', () => {
    amex.forEach((number) => {
      expect(creditCard.getType(number)).toBe('amex');
    });
  });

  it('should return "diners"', () => {
    diners.forEach((number) => {
      expect(creditCard.getType(number)).toBe('diners');
    });
  });

  it('should return "discover"', () => {
    discover.forEach((number) => {
      expect(creditCard.getType(number)).toBe('discover');
    });
  });

  it('should return "jcb"', () => {
    jcb.forEach((number) => {
      expect(creditCard.getType(number)).toBe('jcb');
    });
  });

  it('should return "mastercard"', () => {
    mastercard.forEach((number) => {
      expect(creditCard.getType(number)).toBe('mastercard');
    });
  });

  it('should return "maestro"', () => {
    maestro.forEach((number) => {
      expect(creditCard.getType(number)).toBe('maestro');
    });
  });

  it('should pass valid luhn credit card number', () => {
    let validCreditCardNumber = '4222222222222';
    expect(creditCard.checkLuhn(validCreditCardNumber)).toBe(true);
  });

  it('should not pass invalid luhn credit card number', () => {
    invalid.forEach((number) => {
      expect(creditCard.checkLuhn(number)).toBe(false);
    });
  });

  it('should mask credit card with "*"', () => {
    let cc: string = '4222222221234';
    expect(creditCard.maskCreditCard(cc)).toBe('**** **** **** 1234');
  });
});
