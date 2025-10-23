import { store, generateId, findListingById } from "../data/store.js";

const toListingResponse = (listing) => ({
        ...listing,
        price: {
                ...listing.price,
                amount: Number(listing.price.amount),
        },
});

export const getListings = async (req, res) => {
        return res.status(200).json({
                success: true,
                data: store.listings.map(toListingResponse),
        });
};

export const createListing = async (req, res) => {
        const payload = req.body || {};
        const listing = {
                id: generateId("listing"),
                title: payload.title || "Untitled listing",
                description: payload.description || "",
                location: {
                        city: payload.location?.city || "",
                        country: payload.location?.country || "",
                        address: payload.location?.address || "",
                },
                price: {
                        amount: payload.price?.amount ?? 0,
                        currency: payload.price?.currency || "USD",
                },
                images: Array.isArray(payload.images) ? payload.images : [],
                amenities: Array.isArray(payload.amenities) ? payload.amenities : [],
                rating: payload.rating ?? null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
        };

        store.listings.unshift(listing);

        return res.status(201).json({
                success: true,
                data: toListingResponse(listing),
        });
};

export const getListingById = async (req, res) => {
        const listing = findListingById(req.params.id);

        if (!listing) {
                return res.status(404).json({
                        success: false,
                        message: "Listing not found",
                });
        }

        return res.status(200).json({
                success: true,
                data: toListingResponse(listing),
        });
};

export const updateListing = async (req, res) => {
        const listing = findListingById(req.params.id);

        if (!listing) {
                return res.status(404).json({
                        success: false,
                        message: "Listing not found",
                });
        }

        const payload = req.body || {};

        listing.title = payload.title ?? listing.title;
        listing.description = payload.description ?? listing.description;
        listing.location = {
                ...listing.location,
                ...(payload.location || {}),
        };
        listing.price = {
                ...listing.price,
                ...(payload.price || {}),
        };
        listing.images = Array.isArray(payload.images) ? payload.images : listing.images;
        listing.amenities = Array.isArray(payload.amenities) ? payload.amenities : listing.amenities;
        listing.rating = payload.rating ?? listing.rating;
        listing.updatedAt = new Date().toISOString();

        return res.status(200).json({
                success: true,
                data: toListingResponse(listing),
        });
};

export const deleteListing = async (req, res) => {
        const listingIndex = store.listings.findIndex((listing) => listing.id === req.params.id);

        if (listingIndex === -1) {
                return res.status(404).json({
                        success: false,
                        message: "Listing not found",
                });
        }

        const [removed] = store.listings.splice(listingIndex, 1);

        store.reservations = store.reservations.filter((reservation) => reservation.listingId !== removed.id);

        return res.status(200).json({
                success: true,
                message: "Listing removed",
        });
};
