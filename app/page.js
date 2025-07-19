"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FontGroupList from "@/components/home/FontGroupList";
import LoadingPage from "@/components/global/LoadingPage";
import { set } from "date-fns";
import FontTable from "@/components/home/FontTable";

export default function FontGroupSystem() {
  const [fonts, setFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [fontGroupName, setFontGroupName] = useState("");
  const [fontGroups, setFontGroups] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [rows, setRows] = useState([{ id: Date.now(), fontId: "" }]);
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
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fonts`, formData);
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
    const selectedFonts = rows.map((row) => row.fontId).filter(Boolean);

    if (selectedFonts.length < 2 || !fontGroupName) {
      setLoading(false);
      return alert("Select at least 2 fonts and enter group name.");
    }
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

  const handleDeleteFont = (id) => {
    setFonts((prev) => prev.filter((font) => font._id !== id));
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
  const handleAddRow = () => {
    setRows((prev) => [...prev, { id: Date.now(), fontId: "" }]);
  };

  const handleDeleteRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleFontChange = (id, selectedFontId) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, fontId: selectedFontId } : row
      )
    );
  };

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
            <p className="text-emerald-600 mt-2 text-sm">Uploading...</p>
          )}
        </div>

        {uploading && <p className="text-emerald-600 mt-2">Uploading...</p>}
      </div>

      <FontTable fonts={fonts} onDelete={handleDeleteFont} />
      <div className="space-y-6"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">Create Font Group</h2>
        <input
          type="text"
          placeholder="Font Group Name"
          value={fontGroupName}
          onChange={(e) => setFontGroupName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
        {/* {rows.map((row, index) => (
          <div key={row.id} className="flex items-center gap-4 my-5">
            <select
              className="border px-4 py-2 rounded w-full"
              value={row.fontId}
              onChange={(e) => handleFontChange(row.id, e.target.value)}
            >
              <option value="">-- Select Font --</option>
              {fonts.map((font) => (
                <option
                  key={font._id}
                  value={font._id}
                  style={{ fontFamily: font.name }}
                >
                  {font.name}
                </option>
              ))}
            </select>
            {rows.length > 1 && (
              <button
                onClick={() => handleDeleteRow(row.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))} */}
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-center gap-4 my-5">
            <div className="relative w-full">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={row.fontId}
                onChange={(e) => handleFontChange(row.id, e.target.value)}
              >
                <option value="">-- Select Font --</option>
                {fonts.map((font) => (
                  <option
                    key={font._id}
                    value={font._id}
                    style={{ fontFamily: font.name }}
                  >
                    {font.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {rows.length > 1 && (
              <button
                onClick={() => handleDeleteRow(row.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={createFontGroup}
            className="bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
          >
            {editingGroup ? "Update Font Group" : "Create Font Group"}
          </button>
          <button
            onClick={handleAddRow}
            type="button"
            className="text-emerald-600 border border-emerald-600 px-1 py-2 rounded"
          >
            + Add Row
          </button>
        </div>
      </div>

      <FontGroupList
        fontGroups={fontGroups}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
