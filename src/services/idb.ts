import { Injectable } from "@angular/core";
import { LocalChannel, AwsUser, Subscription } from '../app/interfaces';
//import * as _ from 'lodash';

declare var Dexie: any;
declare let Keychain:any;

@Injectable()
export class IdbService {
  idb: any;
  constructor() {
    Dexie.debug = true;
    this.idb = new Dexie("BG");
    this.idb.version(1).stores({
        channels: 'id,name,slug,arn,subscribed',
        endpoint: 'endpointarn',
        subscriptions: 'subscriptionarn,channel',
        user: 'username,access_key,secret_key',
        auth: 'token'
    });
    this.idb.open().catch ((err) => {
        console.error('Failed to open db: ' + (err.stack || err));
    });
  }

  hasToken(): Promise<boolean> {
    return this.idb.auth.count();
  }

  setToken(token: string): void {
    this.idb.auth.clear();
    this.idb.auth.add({
      token: token
    });
  }

  deleteToken(): Promise<any> {
    return this.idb.auth.clear();
  }

  async getToken(): Promise<string> {
    var row = await this.idb.auth.toCollection().first();
    return row.token;
  }

  addChannels(channels: LocalChannel[]): void {
    this.idb.channels.bulkAdd(channels);
  }

  removeChannels(channel_ids: number[]): void {
    this.idb.channels.bulkDelete(channel_ids);
  }

  storeEndpoint(endpoint: string): void {
    this.idb.endpoint.put({ endpointarn: endpoint });
  }

  storeUser(obj: AwsUser): void {
    this.idb.user.put(obj);
  }

  storeChannel(obj: LocalChannel): void {
    this.idb.channels.put(obj);
  }

  getChannels(): Promise<LocalChannel[]> {
    return this.idb.channels.toArray();
  }

  updateChannels(channels: LocalChannel[]): void {
    this.idb.channels.bulkPut(channels);
  }

  updateChannel(channel: LocalChannel): void {
    this.idb.channels.update(channel.id, channel);
  }

  getAwsEndpoint(callback): string {
    return this.idb.endpoint.toCollection().first(callback);
  }

  storeSubscription(subscription: Subscription): void {
    this.idb.subscriptions.put(subscription);
  }

  deleteSubscription(subscription: Subscription): void {
    this.idb.subscriptions.delete(subscription.subscriptionarn);
  }

  getSubscriptionByChannel(channel: LocalChannel): Promise<Subscription> {
    return this.idb.subscriptions.where('channel').equals(channel.id).first();
  }

  awsUserExists(): Promise<boolean> {
    return this.idb.user.toCollection().count(size => {
      if (size < 1) {
        return false;
      } else {
        return true;
      }
    });
  }

  getAwsUser(): Promise<AwsUser> {
    return this.idb.user.toCollection().first();
  }
}
