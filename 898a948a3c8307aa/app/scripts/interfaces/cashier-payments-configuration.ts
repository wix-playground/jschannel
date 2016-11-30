interface ICashierPaymentsConfiguration {
  appDefId: string;
  appInstanceId: string;
  orderId: string;
  visitorId: string;
  useExternalPayButton?: boolean;
  payWith?: string;
  customCss?: string;
  externalSubmitButton?: boolean;
  useTermsAndConditions?: boolean;
  hideOfflinePaymentButton?: boolean;
}
