# Input Validation Guidelines

This document outlines the input validation rules applied across the ShutterSync application.

## Validation Types

### Text Only (`textOnly`)

- Accepts only alphabetic characters and spaces
- Pattern: `/^[a-zA-Z\s]*$/`
- Use for: Names, locations, venue names

### Number Only (`numberOnly`)

- Accepts only numeric digits (0-9)
- Pattern: `/^[0-9]*$/`
- Use for: Amounts, durations, phone numbers (without formatting)

### Alphanumeric Only (`alphanumericOnly`)

- Accepts letters, numbers, hyphens, and underscores
- Pattern: `/^[a-zA-Z0-9_-]*$/`
- Use for: UPI IDs, usernames, identifiers

### Phone Only (`phoneOnly`)

- Accepts digits, plus sign, spaces, parentheses, and hyphens
- Pattern: `/^[0-9+\s()-]*$/`
- Use for: Phone numbers, contact information

### Email

- Native HTML5 `type="email"` validation
- Use for: Email addresses

---

## Field-Level Validation Map

### Login Component

| Field     | Validation   | Limit | Notes                     |
| --------- | ------------ | ----- | ------------------------- |
| Full Name | Text Only    | 50    | Characters alpha + spaces |
| Email     | Email Type   | —     | HTML5 email validation    |
| Password  | None         | —     | Any characters allowed    |
| Contact   | Phone Only   | 15    | +91 format supported      |
| UPI ID    | Alphanumeric | 255   | artist@upi format         |

### CreateAssignment Component

| Field            | Validation     | Limit | Notes                                     |
| ---------------- | -------------- | ----- | ----------------------------------------- |
| Client Name      | Text Only      | 100   | Spaces allowed                            |
| Client Contact   | Phone Only     | 15    | +91 XXXXX format                          |
| Location         | Text Only      | 100   | City names                                |
| Venue            | No Restriction | 100   | Allows special characters for venue names |
| Assignment Title | No Restriction | 100   | Allows hyphens for "Wedding - Names"      |
| Total Amount     | Number Only    | 10    | Numeric value only (no comma)             |
| Description      | No Restriction | 500   | TextArea, allows any characters           |

### PhotographerManager Component

| Field       | Validation   | Limit | Notes                          |
| ----------- | ------------ | ----- | ------------------------------ |
| Artist Name | Text Only    | 100   | Alphabetic characters + spaces |
| Email       | Email Type   | —     | HTML5 email validation         |
| Contact     | Phone Only   | 15    | +91 format                     |
| UPI Handle  | Alphanumeric | 255   | artist@upi format              |
| Password    | None         | —     | Any characters allowed         |

### BookingForm Component

| Field       | Validation | Limit | Notes                   |
| ----------- | ---------- | ----- | ----------------------- |
| Client Name | Text Only  | 100   | Confirmation name field |

---

## Implementation Details

### Enhanced Input Component

The `Input` and `TextArea` components in `src/components/UI.jsx` now support:

```jsx
<Input
  numberOnly={true} // Restrict to numbers
  textOnly={true} // Restrict to text
  alphanumericOnly={true} // Alphanumeric + underscore/hyphen
  phoneOnly={true} // Phone format
  maxLength={100} // Character limit
  charLimit={100} // Character limit (alternative)
/>
```

### Character Counter

- Displays as `current/limit` in the bottom-right of input
- Updates in real-time as user types
- Automatically truncates if user pastes content exceeding limit

### Client-Side Only

All validation is performed client-side. Server-side validation should also be implemented in Convex functions for security.

---

## Usage Example

```jsx
// Text field with 50 char limit
<Input
  textOnly
  maxLength={50}
  placeholder="Enter name"
/>

// Number field with 10 digit limit
<Input
  numberOnly
  maxLength={10}
  placeholder="Enter amount"
/>

// Phone field
<Input
  phoneOnly
  maxLength={15}
  placeholder="+91 XXXXX XXXXX"
/>
```

---

## Future Enhancements

- [ ] Add server-side validation in Convex functions
- [ ] Add real-time validation feedback (✓/✗ icons)
- [ ] Add password strength indicator
- [ ] Add email verification
- [ ] Add phone number format auto-formatting (123 → +91 123)
