# react-hook-form-persist

A lightweight React Hook Form persistence library. Automatically save and restore form data to localStorage.

## Features

- 🔄 **Automatic Persistence**: Automatically saves form data as users type
- 🗂️ **Flexible Storage**: Default localStorage with support for sessionStorage or custom storage
- ⏰ **Timeout Support**: Optional data expiration with cleanup
- 🚫 **Field Exclusion**: Exclude sensitive fields from persistence
- 📱 **SSR Compatible**: Works with server-side rendering
- 🎯 **TypeScript**: Full TypeScript support with proper types
- 🧪 **Well Tested**: Comprehensive test coverage

## Installation

```bash
npm install react-hook-form-persist
```

## Quick Start

### Basic Usage

```tsx
import { useForm } from "react-hook-form";
import { useFormPersist } from "react-hook-form-persist";

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { clear } = useFormPersist("my-form", {
    control: form.control,
    setValue: form.setValue,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("name")} placeholder="Name" />
      <input {...form.register("email")} placeholder="Email" />
      <button type="submit">Submit</button>
      <button type="button" onClick={clear}>
        Clear Saved Data
      </button>
    </form>
  );
}
```

### Using the Component

```tsx
import { useForm } from "react-hook-form";
import { FormPersist } from "react-hook-form-persist";

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <>
      <FormPersist form={form} formKey="my-form" />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input {...form.register("name")} placeholder="Name" />
        <input {...form.register("email")} placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

## API Reference

### `useFormPersist`

A hook that handles form persistence.

```tsx
const { clear, isRestoringRef, isSavingRef } = useFormPersist(name, config);
```

#### Parameters

- `name` (string): Unique identifier for the form data in storage
- `config` (FormPersistConfig): Configuration object

#### Returns (`UseFormPersistResult`)

- `clear()`: Function to manually clear the persisted data
- `isRestoringRef`: RefObject<boolean> indicating if data is being restored
- `isSavingRef`: RefObject<boolean> indicating if data is being saved

#### Configuration Options (`FormPersistConfig<T>`)

| Option           | Type               | Default          | Description                                 |
| ---------------- | ------------------ | ---------------- | ------------------------------------------- |
| `storage`        | Storage            | `localStorage`   | Storage implementation to use               |
| `control`        | Control<T>         | required         | React Hook Form control for watching values |
| `setValue`       | UseFormSetValue<T> | required         | React Hook Form setValue for restoring data |
| `exclude`        | string[]           | `[]`             | Field names to exclude from persistence     |
| `onDataRestored` | (data: T) => void  | -                | Callback when data is restored              |
| `validate`       | boolean            | `false`          | Trigger validation when restoring data      |
| `dirty`          | boolean            | `false`          | Mark fields as dirty when restored          |
| `touch`          | boolean            | `false`          | Mark fields as touched when restored        |
| `timeout`        | number             | -                | Data expiration time in milliseconds        |
| `onTimeout`      | () => void         | -                | Callback when data expires                  |
| `debounceDelay`  | number             | `0`              | Debounce delay in ms before persisting      |

### `FormPersist`

A component that automatically handles form persistence.

```tsx
<FormPersist form={form} formKey="unique-key" />
```

#### Props (`FormPersistProps<T>`)

All props from `FormPersistConfig` except `control` and `setValue`, plus:

| Prop       | Type             | Required | Description                                     |
| ---------- | ---------------- | -------- | ----------------------------------------------- |
| `form`     | UseFormReturn<T> | Yes      | React Hook Form instance from useForm()         |
| `formKey`  | string           | Yes      | Unique identifier for storage (e.g., "form-v1") |
| `children` | ReactNode        | No       | Optional child elements to render               |

## Advanced Usage

### Using SessionStorage

```tsx
import { useFormPersist } from "react-hook-form-persist";

function MyForm() {
  const form = useForm();

  const { clear } = useFormPersist("my-form", {
    control: form.control,
    setValue: form.setValue,
    storage: sessionStorage, // Use sessionStorage instead of localStorage
  });

  return <form>...</form>;
}
```

### Exclude Sensitive Fields

```tsx
const { clear } = useFormPersist("my-form", {
  control: form.control,
  setValue: form.setValue,
  exclude: ["password", "confirmPassword"], // Don't persist passwords
});
```

### Data Expiration

```tsx
const { clear } = useFormPersist("my-form", {
  control: form.control,
  setValue: form.setValue,
  timeout: 24 * 60 * 60 * 1000, // 24 hours
  onTimeout: () => {
    console.log("Form data expired");
  },
});
```

### Debounced Persistence

```tsx
const { clear } = useFormPersist("my-form", {
  control: form.control,
  setValue: form.setValue,
  debounceDelay: 500, // Save after 500ms of inactivity
});
```

### Custom Storage Implementation

```tsx
const customStorage = {
  getItem: (key: string) => {
    // Custom get logic
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    // Custom set logic
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    // Custom remove logic
    localStorage.removeItem(key);
  },
};

const { clear } = useFormPersist("my-form", {
  control: form.control,
  setValue: form.setValue,
  storage: customStorage,
});
```

### Validation on Restore

```tsx
const { clear } = useFormPersist("my-form", {
  control: form.control,
  setValue: form.setValue,
  validate: true, // Trigger validation when data is restored
  dirty: true, // Mark form as dirty
  touch: true, // Mark fields as touched
});
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Lint

```bash
npm run lint
npm run lint:fix
```

## GitHub Actions

This repository uses a single CI/CD workflow (`.github/workflows/ci.yml`) that handles:

- **Testing**: Runs on push to main and pull requests

  - Tests against Node.js 22 and 24
  - Type checking, linting, formatting, and tests
  - Coverage reports uploaded to Codecov

- **Publishing**: Automatically publishes to npm when a release is created
  - Requires `NPM_TOKEN` secret in repository settings

### Publishing a New Version

1. Update version in `package.json`
2. Create a new GitHub release
3. The workflow will automatically test and publish to npm

## Acknowledgments

Thanks to the original [react-hook-form-persist](https://www.npmjs.com/package/react-hook-form-persist) package for inspiration.

## License

MIT - Lior Polak
