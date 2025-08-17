import BasicFormExample from "./components/BasicFormExample";
import DebouncedFormExample from "./components/DebouncedFormExample";
import SessionStorageExample from "./components/SessionStorageExample";

function App() {
  const handleClearAllStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("All storage has been cleared!");
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>React Hook Form Persist Examples</h1>
      <p>
        This example app demonstrates different ways to use
        react-hook-form-persist with various configurations.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <button
          type="button"
          onClick={handleClearAllStorage}
          className="danger"
        >
          Clear All Storage (Local + Session) and reload
        </button>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          This will clear all persisted form data and reload the page.
        </p>
      </div>

      <BasicFormExample />
      <DebouncedFormExample />
      <SessionStorageExample />
    </div>
  );
}

export default App;
