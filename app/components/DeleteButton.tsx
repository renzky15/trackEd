"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: number;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const dialog = document.getElementById(
      `delete_modal_${id}`
    ) as HTMLDialogElement;
    dialog.close();

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      router.refresh();
    } catch (error) {
      const errorDialog = document.getElementById(
        "error_modal"
      ) as HTMLDialogElement;
      errorDialog.showModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          const dialog = document.getElementById(
            `delete_modal_${id}`
          ) as HTMLDialogElement;
          dialog.showModal();
        }}
        disabled={isDeleting}
        className="btn btn-sm btn-error btn-outline gap-2 hover:bg-error/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        {isDeleting ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Delete"
        )}
      </button>

      <dialog
        id={`delete_modal_${id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <h3 className="font-bold text-lg">Confirm Delete</h3>
            </div>
            <p className="text-base-content/80">
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn btn-ghost btn-sm">Cancel</button>
                <button onClick={handleDelete} className="btn btn-error btn-sm">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-base-200/80">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="error_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 border border-base-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <h3 className="font-bold text-lg">Error</h3>
            </div>
            <p className="text-base-content/80">
              Failed to delete feedback. Please try again.
            </p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-sm">Close</button>
              </form>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
