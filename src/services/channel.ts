import { Injectable } from "@angular/core";
import { RemoteChannel, LocalChannel } from '../app/interfaces';
import { IdbService } from './idb';
import { ApiService } from './api';
import * as _ from 'lodash';

@Injectable()
export class ChannelService {

  constructor(private idb: IdbService, private api: ApiService) {

  }

  updateLocalChannels(): void {

    this.api.getChannels().subscribe(
      rchannels => {
        var remote_channels: RemoteChannel[] = _.map(rchannels, c=>{
          if (c.hasOwnProperty('term_id')) {
            c.id = c.term_id;
            delete c.term_id;
          }
          return c;
        });
        this.idb.getChannels().then(lchannels => {
          var local_channels: LocalChannel[] = lchannels;

          var toaddtolocfromrem = _.map(_.differenceBy(remote_channels, local_channels, 'id'), c => {
            c.subscribed = false;
            c.arn = c.topicarn;
            delete c.topicarn;
            return c;
          }); // to add to local from remote

          var toremfromloc = _.map(_.differenceBy(local_channels, remote_channels, 'id'), c => {
            return c.id;
          }); // to remote from local

          var toupdatelocnamefromrem = _.map(_.differenceBy(
            _.differenceBy(remote_channels, toaddtolocfromrem, 'id'),
            local_channels,
            'name'
          ), c => {
            c.subscribed = _.find(local_channels, { id: c.id }).subscribed;
            return c;
          });

          this.idb.addChannels(toaddtolocfromrem);
          this.idb.removeChannels(toremfromloc);
          this.idb.updateChannels(toupdatelocnamefromrem);

        });
      }
    );
  }

  getLocalChannels(): Promise<LocalChannel[]> {
    return this.idb.getChannels();
  }

  updateChannel(channel: LocalChannel): void {
    this.idb.updateChannel(channel);
  }

  async getSubscribedList(): Promise<number[]> {

    var result = this.idb.getChannels().then(channels => {
      return _.map(_.filter(channels, { subscribed: true }), c => {
        return c.id;
      });
    });

    return await result;
  }

}
