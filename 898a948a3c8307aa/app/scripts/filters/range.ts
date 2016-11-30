'use strict';

class RangeFilter {
  /* @ngInject */
  constructor() {
    //
  }

  filter(input: number[], min: number, max: number): number[] {
    for (let i = min; i <= max; i++) {
      input.push(i);
    }
    return input;
  }
}

angular
  .module('paymentAppInternal')
  .filter('range', $injector => {
    let range = $injector.instantiate(RangeFilter);
    return range.filter.bind(range);
  });
