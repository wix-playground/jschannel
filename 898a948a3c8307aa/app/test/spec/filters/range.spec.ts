'use strict';

describe('Filter: range', () => {
  let range: Function;

  beforeEach(() => {
    module('paymentAppInternal');
  });

  beforeEach(inject(($filter: ng.IFilterService) => {
    range = $filter('range');
  }));

  it('should return the input prefixed with "range filter:"', () => {
    let min = 1;
    let max = 5;
    expect(range([], min, max)).toEqual([1, 2, 3, 4, 5]);
  });

});
