"use client";

interface DeleteButtonProps {
  label?: string;
  className?: string;
}

export default function DeleteButton({
  label = "Delete",
  className = "rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50",
}: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this item?")) {
          e.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
