import { Dictionary } from './dictionary.interface.ts';
import { SubscriptionPointer } from './subscription-pointer.interface';

export interface BusEvent<T> {
  subscriptions: Dictionary<any[]>;
  subscriptionPointers: SubscriptionPointer[];
  unsubscribeTokens: any[];
  subscribe: (eventType: T, callback: (data: any) => any) => any;
  unsubscribe: (token: any) => void;
  publish: (eventType: T, data: any) => any;
}
