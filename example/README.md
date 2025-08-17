# React Hook Form Persist Examples

This example application demonstrates various usage patterns for `@liorpo/react-hook-form-persist`, including the new debouncing functionality.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Examples Included

### 1. Basic Form with Persistence

- Simple form that auto-saves to sessionStorage
- Demonstrates automatic data restoration on page refresh
- Shows basic configuration with default settings

### 2. Debounced Form Persistence

- Interactive example showing debouncing in action
- Adjustable debounce delay to see the performance difference
- Real-time save count tracking
- Demonstrates how debouncing reduces storage writes

### 3. localStorage with Advanced Options

- Uses localStorage for persistent storage across browser sessions
- Shows field exclusion functionality
- Demonstrates timeout/expiration features
- Includes data restoration and timeout callbacks

### 4. Multiple Forms with Separate Persistence

- Shows how to manage multiple forms independently
- Each form has its own storage key and debounce settings
- Demonstrates form navigation with persistent state
- Includes data export functionality

## Key Features Demonstrated

### Debouncing

```tsx
<FormPersist
  form={form}
  formKey="my-form"
  debounceDelay={500} // Saves after 500ms of inactivity
/>
```

### Custom Storage

```tsx
useFormPersist("form-key", {
  control: form.control,
  setValue: form.setValue,
  storage: localStorage, // Use localStorage instead of sessionStorage
  debounceDelay: 1000,
});
```

### Field Exclusion

```tsx
useFormPersist("form-key", {
  // ... other config
  exclude: ["password", "confirmPassword"], // Don't persist sensitive fields
});
```

### Timeout/Expiration

```tsx
useFormPersist("form-key", {
  // ... other config
  timeout: 24 * 60 * 60 * 1000, // 24 hours
  onTimeout: () => {
    console.log("Form data expired and was cleared");
  },
});
```

### Data Restoration Callback

```tsx
useFormPersist("form-key", {
  // ... other config
  onDataRestored: (data) => {
    console.log("Form data restored:", data);
    // Perform any additional setup needed
  },
});
```

## Performance Considerations

The debouncing feature is particularly useful for:

- Large forms with many fields
- Forms with frequent updates (like real-time text editors)
- Mobile applications where storage operations can be expensive
- Reducing browser storage API calls

Without debouncing, every keystroke triggers a storage write. With debouncing, storage writes only happen after the user stops typing for the specified delay.

## Browser Compatibility

The examples work in all modern browsers that support:

- Web Storage API (localStorage/sessionStorage)
- ES6+ features
- React 18+

## Development

To modify or extend these examples:

1. The main application is in `src/App.tsx`
2. Individual examples are in `src/components/`
3. Each component demonstrates different aspects of the library
4. Styling is included inline for simplicity

## Building for Production

```bash
npm run build
```

This will create a `dist` folder with the built application ready for deployment.
