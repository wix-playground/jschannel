/// <reference path="../../../reference.ts" />
'use strict';

declare module jasmine {
  interface Matchers {
    toEqualData(expected: any): boolean;
    toHaveBeenCalledOnce(): boolean;
    toBeOneOf(...expected: any[]): boolean;
    toHaveClass(expected: string): boolean;
  }
}

beforeEach(function () {

  this.addMatchers({
    toEqualData: function (expected) {
      return angular.equals(this.actual, expected);
    },

    toHaveBeenCalledOnce: function () {
      if (arguments.length > 0) {
        throw new Error('toHaveBeenCalledOnce does not take arguments, use toHaveBeenCalledWith');
      }

      this.message = function () {
        var msg = 'Expected spy ' + this.actual.identity + ' to have been called once, but was ',
            count = this.actual.callCount;
        return [
          count === 0 ? msg + 'never called.' :
                        msg + 'called ' + count + ' times.',
          msg.replace('to have', 'not to have') + 'called once.'
        ];
      };

      return this.actual.callCount === 1;
    },

    toBeOneOf: function () {
      return Array.prototype.slice.call(arguments).indexOf(this.actual) !== -1;
    },

    toHaveClass: function (clazz) {
      this.message = function () {
        var msg = 'Expected \'' + angular.mock.dump(this.actual) + '\' to have class \'' + clazz + '\'.';
        return [msg, msg.replace('to have', 'not to have')];
      };
      return this.actual.hasClass ?
              this.actual.hasClass(clazz) :
              angular.element(this.actual).hasClass(clazz);
    }
  });
});
