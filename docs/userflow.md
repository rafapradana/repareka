# Repareka - Detailed User Flows

## Access Control
- **Customer**: Akses melalui homepage utama
- **Mitra**: Akses melalui link "Daftar sebagai Mitra" di halaman profil user atau langsung ke `/mitra`
- **Admin**: Akses khusus melalui URL `/admin/baksomalang`

---

## 👥 CUSTOMER USER FLOWS

### Flow 1: First Time Visit (Guest Mode)
```
Homepage 
↓
Browse Categories (Electronics, Furniture, Clothing, etc.)
↓
Apply Filters (Location, Price Range, Rating, Availability)
↓
View Service Mitra List
↓
Click Service Mitra Profile
↓
View Mitra Details (Read-only)
  - Services offered
  - Portfolio photos
  - Reviews and ratings
  - Pricing information
  - Location and availability
↓
[BARRIER] Sign Up Required for:
  - Booking services
  - Chatting with provider
  - Leaving reviews
  - Saving favorites
↓
Click "Sign Up to Book"
↓
Registration Form
  - Email
  - Full name
  - Password
  - Location (multiple selection(dropdown): provinsi, kota/kabupaten)
↓
Email Verification
↓
Complete Profile Setup
  - Profile photo
  - Address details
  - Preferences
↓
Redirect back to Service Mitra
↓
Now can access booking features
```

### Flow 2: Booking Service (Registered User)
```
Login
↓
Homepage Dashboard
  - Recently viewed providers
  - Recommended services
  - Categories
  - Search bar
↓
Search/Browse Services
  - Text search
  - Category selection
  - Filter by location/price/rating
↓
Select Service Mitra
↓
View Mitra Profile
  - Full service details
  - Real-time availability
  - Customer reviews
  - Direct chat option
↓
Choose Service Type
  - Repair category
  - Specific service needed
  - Estimated complexity
↓
Choose Service Option
  - Pickup service
  - Drop-off at shop
  - Home visit
↓
Select Date & Time
  - Available slots
  - Preferred time range
  - Urgent booking option
↓
Add Special Instructions
  - Specific requirements
  - Access instructions
  - Contact preferences
↓
Review Booking Summary
  - Service details
  - Total cost
  - Timeline
  - Mitra information
↓
Choose Payment Method (Midtrans)
  - E-wallet
  - Bank transfer
  - Credit/debit card
↓
Confirm Booking
↓
Booking Confirmation
  - Booking ID
  - Mitra contact
  - Service schedule
  - Payment status
↓
Track Progress
  - Real-time updates
  - Status notifications
  - Chat with provider
↓
Service Completed Notification
↓
Payment Released
↓
Rate & Review Experience
  - Service quality rating
  - Mitra professionalism
  - Written review
  - Photo upload
↓
Booking History Updated

## 🔧 PROVIDER/UMKM USER FLOWS

### Flow 1: Onboarding Process
```
Access via:
- Link "Daftar sebagai Mitra" from user profile
- Direct URL: /mitra
↓
Mitra Registration Landing Page
↓
Register as Service Mitra
  - Business email
  - Phone number
  - Password
  - Business name
  - Address
↓
Choose Business Type
  - Individual service provider
  - Small business/shop
  - Company
↓
Upload Business Documents
  - Identity card (KTP)
  - Business license (NIB/SIUP)
  - Tax registration (NPWP)
  - Business photos
↓
Set Service Categories
  - Primary services
  - Secondary services
  - Specialty areas
↓
Upload Portfolio/Photos
  - Before/after photos
  - Work samples
  - Shop/workspace photos
↓
Set Pricing & Service Area
  - Service rate cards
  - Coverage area
  - Minimum order
  - Additional fees
↓
Complete Bank Account Info
  - Account number
  - Bank name
  - Account holder name
↓
[ADMIN REVIEW PROCESS]
  - Document verification
  - Background check
  - Reference verification
↓
Account Approved Notification
↓
Complete Profile Setup
  - Business description
  - Operating hours
  - Contact information
  - Social media links
↓
Go Live
  - Profile published
  - Ready to receive bookings
```

### Flow 2: Managing Incoming Orders
```
Login to Mitra Dashboard
↓
Dashboard Overview
  - New booking notifications
  - Today's schedule
  - Pending payments
  - Recent messages
↓
View New Bookings
  - Booking details
  - Customer information
  - Service requirements
  - Photos uploaded
↓
Accept/Decline Booking
  - Availability check
  - Service capability assessment
  - Pricing confirmation
↓
Chat with Customer
  - Clarify requirements
  - Confirm details
  - Set expectations
↓
Confirm Diagnosis & Final Price
  - Detailed assessment
  - Final quote
  - Timeline confirmation
↓
Update Availability Calendar
  - Block booked slots
  - Adjust future availability
↓
Start Service
  - Check-in at location
  - Begin work
  - Update status
↓
Update Progress Status
  - Work in progress
  - Milestone updates
  - Issue notifications
↓
Upload Work Photos
  - Progress documentation
  - Quality assurance
  - Transparency
↓
Mark as Completed
  - Final status update
  - Work completion confirmation
↓
Request Payment Release
  - Submit completion proof
  - Invoice generation
↓
Ask for Review
  - Request customer feedback
  - Encourage ratings
↓
View Earnings
  - Payment confirmation
  - Commission details
  - Payout schedule
```

### Flow 3: Business Management
```
Mitra Dashboard
↓
Dashboard Overview
  - Key metrics
  - Recent activity
  - Notifications
↓
View Analytics
  - Booking trends
  - Revenue reports
  - Customer ratings
  - Performance metrics
↓
Manage Calendar
  - Set availability
  - Block dates
  - Adjust working hours
↓
Update Service Prices
  - Modify rate cards
  - Seasonal adjustments
  - Special offers
↓
Respond to Customer Messages
  - Active conversations
  - Pending inquiries
  - Follow-up messages
↓
Check Payment Status
  - Pending payments
  - Payment history
  - Commission breakdown
↓
View Reviews
  - Customer feedback
  - Rating analysis
  - Response to reviews
↓
Update Portfolio
  - Add new work samples
  - Update descriptions
  - Organize galleries
↓
Manage Promotions
  - Create discounts
  - Special packages
  - Seasonal offers
↓
Download Reports
  - Monthly summaries
  - Tax documents
  - Performance reports
```

---

## 👨‍💼 ADMIN USER FLOWS

### Flow 1: UMKM Verification Process
```
Access via: /admin/baksomalang
↓
Admin Login
↓
Admin Dashboard
↓
View Pending Applications
  - New provider registrations
  - Priority queue
  - Application details
↓
Review Documents
  - Identity verification
  - Business license check
  - Document authenticity
↓
Verify Business License
  - Government database check
  - License validity
  - Business registration status
↓
Check Background/References
  - Criminal background check
  - Business reputation
  - Reference contacts
↓
Call/Visit for Verification
  - Phone interview
  - Physical location check
  - Service capability assessment
↓
Approve/Reject Application
  - Final decision
  - Approval criteria met
  - Rejection reasons
↓
Send Notification
  - Email notification
  - SMS confirmation
  - Next steps guidance
↓
Update Status
  - Database update
  - Profile activation
  - System permissions
↓
Add to Platform Directory
  - Public listing
  - Search indexing
  - Category assignment
```

### Flow 2: Dispute Resolution
```
Login to Admin Panel
↓
View Support Tickets
  - Customer complaints
  - Mitra issues
  - System problems
↓
Assign Priority Level
  - Critical issues
  - Standard requests
  - Low priority items
↓
Contact Both Parties
  - Gather information
  - Understand dispute
  - Collect evidence
↓
Review Chat History
  - Communication records
  - Agreement details
  - Conflict points
↓
Check Service Photos
  - Work quality assessment
  - Before/after comparison
  - Damage documentation
↓
Make Decision
  - Fair resolution
  - Policy compliance
  - Precedent consideration
↓
Process Refund/Compensation
  - Payment adjustments
  - Compensation calculation
  - Financial processing
↓
Update Case Status
  - Resolution recorded
  - Case closure
  - Documentation
↓
Send Resolution Notice
  - Decision notification
  - Explanation provided
  - Appeal process
↓
Follow up Satisfaction
  - Resolution acceptance
  - Satisfaction survey
  - Improvement feedback
```

### Flow 3: Platform Management
```
Login to Admin Panel
↓
Dashboard Analytics
  - Platform KPIs
  - User growth metrics
  - Revenue analytics
  - Performance indicators
↓
Monitor User Activity
  - Active users
  - Engagement metrics
  - Unusual patterns
  - Security alerts
↓
Review Flagged Content
  - Inappropriate reviews
  - Spam detection
  - Policy violations
  - Content moderation
↓
Manage Featured Listings
  - Promote quality providers
  - Seasonal highlights
  - Category features
↓
Update Platform Policies
  - Terms of service
  - Privacy policy
  - Service guidelines
  - Pricing policies
↓
Send Push Notifications
  - Platform updates
  - Promotional campaigns
  - Important announcements
  - Security alerts
↓
Generate Reports
  - Monthly summaries
  - Quarterly reviews
  - Annual reports
  - Stakeholder updates
↓
Analyze Platform Performance
  - System optimization
  - User experience metrics
  - Business intelligence
  - Strategic planning
```

---

## 🔄 Cross-Role Interactions

### Customer-Mitra Direct Flow
```
Customer searches → Mitra appears in results → Customer views profile → 
Customer initiates chat → Mitra responds → Booking negotiation → 
Service agreement → Payment processing → Service delivery → 
Mutual rating and review
```

### Admin-Mitra Oversight Flow
```
Mitra registers → Admin verifies → Mitra goes live → 
Admin monitors performance → Issues flagged → Admin investigates → 
Resolution implemented → Mitra status updated
```

### Admin-Customer Support Flow
```
Customer files complaint → Admin receives ticket → Admin investigates → 
Admin contacts both parties → Resolution decision → 
Customer notification → Case closure
```

## Key Notes
- Guest users can explore but cannot interact
- All transactional features require authentication
- Mitra access is separate from customer access
- Admin access is restricted and secured
- Real-time notifications across all user types
- Mobile-responsive design for all flows