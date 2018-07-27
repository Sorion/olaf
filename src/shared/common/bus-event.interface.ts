import { Dictionary } from './dictionary.interface.ts';
import { SubscriptionPointer } from './subscription-pointer.interface';

export interface BusEvent<T> {
    subscriptions: Dictionary<Array<any>>;
    subscriptionPointers: Array<SubscriptionPointer>;
    unsubscribeTokens: Array<any>;
    subscribe: (eventType: T, callback: (data: any) => any) => object;
    unsubscribe: (token: object) => void;
    publish: (eventType: T, data: any) => any;
}
