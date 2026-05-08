import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FloatingInput } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/IconButton";

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <FloatingInput
        label={label}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete={autoComplete}
      />
      <div className="absolute right-2 top-2">
        <IconButton
          ariaLabel={show ? "Hide password" : "Show password"}
          variant="plain"
          onClick={() => setShow((v) => !v)}
          className="h-10 w-10"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </IconButton>
      </div>
    </div>
  );
}

