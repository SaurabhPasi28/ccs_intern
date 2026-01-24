// Reusable Section Card Component
export const SectionCard = ({ title, onAdd, children, addLabel = "Add" }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        aria-label={addLabel}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">{addLabel}</span>
                    </button>
                )}
            </div>
            {children}
        </div>
    );
};
