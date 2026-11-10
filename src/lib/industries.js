export const INDUSTRIES = [
  {
    slug: 'restaurants',
    name: 'Restaurants',
    kicker: 'Illustrative workflow',
    headline: 'From catering inquiry to a useful sales conversation.',
    focus: 'Catering, private dining, and group reservations',
    intro:
      'A guest opens your catering page or submits a group-dining inquiry. The site should answer the questions that decide the booking, then hand the request to the person who owns catering.',
    captures: ['Event date and service location', 'Guest count and service needs', 'Preferred contact time', 'Dietary or menu requirements'],
    next: 'Record the inquiry under the restaurant campaign, review the request, and hand it to the staff member responsible for catering or group dining.',
    review: 'Inquiry source, qualified handoffs, staff follow-up, and campaign costs.',
  },
  {
    slug: 'pubs',
    name: 'Pubs',
    kicker: 'Illustrative workflow',
    headline: 'From a private event request to a booked date.',
    focus: 'Private parties, group events, and event space',
    intro:
      'Someone planning a party or a group night needs capacity, availability, and food details before they call. The form should collect what your team needs to quote.',
    captures: ['Preferred date and backup date', 'Group size and space needs', 'Food and drink expectations', 'Decision-maker contact details'],
    next: 'Route the request to the manager on duty and keep the reply history tied to the same campaign.',
    review: 'Requests received, dates confirmed, and follow-up speed.',
  },
  {
    slug: 'pizza-shops',
    name: 'Pizza Shops',
    kicker: 'Illustrative workflow',
    headline: 'From a group order inquiry to a repeat customer.',
    focus: 'Team lunches, event catering, and repeat group orders',
    intro:
      'Group orders arrive by phone, text, and your site. Collect the order details in one place so nothing is lost between shifts.',
    captures: ['Headcount and quantity', 'Pickup or delivery window', 'Ordering contact and organization', 'Repeat order notes'],
    next: 'Confirm the order with the shop team and record the organization so the next group order starts from known details.',
    review: 'Group orders, repeat organizations, and delivery windows used.',
  },
  {
    slug: 'contractors',
    name: 'Contractors & services',
    kicker: 'Illustrative workflow',
    headline: 'From an estimate request to a scheduled job.',
    focus: 'Estimates, service areas, and project details',
    intro:
      'Homeowners compare several contractors before calling. Your site should show the work, the service area, and an easy estimate path that captures what the job actually is.',
    captures: ['Project type and scope', 'Property location and service area', 'Timeline and budget range', 'Photos or reference details'],
    next: 'Qualify the request, set expectations on scheduling, and hand it to the estimator with the job details attached.',
    review: 'Estimate requests, qualified jobs, and follow-up tasks completed.',
  },
  {
    slug: 'landscaping',
    name: 'Landscaping & outdoor services',
    kicker: 'Illustrative workflow',
    headline: 'From a seasonal inquiry to a recurring contract.',
    focus: 'Seasonal maintenance, installs, and recurring service',
    intro:
      'Outdoor-services work is seasonal and route-driven. Capture the property details up front so quotes and routes make sense.',
    captures: ['Property type and size', 'Services wanted and frequency', 'Preferred season and start window', 'Access and site notes'],
    next: 'Group the request into the right route and season, then hand it to the crew lead with the property details.',
    review: 'Requests by service, recurring contracts signed, and route coverage.',
  },
  {
    slug: 'professional-services',
    name: 'Professional practices',
    kicker: 'Illustrative workflow',
    headline: 'From a qualified inquiry to a consultation.',
    focus: 'Consultations, retainers, and referral sources',
    intro:
      'Professional practices need to explain expertise clearly and screen inquiries before a consultation is scheduled.',
    captures: ['What the client needs help with', 'Timing and urgency', 'How they found you', 'Best way and time to reach them'],
    next: 'Review the inquiry, confirm it fits your practice, and hand it to the right professional with the client context.',
    review: 'Inquiry quality, consultation bookings, and referral sources.',
  },
  {
    slug: 'service-companies',
    name: 'Service companies',
    kicker: 'Illustrative workflow',
    headline: 'From an urgent call to a dispatched job.',
    focus: 'Emergency requests, dispatch, and service agreements',
    intro:
      'Urgent service requests need immediate contact options and clean dispatch details, while planned work can go through a longer intake.',
    captures: ['Service address and urgency', 'Problem description', 'Access instructions', 'Service agreement status'],
    next: 'Route urgent requests to dispatch, and hand planned work to the scheduling team.',
    review: 'Response time, dispatch records, and agreement renewals.',
  },
  {
    slug: 'stores-ecommerce',
    name: 'Stores & ecommerce',
    kicker: 'Illustrative workflow',
    headline: 'From product discovery to a repeat purchase.',
    focus: 'Catalog, checkout, and post-purchase follow-up',
    intro:
      'Stores win on product clarity, a usable mobile checkout, and follow-up that brings buyers back.',
    captures: ['Product interest and questions', 'Cart and checkout completion', 'Delivery preferences', 'Restock and reorder interest'],
    next: 'Connect product questions to the inbox, and connect order data to follow-up campaigns.',
    review: 'Product page performance, checkout completion, and repeat orders.',
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    kicker: 'Illustrative workflow',
    headline: 'From a reservation question to a confirmed booking.',
    focus: 'Reservations, events, and guest communication',
    intro:
      'Guests ask the same questions before booking. Answer them on the page, then capture the booking details in one place.',
    captures: ['Party size and date', 'Occasion and special requests', 'Contact details', 'How they found you'],
    next: 'Confirm availability with the host team and keep the conversation attached to the campaign.',
    review: 'Reservation requests, confirmed bookings, and guest follow-up.',
  },
];

export function industryBySlug(slug) {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}