import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { FormPersist } from "../../../src";

interface FormData {
  title: string;
  content: string;
  category: string;
  priority: string;
}

function DebouncedFormExample() {
  const [saveCount, setSaveCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [debounceDelay, setDebounceDelay] = useState(1000);
  const [storageData, setStorageData] = useState<string | null>(null);

  const debounceDelayId = useId();
  const titleId = useId();
  const contentId = useId();
  const categoryId = useId();
  const priorityId = useId();

  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "general",
      priority: "medium",
    },
  });

  // Monitor storage changes to track saves
  useEffect(() => {
    const handleStorageChange = () => {
      setSaveCount((prev) => prev + 1);
      setLastSaved(new Date());
    };

    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      if (key === "react-hook-form-persist:debounced-form-v1") {
        handleStorageChange();
      }
      return originalSetItem.call(this, key, value);
    };

    return () => {
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  // Monitor sessionStorage content
  useEffect(() => {
    const updateStorageData = () => {
      const data = sessionStorage.getItem(
        "react-hook-form-persist:debounced-form-v1"
      );
      setStorageData(data);
    };

    updateStorageData();
    const interval = setInterval(updateStorageData, 500);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = (data: FormData) => {
    alert(`Form submitted with data: ${JSON.stringify(data, null, 2)}`);
  };

  const clearForm = () => {
    form.reset();
    setSaveCount(0);
    setLastSaved(null);
    sessionStorage.removeItem("react-hook-form-persist:debounced-form-v1");
  };

  return (
    <div className="example">
      <h2>Debounced Form Persistence</h2>
      <p>
        This form uses debouncing to reduce storage writes. Changes are saved
        after you stop typing for <strong>{debounceDelay}ms</strong>. Try typing
        quickly to see the difference!
      </p>

      <div className="form-group">
        <label htmlFor={debounceDelayId}>Debounce Delay (ms)</label>
        <input
          id={debounceDelayId}
          type="number"
          value={debounceDelay}
          onChange={(e) => setDebounceDelay(Number(e.target.value))}
          min="0"
          max="5000"
          step="100"
        />
      </div>

      <FormPersist
        form={form}
        formKey="debounced-form-v1"
        debounceDelay={debounceDelay}
      />

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor={titleId}>Title</label>
          <input
            id={titleId}
            {...form.register("title")}
            placeholder="Enter a title"
          />
        </div>

        <div className="form-group">
          <label htmlFor={contentId}>Content</label>
          <textarea
            id={contentId}
            {...form.register("content")}
            placeholder="Start typing your content here..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor={categoryId}>Category</label>
          <select id={categoryId} {...form.register("category")}>
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={priorityId}>Priority</label>
          <select id={priorityId} {...form.register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={clearForm} className="secondary">
          Clear Form
        </button>
      </form>

      <div className="status info">
        <strong>Save Statistics:</strong>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Total saves: {saveCount}</li>
          <li>
            Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : "Never"}
          </li>
          <li>Debounce delay: {debounceDelay}ms</li>
        </ul>
      </div>

      <div className="code">
        <strong>Configuration:</strong>
        <br />
        {`<FormPersist form={form} formKey="debounced-form" debounceDelay={${debounceDelay}} />`}
      </div>

      <div className="status info">
        <strong>
          SessionStorage Content (react-hook-form-persist:debounced-form-v1):
        </strong>
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

export default DebouncedFormExample;
