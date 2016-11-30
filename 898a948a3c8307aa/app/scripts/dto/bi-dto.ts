'use strict';

class BiDTO {

  public evid: number;

  public appId: string;
  public appInstanceId: string;
  public orderSnapshotId: string;
  public visitorId: string;

  public transactionStatus: string;
  public paymentProvider: string;
  public paymentMethodType: string;
  public status: boolean;
  public payWith: string;
  public pageType: string;
  public source: string;
  public paymentCategory: string;
  public errorDesc: string;

  constructor(configuration: ICashierPaymentsConfiguration) {
    this.appId = configuration.appDefId;
    this.appInstanceId = configuration.appInstanceId;
    this.orderSnapshotId = configuration.orderId;
    this.visitorId = configuration.visitorId;
  }
}
