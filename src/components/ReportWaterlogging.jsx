import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDataContext } from '../context/DataContext';

const ReportWaterlogging = ({ onReportSubmit }) => {
  const { wards } = useDataContext();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ward: '',
    location: '',
    severity: 'Medium',
    comment: '',
    timestamp: null
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const report = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // Store in localStorage
    const existingReports = JSON.parse(localStorage.getItem('waterlogReports') || '[]');
    existingReports.push(report);
    localStorage.setItem('waterlogReports', JSON.stringify(existingReports));

    // Callback to parent
    if (onReportSubmit) {
      onReportSubmit(report);
    }

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowModal(false);
      setFormData({
        ward: '',
        location: '',
        severity: 'Medium',
        comment: '',
        timestamp: null
      });
    }, 2000);
  };

  // Modal component to be rendered via portal
  const ModalContent = () => (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ position: 'fixed' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setShowModal(false)}
        aria-hidden="true"
      />
      
      {/* Modal Dialog */}
      <div 
        className="relative bg-white border-2 border-gray-400 shadow-lg max-w-md w-full p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Report Water-Logging</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-900 text-2xl leading-none font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {showSuccess ? (
          <div className="bg-green-50 border border-green-600 p-6 text-center">
            <div className="text-5xl mb-3 text-green-700">✓</div>
            <h4 className="text-lg font-bold text-green-900 mb-2 uppercase">Report Submitted!</h4>
            <p className="text-green-800 font-semibold text-sm uppercase">Thank you for reporting. Municipal teams have been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">
                Ward <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="w-full border border-gray-400 px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-gray-900 font-medium"
              >
                <option value="">Select Ward</option>
                {wards.map((ward) => (
                  <option key={ward.properties?.wardId} value={ward.properties?.wardName}>
                    {ward.properties?.wardName} (Ward {ward.properties?.wardId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">
                Location / Landmark <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Near Central Park, Main Road"
                className="w-full border border-gray-400 px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">
                Severity <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((severity) => (
                  <button
                    key={severity}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity })}
                    className={`py-2 px-4 border font-bold uppercase text-xs tracking-wide transition-all ${
                      formData.severity === severity
                        ? severity === 'Low'
                          ? 'bg-green-800 text-white border-green-900'
                          : severity === 'Medium'
                          ? 'bg-orange-700 text-white border-orange-800'
                          : 'bg-red-800 text-white border-red-900'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 uppercase tracking-wide">
                Additional Details (Optional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Describe the situation..."
                rows="3"
                className="w-full border border-gray-400 px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-gray-900 font-medium"
              />
            </div>

            <div className="bg-blue-50 border border-blue-300 p-3 text-xs text-blue-900 font-semibold uppercase">
              <strong>Note:</strong> Your report will be sent to MCD control room for immediate action.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 border border-blue-950 transition-colors uppercase tracking-wide text-sm"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold border border-gray-400 transition-colors uppercase tracking-wide text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
      >
        Report Water-Logging
      </button>

      {/* Render modal via portal to document.body */}
      {showModal && createPortal(<ModalContent />, document.body)}
    </>
  );
};

export default ReportWaterlogging;
