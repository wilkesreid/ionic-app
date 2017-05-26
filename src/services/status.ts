import { Injectable } from "@angular/core";

@Injectable()
export class StatusService {
  private statuses: any = {};

  constructor() {

  }

  status(name: string, status: string) {
    if (this.statuses.hasOwnProperty(name)) {
      this.statuses[name].status = status;
      if (this.statuses[name].callbacks.hasOwnProperty(status)) {
        for (var i=0;i<this.statuses[name].callbacks[status].length;i++) {
          this.statuses[name].callbacks[status][i]();
          delete(this.statuses[name].callbacks[status][i]);
        }
      }
    } else {
      this.statuses[name] = {
        status: status,
        callbacks: {}
      };
    }
  }

  when(name: string, status: string, callback: any) {
    if (this.statuses.hasOwnProperty(name)) {
      if (this.statuses[name].status == status) {
        callback();
      }

      if (this.statuses[name].callbacks.hasOwnProperty(status)) {
        this.statuses[name].callbacks[status].push(callback);
      } else {
        this.statuses[name].callbacks[status] = [callback];
      }
    } else {
      this.statuses[name] = {
        status: null,
        callbacks: {}
      };
      this.statuses[name].callbacks[status] = [callback];
    }
  }

  getStatus(name: string): string {
    return this.statuses[name].status;
  }

}
