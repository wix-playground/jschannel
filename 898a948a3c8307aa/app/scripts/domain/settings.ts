'use strict';

class Settings {

  paymentMethods: PaymentMethod[] = [];
  offlineVM: OfflineVM = new OfflineVM();

  constructor(settingsDTO: ISettingsDTO, $sce: ng.ISCEService, $translate, CashierPaymentMethodConstants: CashierPaymentMethodConstants) {
    settingsDTO.paymentMethods.forEach((paymentMethodDTO) => {
      this.paymentMethods.push(this.createNewPaymentMethod(paymentMethodDTO));
    });

    if (this.isPaymentMethodVisible(CashierPaymentMethodConstants.OFFLINE)) {
      this.offlineVM.titleTranslationId = settingsDTO.offlineText.titleId;

      if (!settingsDTO.offlineText.text) {
        let defaultOfflineInstructionText = $translate('payments.offline.defaultInstructionText');
        this.offlineVM.instructionsHtml = $sce.trustAsHtml(defaultOfflineInstructionText);
      } else {
        this.offlineVM.instructionsHtml = $sce.trustAsHtml(settingsDTO.offlineText.text);
      }
    }
  }

  createNewPaymentMethod(paymentMethodDTO): PaymentMethod {
    return new PaymentMethod(paymentMethodDTO);
  }

  isOnlyOnePaymentMethodExists(): boolean {
    return this.paymentMethods.length === 1;
  }

  getNumberOfVisiblePaymentMethods(): number {
    return this.paymentMethods.length;
  }

  isPaymentMethodVisible(paymentMethod: string): boolean {
    return (this.paymentMethods.filter((payment) => {
      return (payment.paymentMethod === paymentMethod);
    }).length > 0);
  }
}

class PaymentMethod {
  paymentMethod: string;
  selected: boolean = false;

  constructor(paymentMethodDTO: IPaymentMethodDTO) {
    this.paymentMethod = paymentMethodDTO.paymentMethod;
  }
}

class OfflineVM {
  public titleTranslationId: string;
  public instructionsHtml: string;
}
