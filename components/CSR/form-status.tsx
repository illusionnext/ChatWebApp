"use client";
import { useFormStatus } from "react-dom";

export default function FormStatus() {
  // const { pending, data, method, action } = useFormStatus();
  const { pending } = useFormStatus();

  if (pending) {
    return <p className="form-actions">Submitting...</p>;
  } else {
    return (
      <>
        <p className="form-actions">
          <button type="reset">Reset</button>
          <button>Create Post</button>
        </p>
      </>
    );
  }
}
