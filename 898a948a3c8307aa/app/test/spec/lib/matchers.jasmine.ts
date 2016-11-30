'use strict';

declare module jasmine {
  interface Matchers {
    toMatchBiUrl(expected: any): boolean;
    toMatchBiUrl(expected: any): { pass: boolean };

    toEqualData(expected: any): boolean;
    toHaveBeenCalledOnce(): boolean;
    toBeOneOf(...expected: any[]): boolean;
    toHaveClass(expected: string): boolean;
    toHaveExactText(expected: string): boolean;
    toHaveExactSrc(expected: string): boolean;

    toBeDisabled(): boolean;
    toBePresent(): boolean;
  }
}

beforeEach(() => {
  jasmine.addMatchers({
    toEqualData: () => ({
      compare: (actual, expected) => {
        return {pass: angular.equals(actual, expected)};
      }
    }),

    toHaveBeenCalledOnce: () => ({
      compare: (actual) => {
        let msg = 'Expected spy ' + actual.identity + ' to have been called once, but was ',
          count = actual.calls.count();
        if (count === 1) {
          return {pass: true, message: msg.replace('to have', 'not to have') + 'called once.'};
        } else {
          return {
            pass: false, message: count === 0 ? msg + 'never called.' :
            msg + 'called ' + count + ' times.'
          };
        }
      }
    }),

    toBeOneOf: () => ({
      compare: (actual, ...expected) => {
        return {pass: expected.indexOf(actual) !== -1};
      }
    }),

    toHaveClass: () => ({
      compare: (actual, expected) => {
        let msg = 'Expected \'' + angular.mock.dump(this.actual) + '\' to have class \'' + expected + '\'.';
        let pass = actual.hasClass ? actual.hasClass(expected) : angular.element(actual).hasClass(expected);
        return {pass, message: pass ? msg.replace('to have', 'not to have') : msg};
      }
    }),

    toHaveExactText: () => ({
      compare: (actual, expected) => {
        let msg = `Expected '${actual.text()}' to equal to '${expected}'`;
        let pass = actual.text() === expected;
        return {
          pass: pass,
          message: pass ? msg.replace('to equal', 'not to equal') : msg
        };
      }
    }),

    toBePresent: () => ({
      compare: (actual: ng.IAugmentedJQuery, expected) => {
        let msg = `Expected '${actual}' to be present`;
        let pass = actual.length === 1;
        return {
          pass: pass,
          message: pass ? msg.replace('to be present', 'not to be present') : msg
        };
      }
    }),

    toHaveExactSrc: () => ({
      compare: (actual, expected) => {
        let msg = `Expected '${actual.attr('src')}' to equal to '${expected}'`;
        let pass = actual.attr('src') === expected;
        return {
          pass: pass,
          message: pass ? msg.replace('to equal', 'not to equal') : msg
        };
      }
    }),

    toBeDisabled: () => ({
      compare: (actual, expected) => {
        let msg = `Expected '${actual}' to be disabled`;
        let pass = actual.attr('disabled') === 'disabled';
        return {
          pass: pass,
          message: pass ? msg.replace('to be disabled', 'to be enabled') : msg
        };
      }
    })
  });
});
