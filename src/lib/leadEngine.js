export const WORKSPACE_FEATURES = [
  {
    n: '01',
    title: 'Customers & company profiles',
    body: 'Keep the business, website, contact people, and customer details together, and reuse saved information for the next campaign.',
  },
  {
    n: '02',
    title: 'Campaign planning & territories',
    body: 'Start with the customer, industry, offer, desired lead volume, schedule, and requested communication channels.',
  },
  {
    n: '03',
    title: 'Lead sourcing & contact review',
    body: 'Review records, targeting fit, and contact readiness before anything moves to outreach.',
  },
  {
    n: '04',
    title: 'Inbox & assisted conversations',
    body: 'Keep campaign replies and context together, with employee-reviewed reply drafts where AI service is configured.',
  },
  {
    n: '05',
    title: 'Qualified leads & team handoffs',
    body: 'Capture what the prospect needs and their agreement to be contacted, then hand the opportunity to the right person.',
  },
  {
    n: '06',
    title: 'Campaign costs & history',
    body: 'Recorded operating costs, lead delivery history, and customer records reviewed in the same workspace.',
  },
  {
    n: '07',
    title: 'Controlled outreach',
    body: 'Prepare email, SMS, and calling batches around reviewed content and contact readiness. The team controls activation and sending.',
  },
  {
    n: '08',
    title: 'Team & workspace control',
    body: 'Authorized employees get a private workspace. Administrators manage accounts, setup, and operational status.',
  },
];

export const CAMPAIGN_STEPS = [
  {
    n: '1',
    title: 'Plan the campaign',
    body: 'Choose the customer, industry, territory, offer, schedule, lead goal, and requested channels.',
  },
  {
    n: '2',
    title: 'Prepare and review',
    body: 'Configure the source or import, prepare messaging, and review lead and contact readiness.',
  },
  {
    n: '3',
    title: 'Manage conversations',
    body: 'Review replies, clarify the need, and keep the conversation connected to its campaign.',
  },
  {
    n: '4',
    title: 'Hand off and measure',
    body: 'Deliver qualified opportunities to the right person, then review history, costs, and records.',
  },
];

export const EXAMPLE_CAMPAIGNS = [
  {
    name: 'Restaurant catering inquiries',
    customer: 'Example · Restaurant customer',
    industry: 'Restaurants',
    offer: 'Office lunches and private dining',
    status: 'current',
    summary: 'Review catering requests and confirm dates with the restaurant team.',
    captures: ['Event date and service location', 'Guest count and service needs', 'Preferred contact time'],
  },
  {
    name: 'Pub private-event bookings',
    customer: 'Example · Pub customer',
    industry: 'Pubs',
    offer: 'Private parties and group events',
    status: 'draft',
    summary: 'Set the service area, qualification questions, and campaign schedule.',
    captures: ['Preferred date and group size', 'Space and food needs', 'Decision-maker contact'],
  },
  {
    name: 'Pizza shop group orders',
    customer: 'Example · Pizza shop customer',
    industry: 'Pizza Shops',
    offer: 'Team lunches and event catering',
    status: 'past',
    summary: 'Review the campaign history and use the findings to plan the next offer.',
    captures: ['Headcount and quantity', 'Pickup or delivery window', 'Repeat order notes'],
  },
  {
    name: 'Contractor estimate requests',
    customer: 'Example · Contractor customer',
    industry: 'Contractors & services',
    offer: 'Seasonal install and repair estimates',
    status: 'current',
    summary: 'Qualify estimate requests by project type and service area before scheduling.',
    captures: ['Project type and scope', 'Property location', 'Timeline and budget range'],
  },
  {
    name: 'Landscaping spring contracts',
    customer: 'Example · Landscaping customer',
    industry: 'Landscaping & outdoor services',
    offer: 'Seasonal maintenance contracts',
    status: 'past',
    summary: 'Use last season’s request volume to plan route coverage and crew capacity.',
    captures: ['Property size and services', 'Frequency and start window', 'Access notes'],
  },
  {
    name: 'Store reorder follow-up',
    customer: 'Example · Online store customer',
    industry: 'Stores & ecommerce',
    offer: 'Reorder reminders and product questions',
    status: 'draft',
    summary: 'Prepare reorder follow-up around buyers who asked product questions.',
    captures: ['Product interest', 'Delivery preferences', 'Restock timing'],
  },
];

export const CHANNEL_OPTIONS = ['Email', 'SMS', 'Calling', 'Social', 'Direct mail'];