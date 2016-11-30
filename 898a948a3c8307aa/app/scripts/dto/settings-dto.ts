'use strict';

interface ISettingsDTO {
  paymentMethods: IPaymentMethodDTO[];
  offlineText: IOfflineDTO;
}

interface IPaymentMethodDTO {
  paymentMethod: string;
  gatewayId: string;
}
