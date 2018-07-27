import { BusEvent } from './bus-event.interface';
import { Dictionary } from './dictionary.interface.ts';
import { SubscriptionPointer } from './subscription-pointer.interface';

export abstract class StringBusEvent implements BusEvent<string> {

    subscriptions: Dictionary<Array<any>> = {};
    subscriptionPointers: Array<SubscriptionPointer> = [];
    unsubscribeTokens: Array<any> = [];

    public subscribe(eventType: string, callback: (data: any) => any): object {
        if (typeof eventType !== 'string') {
            throw new Error('Event type must be a string');
        }

        if (!this.subscriptions[eventType]) {
            this.subscriptions[eventType] = [];
        }
        this.subscriptions[eventType].push(callback);

        // package and return an unsubscribe token.
        const subscriptionPointer: SubscriptionPointer = {
            eventType,
            callbackIndex: this.subscriptions[eventType].length - 1,
        };
        const i = this.subscriptionPointers.length;
        const unsubscribeToken = {};
        this.subscriptionPointers[i] = subscriptionPointer;
        this.unsubscribeTokens[i] = unsubscribeToken;
        return unsubscribeToken;
    }

    public unsubscribe(token: object): void {
        const subscriptionPointer = this.subscriptionPointers[this.unsubscribeTokens.indexOf(token)];
        this.subscriptions[subscriptionPointer.eventType][subscriptionPointer.callbackIndex] = null;
    }
    publish(eventType: string, data: any): any {
        if (typeof eventType !== 'string') {
            throw new Error('Event type must be a string');
        }
        let i: number;
        const length = this.subscriptions[eventType].length;
        let callback: (data: any) => any;

        if (this.subscriptions[eventType]) {
            for (i = 0; i < length; i++) {
                callback = this.subscriptions[eventType][i];
                if (callback) {
                    callback(data);
                }
            }
        }
    }
}
