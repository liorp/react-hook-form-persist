import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { FormPersist } from "../../../src";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  bio: string;
}

function BasicFormExample() {
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitted, setLastSubmitted] = useState<FormData | null>(null);
  const [storageData, setStorageData] = useState<string | null>(null);

  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const ageId = useId();
  const bioId = useId();

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      bio: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitCount((prev) => prev + 1);
    setLastSubmitted(data);
  };

  const clearForm = () => {
    form.reset();
    setLastSubmitted(null);
    localStorage.removeItem("basic-form-v1");
  };

  // Monitor localStorage changes
  useEffect(() => {
    const updateStorageData = () => {
      const data = localStorage.getItem("basic-form-v1");
      setStorageData(data);
    };

    // Initial load
    updateStorageData();

    // Watch for changes
    const interval = setInterval(updateStorageData, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="example">
      <h2>Basic Form with Persistence</h2>
      <p>
        This form automatically saves to localStorage as you type. Try
        refreshing the page to see your data restored.
      </p>

      <FormPersist form={form} formKey="basic-form-v1" />

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor={firstNameId}>First Name</label>
          <input
            id={firstNameId}
            {...form.register("firstName")}
            placeholder="Enter your first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor={lastNameId}>Last Name</label>
          <input
            id={lastNameId}
            {...form.register("lastName")}
            placeholder="Enter your last name"
          />
        </div>

        <div className="form-group">
          <label htmlFor={emailId}>Email</label>
          <input
            id={emailId}
            type="email"
            {...form.register("email")}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor={ageId}>Age</label>
          <input
            id={ageId}
            type="number"
            {...form.register("age", { valueAsNumber: true })}
            placeholder="Enter your age"
          />
        </div>

        <div className="form-group">
          <label htmlFor={bioId}>Bio</label>
          <textarea
            id={bioId}
            {...form.register("bio")}
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={clearForm} className="secondary">
          Clear Form
        </button>
      </form>

      {submitCount > 0 && (
        <div className="status success">
          Form submitted {submitCount} time(s)!
        </div>
      )}

      {lastSubmitted && (
        <div className="status info">
          <strong>Last submitted data:</strong>
          <div className="code">{JSON.stringify(lastSubmitted, null, 2)}</div>
        </div>
      )}

      <div className="status info">
        <strong>LocalStorage Content (basic-form-v1):</strong>
        <div className="code">
          {storageData ? (
            <pre>
              {JSON.stringify(
                JSON.parse(localStorage.getItem("basic-form-v1") || "{}"),
                null,
                2
              )}
            </pre>
          ) : (
            <em>No data in storage</em>
          )}
        </div>
      </div>
    </div>
  );
}

export default BasicFormExample;
