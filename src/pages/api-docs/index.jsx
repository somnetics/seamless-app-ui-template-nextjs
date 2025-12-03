import { useEffect, useState } from "react";
import ApiSidebar from "@/components/Documentation/ApiSidebar";
import ApiEndpoint from "@/components/Documentation/ApiEndpoint";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    fetch("/openapi.json")
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      <ApiSidebar 
        paths={spec.paths} 
        onSelect={(path, method) => {
          setSelectedPath(path);
          setSelectedMethod(method);
        }} 
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {selectedPath ? (
          <ApiEndpoint 
            path={selectedPath}
            method={selectedMethod}
            details={spec.paths[selectedPath][selectedMethod]}
            schemas={spec.components?.schemas}
          />
        ) : (
          <h2 className="text-xl">Select an endpoint from the left</h2>
        )}
      </div>
    </div>
  );
}
