"use client";

import { HiOutlineTrash } from "react-icons/Hi";
import { useRouter } from "next/navigation";

export default function BtnDelete({ url }) {
  const router = useRouter();
  const removeItem = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`/api/${url}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <button onClick={removeItem} className="text-red-400">
      <HiOutlineTrash size={24} />
    </button>
  );
}