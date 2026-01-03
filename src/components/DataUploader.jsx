import React from "react";

export default function DataUploader() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase text-slate-400 tracking-[0.15em]">Data</p>
          <h2 className="text-lg font-semibold">Upload New Layers</h2>
        </div>
        <span className="text-xs text-slate-400">CSV / GeoJSON</span>
      </div>

      <div className="space-y-3 text-sm text-slate-300">
        <p>Drop rainfall series, drainage lines, or ward GeoJSON to refresh the map.</p>
        <button className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 transition px-3 py-2 text-left">
          Select file
        </button>
        <p className="text-xs text-slate-500">Mocked control; wire to backend later.</p>
      </div>
    </div>
  );
}
