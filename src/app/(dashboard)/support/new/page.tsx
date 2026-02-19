"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createSupportCategory } from "src/services/supportCategoryServices";
import { api } from "src/lib/api";
import AttachmentUpload from "./attachment";
type Category = {
  id: number;
  name: string;
};
export default function CreateTicketPage() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const openCategoryModal = () => {
    setCategoryName(subject);
    setCategoryError("");
    setShowCategoryModal(true);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get(`/select-support-categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryName("");
    setCategoryError("");
  };

  const handleCategorySubmit = async () => {
    const normalizedName = categoryName.trim();
    if (!normalizedName) {
      setCategoryError("Name is required.");
      return;
    }

    try {
      setIsAddingCategory(true);
      setCategoryError("");
      const response = await createSupportCategory({ name: normalizedName });
      const createdName =
        response?.data?.name ?? response?.name ?? normalizedName;
      setSubject(String(createdName));
      closeCategoryModal();
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!
              .data!.message!
          : "Failed to add category. Please try again.";
      setCategoryError(message);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleTicketSubmit = async () => {
    const formData = new FormData();
    formData.append("category_id", category);
    formData.append("subject", subject);
    formData.append("message", message);
    files.forEach((file) => {
      formData.append("attachments[]", file);
    });

    await api.post("/support-tickets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
          Create Ticket
        </h1>
        <Link
          href="/support"
          className="text-sm font-semibold text-white px-2 py-1 rounded bg-emerald-600 dark:text-white"
        >
          Back
        </Link>
      </div>

      <div className="mt-5 rounded-md border border-gray-200 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="max-w-4xl">
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-64 mr-2 rounded-md border border-gray-300 bg-white px-3 py-2 mb-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {categories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openCategoryModal}
            className="inline-flex h-8 w-10 items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
          >
            +
          </button>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mt-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSubject(e.target.value)
            }
            placeholder="Subject"
            className="mt-2 w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          ></input>

          <label className="mt-8 block text-sm font-semibold text-gray-700 dark:text-slate-200">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            placeholder="Your Message"
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <AttachmentUpload files={files} setFiles={setFiles} />

          <button
            type="submit"
            onClick={handleTicketSubmit}
            className="cursor-pointer mt-6 rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Submit
          </button>
        </div>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50 dark:bg-black/70">
          <div className="relative top-20 mx-auto w-11/12 max-w-md rounded-md border bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">
              Add Category
            </h3>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200">
              Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCategorySubmit}
                disabled={isAddingCategory}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {isAddingCategory ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={closeCategoryModal}
                disabled={isAddingCategory}
                className="rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
            {categoryError && (
              <p className="mt-3 text-sm text-red-500 dark:text-red-400">
                {categoryError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
