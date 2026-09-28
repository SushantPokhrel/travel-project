# Guide Nepal Documentation

Guide Nepal is a full-stack travel guide hiring platform. Tourists can discover verified local guides, publish trip requests, receive offers, make bookings, and review completed trips. Guides can create a profile, complete verification, respond to public requests, and receive private requests from specific tourists. Administrators manage users, guide verification, and account access.

The platform is intentionally request and offer based. It does not use real-time chat or push notifications yet; private requests are delivered through the API and appear when the recipient loads or refreshes Travel Desk.

## Project Structure

```text
travel-project/
├── client/   React 19 + TypeScript + Vite + Tailwind CSS
└── server/   Node.js + Express + MongoDB/Mongoose
```

### Main Client Pages

- `/` - public landing page and open travel requests
- `/guides` - verified guide directory and private request modal
- `/templates` - Nepal travel package templates and available guides
- `/how-it-works` - platform explanation
- `/auth` - Google sign-in
- `/onboarding` - role and profile setup for new accounts
- `/dashboard` - authenticated dashboard redirect
- `/dashboard/travel-desk` - role-specific requests, offers, bookings, and guide actions
- `/dashboard/settings` - authenticated settings view
- `/dashboard/manage-users` - admin user list
- `/dashboard/verifications` - admin guide verification and activation controls



## Authentication and Access Control

Authentication uses Google Identity Services. After Google sign-in, the server creates or finds the user and stores a signed JWT in an HTTP-only `token` cookie. The client stores the returned user summary in Zustand.

New accounts start with the `pending` role. They must complete onboarding before using the dashboard:

1. Choose `tourist` or `guide`.
2. Provide a phone number.
3. Guides must upload an identity document and profile photo.
4. The selected role is saved on the user account.
5. Guide accounts receive a pending verification status and remain unavailable in the public verified-guide directory until approved.

Protected API routes use the JWT cookie. `restrictTo` limits routes to specific roles. Deactivated accounts cannot use protected routes, except guides whose verification is still pending or rejected so they can continue the verification process.

## Public Visitor Experience

Visitors do not need an account to:

- View the landing page.
- Browse the verified guide directory at `/guides`.
- Browse Nepal travel templates at `/templates`.
- View public open travel requests on the home page.
- Open the authentication page.

Visitors cannot create a travel request, send a private request, submit an offer, book a trip, or access dashboard pages. The home page shows a login prompt below the request list for visitors who want to post a request.

## Tourist Workflow

### 1. Sign In and Onboard

The tourist signs in with Google, selects the Tourist role during onboarding, and is redirected to the dashboard.

### 2. Discover Guides

The guide directory fetches verified guides from `GET /api/travel/guides`. Tourist-visible guide cards include:

- Name and profile image
- Location
- Rating and review count
- Experience and daily price
- Specialties and bio
- Contact/verification indicators

The directory also supports searching by guide name, region, or specialty.

### 3. Post a Public Travel Request

The tourist can post a request from the home page or Travel Desk. The form collects:

- Destination
- Start date
- End date
- Number of travelers
- Optional budget in NPR
- Trip details

The server requires a destination, dates, and at least one traveler. The end date cannot be earlier than the start date. Public requests are visible to guides and can receive offers.

### 4. Request One Specific Guide Privately

From a guide card, the tourist selects **Book Travel with this Guide**. A modal opens with the same trip fields as the Travel Desk request form and identifies the selected guide.

Submitting the modal creates a request with:

```text
isPrivate: true
guide: selected guide ID
tourist: logged-in tourist ID
```

Only the selected guide and the requesting tourist can retrieve the private request. Other guides and public visitors cannot see it. The request includes the destination, dates, travelers, budget, and details.

Demo-only mock guides shown when the API is unavailable cannot receive private requests because they do not have database IDs.

### 5. Review Offers and Book

Guides submit offers against a public request or an accepted private request. A tourist sees offers in Travel Desk and can accept one. Accepting an offer:

1. Creates one booking for the request.
2. Rejects other offers for the same request.
3. Marks the selected offer as accepted.
4. Marks the travel request as booked.

The current payment flow is a mock payment action. A tourist can pay a booking that is awaiting payment, which changes it to confirmed.

### 6. Complete and Review a Trip

After the guide marks a confirmed booking completed, the tourist can submit a rating from 1 to 5 and a comment. A booking can have only one review. The review belongs to the tourist, guide, and booking.

## Guide Workflow

### 1. Create a Guide Profile

The guide submits profile information from Travel Desk:

- Location
- Price per day
- Languages
- Specialties
- Bio

Submitting the profile sets guide verification to `pending` and deactivates the guide until an administrator reviews the account.

### 2. Complete Verification

During onboarding, a guide uploads:

- Citizenship or identity document: PDF, JPG, JPEG, or PNG, up to 1 MB
- Professional profile photo: JPG, JPEG, or PNG, up to 1 MB

Files are uploaded to Cloudinary. The guide must be approved by an administrator before appearing in the verified guide directory or being selected for private requests.

### 3. Receive Private Requests

Private requests addressed to the guide appear in the guide's Travel Desk under **Private requests for you**. The guide can:

- Accept the request, changing its status to `accepted`.
- Reject the request and make it public.

When rejected, the server clears the selected guide, sets `isPrivate` to `false`, and returns the request to the public `open` state. It then becomes visible to other guides through the normal public request list.

There is no real-time notification. The guide sees the request after Travel Desk loads or refreshes its data.

### 4. Submit Offers

The guide can submit a price offer for a public request. For a private request, only the selected guide can submit an offer, and only after the request has been accepted. The existing offer flow is then used by the tourist to accept or reject the offer.

### 5. Complete Booked Trips

After a tourist pays and the booking becomes confirmed, the guide can mark the trip completed. The tourist can then review the guide.

## Administrator Workflow

Administrators have two dashboard tools.

### Manage Users

`Manage Users` lists all non-admin accounts with:

- Username and email
- Role
- Phone number
- Active/inactive status
- Joined date

Administrator accounts are hidden from this list.

### Guide Verifications

`Verifications` lists guide accounts and their submitted profile information. An administrator can:

- Review the guide's identity document.
- Review profile photo, location, phone, and bio.
- Approve a pending guide.
- Reject a pending guide.
- Activate a verified guide.
- Deactivate an active guide.

The public guide endpoint returns guides with a verified guide profile. Protected operations also require an active account, so a guide must be both verified and active to participate normally in the guide marketplace.

## Travel Request States

Travel requests use the following statuses:

| Status      | Meaning                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `open`      | Available for guides to view and respond to.                               |
| `offered`   | At least one guide has submitted an offer.                                 |
| `accepted`  | A selected guide accepted a private request; that guide can send an offer. |
| `booked`    | The tourist accepted an offer and a booking was created.                   |
| `completed` | The guide completed the booking.                                           |
| `cancelled` | Reserved status for cancelled requests.                                    |

The `isPrivate` flag is independent of the status. A private request also stores the selected `guide` reference. Rejection changes the flag to `false`, removes the guide reference, and makes the request public.

## API Overview

All client API paths are relative to the configured `VITE_BASE_URL_API`, normally `/api` on the server.

### Authentication

| Method | Path                   | Access        | Purpose                                                 |
| ------ | ---------------------- | ------------- | ------------------------------------------------------- |
| `POST` | `/auth/google/sign-in` | Public        | Sign in or register with Google.                        |
| `POST` | `/auth/onboarding`     | Authenticated | Save role, phone, identity document, and profile photo. |
| `GET`  | `/auth/me`             | Authenticated | Load the current user.                                  |
| `GET`  | `/auth/users`          | Admin         | List non-admin users.                                   |
| `POST` | `/auth/logout`         | Public        | Clear the authentication cookie.                        |

### Guides and Travel Requests

| Method  | Path                                  | Access           | Purpose                                                |
| ------- | ------------------------------------- | ---------------- | ------------------------------------------------------ |
| `GET`   | `/travel/guides`                      | Public           | List verified guides.                                  |
| `GET`   | `/travel/requests`                    | Public           | List non-private open/offered requests.                |
| `POST`  | `/travel/requests`                    | Tourist          | Create a public travel request.                        |
| `GET`   | `/travel/private-requests`            | Tourist or guide | Return private requests belonging to the current user. |
| `POST`  | `/travel/private-requests`            | Tourist          | Create a private request for one verified guide.       |
| `PATCH` | `/travel/private-requests/:requestId` | Selected guide   | Accept or reject a private request.                    |
| `POST`  | `/travel/requests/:requestId/offers`  | Guide            | Submit an offer.                                       |
| `GET`   | `/travel/offers`                      | Tourist or guide | Load offers relevant to the current user.              |

### Booking and Reviews

| Method | Path                                   | Access           | Purpose                               |
| ------ | -------------------------------------- | ---------------- | ------------------------------------- |
| `POST` | `/travel/offers/:offerId/accept`       | Tourist          | Accept an offer and create a booking. |
| `GET`  | `/travel/bookings`                     | Tourist or guide | List the user's bookings.             |
| `POST` | `/travel/bookings/:bookingId/pay`      | Tourist          | Complete the mock payment.            |
| `POST` | `/travel/bookings/:bookingId/complete` | Guide            | Mark a confirmed trip completed.      |
| `POST` | `/travel/bookings/:bookingId/review`   | Tourist          | Review a completed trip.              |

### Administration

| Method  | Path                            | Access | Purpose                         |
| ------- | ------------------------------- | ------ | ------------------------------- |
| `GET`   | `/admin/verifications`          | Admin  | List guide profiles for review. |
| `PATCH` | `/admin/verifications/:guideId` | Admin  | Approve or reject a guide.      |
| `PATCH` | `/admin/users/:userId/active`   | Admin  | Activate or deactivate a guide. |

## Data Model Summary

### User

Users have a role, account status, optional phone/profile image/identity document, and an embedded guide profile. Guide profiles contain location, bio, languages, specialties, daily price, verification status, rating, and review count.

### Travel Request

A request belongs to a tourist and may target one guide. It stores trip requirements, status, and the `isPrivate` visibility flag.

### Offer

An offer belongs to one request and one guide. It contains a price, optional message, and `pending`, `accepted`, or `rejected` status. A request-guide pair is unique, so a guide cannot offer twice on the same request.

### Booking

A booking connects one request, offer, tourist, and guide. It stores the amount, payment status, booking status, and completion date. Each request can have only one booking.

### Review

A review belongs to one completed booking, tourist, and guide. The rating must be between 1 and 5, and each booking can be reviewed once.

## Operational Notes

- Cookies are used for authentication and API requests send credentials with `credentials: "include"`.
- CORS is configured from `FRONTEND_URL` and allows credentials.
- Cloudinary stores uploaded guide identity and profile images.
- The public guide list contains only guides with verified guide profiles; the server also checks account activity for protected access.
- Private requests are static API records, not real-time messages. Refreshing Travel Desk reloads them.
- Payment is currently a mock state transition; no external payment provider is connected.
- The server currently has no automated test script; use client build, server syntax checks, and manual role-based flow testing during development.
