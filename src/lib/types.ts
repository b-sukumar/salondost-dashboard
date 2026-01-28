export type Status = 'Completed' | 'In-Progress' | 'Pending';

export interface Stylist {
    id: string;
    name: string;
    salon_id?: string;
}

export interface Service {
    id: string;
    name: string;
    price: number;
    salon_id?: string;
}

export interface Booking {
    id: string;
    client_name: string;
    client_phone: string;
    service_id: string;
    staff_id: string;
    booking_date: string;
    booking_time: string;
    status: Status;
    salon_id?: string;
}

export interface DashboardStats {
    totalCollection: number;
    pendingBookingsCount: number;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    salon_id?: string;
    created_at?: string;
}
