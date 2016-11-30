namespace cashier.services {
    export class ConfigurationsService {
        private _configurations: ICashierPaymentsConfiguration;

        public set configurations(configurations: ICashierPaymentsConfiguration) {
            this._configurations = configurations;
        }

        public get orderId(): string {
            return this._configurations.orderId;
        }

        public get visitorId(): string {
            return this._configurations.visitorId;
        }

        public get appInstanceId(): string {
            return this._configurations.appInstanceId;
        }

        public get appDefId(): string {
            return this._configurations.appDefId;
        }

        public get useTermsAndConditions(): boolean {
            return this._configurations.useTermsAndConditions;
        }
    }

    angular
        .module('paymentAppInternal')
        .service('configurationsService', ConfigurationsService);
}
