"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FontGroupList from "@/components/home/FontGroupList";
import LoadingPage from "@/components/global/LoadingPage";
import { set } from "date-fns";

export default function FontGroupSystem() {
  const [fonts, setFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [fontGroupName, setFontGroupName] = useState("");
  const [fontGroups, setFontGroups] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFonts();
    fetchFontGroups();
  }, []);

  const fetchFonts = async () => {
    setLoading(true);
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fonts`);
    setFonts(res.data);
    setLoading(false);
  };

  const fetchFontGroups = async () => {
    setLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/font-groups`
    );
    setFontGroups(res.data);
    setLoading(false);
  };

  const handleFontUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const file = e.target.files[0];
    if (!file || file.type !== "font/ttf") return;
    const formData = new FormData();
    formData.append("font", file);
    setUploading(true);
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/fonts`,
      formData
    );
    setUploading(false);
    fetchFonts();
    setLoading(false);
  };

  const toggleFontSelect = (id) => {
    setSelectedFonts((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const createFontGroup = async () => {
    setLoading(true);
    if (selectedFonts.length < 2 || !fontGroupName)
      return alert("Select at least 2 fonts and enter group name.");

    if (editingGroup) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/font-groups/${editingGroup._id}`,
        {
          name: fontGroupName,
          fontIds: selectedFonts,
        }
      );
      setEditingGroup(null);
      setLoading(false);
    } else {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/font-groups`, {
        name: fontGroupName,
        fontIds: selectedFonts,
      });
      setLoading(false);
    }

    setFontGroupName("");
    setSelectedFonts([]);
    fetchFontGroups();
    setLoading(false);
  };

  function handleEdit(group) {
    setLoading(true);
    setEditingGroup(group);
    setFontGroupName(group.name);
    setSelectedFonts(group.fontIds.map((f) => f._id));
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    if (!confirm("Are you sure you want to delete this font group?")) return;
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/font-groups/${id}`);
    fetchFontGroups();
    setLoading(false);
  }

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <label className="block font-medium mb-2">Upload TTF Font:</label>

        <div className="mb-6">
          <label
            htmlFor="font-upload"
            className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 bg-white cursor-pointer transition hover:border-emerald-500 hover:bg-emerald-50"
          >
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a1 1 0 001 1h3m10-2v2a2 2 0 002 2H5a2 2 0 01-2-2v-2m16-8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 0a2 2 0 00-2 2H6a2 2 0 01-2-2m16 0v4m0 0l-4-4m4 4l4-4"
                />
              </svg>

              <div className="mt-4 flex justify-center text-sm text-gray-600">
                <span className="font-semibold text-emerald-600">
                  Click to upload
                </span>
                <span className="pl-2">or drag and drop</span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Only .ttf files up to 5MB
              </p>
            </div>
          </label>

          <input
            id="font-upload"
            type="file"
            accept=".ttf"
            onChange={handleFontUpload}
            className="sr-only"
          />

          {uploading && (
            <p className="text-blue-600 mt-2 text-sm">Uploading...</p>
          )}
        </div>

        {uploading && <p className="text-emerald-600 mt-2">Uploading...</p>}
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Select Fonts:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fonts.map((font) => (
            <div
              key={font._id}
              className={`border p-3 rounded cursor-pointer text-center transition-all ${
                selectedFonts.includes(font._id)
                  ? "bg-emerald-200 border-emerald-500"
                  : ""
              }`}
              onClick={() => toggleFontSelect(font._id)}
              style={{ fontFamily: font.name }}
            >
              {font.name}
            </div>
          ))}
        </div>
      </div>

      

      <div className="mb-6">
        <input
          type="text"
          placeholder="Font Group Name"
          value={fontGroupName}
          onChange={(e) => setFontGroupName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
        <button
          onClick={createFontGroup}
          className="bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
        >
          {editingGroup ? "Update Font Group" : "Create Font Group"}
        </button>
      </div>

      <FontGroupList
        fontGroups={fontGroups}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
