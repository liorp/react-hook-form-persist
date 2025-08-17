import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { FormPersist } from "../../../src";

interface FormData {
  username: string;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

function SessionStorageExample() {
  const [message, setMessage] = useState("");
  const [storageData, setStorageData] = useState<string | null>(null);

  const usernameId = useId();
  const themeId = useId();
  const notificationsId = useId();
  const languageId = useId();

  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      preferences: {
        theme: "light",
        notifications: false,
        language: "en",
      },
    },
  });

  // Using FormPersist component with localStorage and custom options

  // Using FormPersist component with localStorage and custom options

  const onSubmit = (data: FormData) => {
    alert(`Settings saved: ${JSON.stringify(data, null, 2)}`);
  };

  const clearSettings = () => {
    sessionStorage.removeItem("user-settings-v1");
    form.reset();
    setMessage("All settings cleared!");
    setTimeout(() => setMessage(""), 3000);
  };

  // Monitor sessionStorage changes
  useEffect(() => {
    const updateStorageData = () => {
      const data = sessionStorage.getItem("user-settings-v1");
      setStorageData(data);
    };

    updateStorageData();
    const interval = setInterval(updateStorageData, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="example">
      <h2>SessionStorage with Advanced Options</h2>
      <p>
        This example uses sessionStorage (cleared when browser tab closes), and
        includes timeout functionality. Data expires after 1 hour.
      </p>

      <FormPersist
        form={form}
        formKey="user-settings-v1"
        storage={sessionStorage}
        debounceDelay={500}
        timeout={60 * 60 * 1000}
        onDataRestored={(data) => {
          setMessage(
            `Restored settings for user: ${data.username || "Anonymous"}`
          );
          setTimeout(() => setMessage(""), 3000);
        }}
        onTimeout={() => {
          setMessage("Settings expired after 1 hour - cleared automatically");
          setTimeout(() => setMessage(""), 3000);
        }}
      />

      {message && <div className="status success">{message}</div>}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor={usernameId}>Username</label>
          <input
            id={usernameId}
            {...form.register("username")}
            placeholder="Enter your username"
          />
        </div>

        <h3>Preferences</h3>

        <div className="form-group">
          <label htmlFor={themeId}>Theme</label>
          <select id={themeId} {...form.register("preferences.theme")}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="form-group">
          <input
            id={notificationsId}
            type="checkbox"
            {...form.register("preferences.notifications")}
          />
          <label htmlFor={notificationsId}>Enable Notifications</label>
        </div>

        <div className="form-group">
          <label htmlFor={languageId}>Language</label>
          <select id={languageId} {...form.register("preferences.language")}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <button type="submit">Save Settings</button>
        <button type="button" onClick={clearSettings} className="secondary">
          Clear All Settings
        </button>
      </form>

      <div className="code">
        <strong>Configuration:</strong>
        <br />
        {`<FormPersist 
  form={form} 
  formKey="user-settings"
  storage={sessionStorage}
  debounceDelay={500}
  timeout={60 * 60 * 1000}
  onDataRestored={(data) => { /* callback */ }}
  onTimeout={() => { /* cleanup callback */ }}
/>`}
      </div>

      <div className="status info">
        <strong>SessionStorage Content (user-settings-v1):</strong>
        <div className="code">
          {storageData ? (
            <pre>{JSON.stringify(JSON.parse(storageData), null, 2)}</pre>
          ) : (
            <em>No data in storage</em>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionStorageExample;
