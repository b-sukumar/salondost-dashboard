import { Stylist, Service, Booking } from './types';

export const stylists: Stylist[] = [
    { id: 's1', name: 'Rahul' },
    { id: 's2', name: 'Suresh' },
    { id: 's3', name: 'Priya' },
    { id: 's4', name: 'Ankit' },
    { id: 's5', name: 'Deepika' },
];

export const services: Service[] = [
    { id: 'v1', name: 'Haircut', price: 250 },
    { id: 'v2', name: 'Beard Trim', price: 100 },
    { id: 'v3', name: 'Facial', price: 500 },
    { id: 'v4', name: 'Shampoo', price: 150 },
    { id: 'v5', name: 'Hair Color', price: 800 },
];

export const bookings: Booking[] = [
    {
        id: 'b1',
        client_name: 'Amit Shah',
        client_phone: '9876543210',
        service_id: 'v1',
        staff_id: 's1',
        booking_date: '2026-01-28',
        booking_time: '10:00 AM',
        status: 'Completed',
    },
    {
        id: 'b2',
        client_name: 'Sanjay Dutt',
        client_phone: '9876543211',
        service_id: 'v2',
        staff_id: 's1',
        booking_date: '2026-01-28',
        booking_time: '11:30 AM',
        status: 'In-Progress',
    },
];
