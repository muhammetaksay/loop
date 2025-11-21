import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebaseService';

export interface PaymentNotification {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    currency: string;
    method: 'IBAN';
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}

/**
 * Send payment notification
 */
export const sendPaymentNotification = async (
    userId: string,
    userName: string,
    userEmail: string
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'paymentNotifications'), {
            userId,
            userName,
            userEmail,
            amount: 9.99,
            currency: 'USD', // Or TRY
            method: 'IBAN',
            status: 'pending',
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    } catch (error: any) {
        console.error('Send payment notification error:', error);
        throw new Error(error.message);
    }
};
