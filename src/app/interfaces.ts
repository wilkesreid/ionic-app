import { SafeHtml } from '@angular/platform-browser';

export interface OEmbedVideo {
  height: number;
  html: string;
  safeHtml?: SafeHtml;
  provider_name: string;
  provider_url: string;
  type: string;
  uri: string;
  version: string;
  video_id: number;
  width: number;
}
export interface Story {
  id: number;
  title: string;
  date: string;
  content: string;
  image_url?: string;
  video_id: string;
  video?: any;
  category?: string;
}
export interface RemoteChannel {
  term_id: number;
  name: string;
  slug: string;
  topicarn: string;
}
export interface LocalChannel {
  id: number,
  name: string,
  slug: string,
  arn: string,
  subscribed: boolean
}
export interface AwsEndpointResponse {
  success: boolean,
  EndpointArn: string,
  username: string,
  access_key: string,
  secret_key: string
}
export interface AwsUser {
  username: string;
  access_key: string;
  secret_key: string;
}
export interface Subscription {
  subscriptionarn: string;
  channel: number;
}
