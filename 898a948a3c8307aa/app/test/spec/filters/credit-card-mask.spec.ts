'use strict';

describe('Filter: creditCardMask', () => {
  let creditCardMask: Function;

  beforeEach(() => {
    module('paymentAppInternal');
  });

  beforeEach(inject(($filter: ng.IFilterService) => {
    creditCardMask = $filter('creditCardMask');
  }));

  it('should return the input masked with "-"', () => {
    let creditCardNumber: string = '1234567890123456';
    let creditCardMaskedNumber: string = '1234-5678-9012-3456';
    expect(creditCardMask(creditCardNumber)).toBe(creditCardMaskedNumber);
  });

  it('should return partial input masked with "-"', () => {
    let creditCardNumber: string = '12345678';
    let creditCardMaskedNumber: string = '1234-5678';
    expect(creditCardMask(creditCardNumber)).toBe(creditCardMaskedNumber);
  });

  it('should return partial input masked with "-"', () => {
    let creditCardNumber: string = '1234567890';
    let creditCardMaskedNumber: string = '1234-5678-90';
    expect(creditCardMask(creditCardNumber)).toBe(creditCardMaskedNumber);
  });

});
