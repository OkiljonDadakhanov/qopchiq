import { randomUUID } from "crypto";

const now = () => new Date().toISOString();

export const store = {
        listings: [
                {
                        id: "listing-1",
                        title: "Qopchiq Loft",
                        description: "A bright loft apartment in the heart of Tashkent, perfect for working sessions and quick stays.",
                        location: {
                                city: "Tashkent",
                                country: "Uzbekistan",
                                address: "Amir Temur Avenue 12",
                        },
                        price: {
                                amount: 120,
                                currency: "USD",
                        },
                        images: [
                                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
                        ],
                        amenities: ["Wi-Fi", "Workspace", "Air conditioning"],
                        rating: 4.8,
                        createdAt: now(),
                        updatedAt: now(),
                },
                {
                        id: "listing-2",
                        title: "Samarkand Boutique Stay",
                        description: "Traditional style boutique room near Registan with complimentary breakfast.",
                        location: {
                                city: "Samarkand",
                                country: "Uzbekistan",
                                address: "Registan Street 7",
                        },
                        price: {
                                amount: 85,
                                currency: "USD",
                        },
                        images: [
                                "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80",
                        ],
                        amenities: ["Breakfast", "Parking", "Guide assistance"],
                        rating: 4.6,
                        createdAt: now(),
                        updatedAt: now(),
                },
        ],
        reservations: [
                {
                        id: "reservation-1",
                        listingId: "listing-1",
                        guestName: "Aziza Karimova",
                        guestEmail: "aziza@example.com",
                        guests: 2,
                        startDate: "2024-10-01",
                        endDate: "2024-10-05",
                        status: "pending",
                        createdAt: now(),
                        updatedAt: now(),
                },
        ],
};

export const generateId = (prefix) => `${prefix}-${randomUUID()}`;

export const findListingById = (id) => store.listings.find((listing) => listing.id === id);
export const findReservationById = (id) => store.reservations.find((reservation) => reservation.id === id);
