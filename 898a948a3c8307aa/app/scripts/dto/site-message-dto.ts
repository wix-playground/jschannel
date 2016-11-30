'use strict';

class SiteMessageDTO {

  public transactionKey: string;

  constructor(public eventType: string, public height?: number) {
  }
}
