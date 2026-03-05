import React from "react";

export default function DataUploader() {
  return (
    <div className="bg-white border border-gray-300 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
        <div>
          <p className="text-xs uppercase text-gray-600 font-bold tracking-wide">Data</p>
          <h2 className="text-lg font-bold text-gray-900 uppercase">Upload New Layers</h2>
        </div>
        <span className="text-xs text-gray-600 font-bold uppercase">CSV / GeoJSON</span>
      </div>

      <div className="space-y-3 text-sm text-gray-800 font-medium">
        <p className="uppercase">Drop rainfall series, drainage lines, or ward GeoJSON to refresh the map.</p>
        <button className="w-full border border-gray-400 bg-gray-100 hover:bg-gray-200 transition px-3 py-2 text-left font-bold uppercase text-gray-900">
          Select file
        </button>
        <p className="text-xs text-gray-600 font-bold uppercase">Mocked control; wire to backend later.</p>
      </div>
    </div>
  );
}
