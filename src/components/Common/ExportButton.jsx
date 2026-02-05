import React, {useState} from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

const ExportButton = ({ onExport, onExportSummary }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="export-container">
            <button className="btn-export" onClick={() => setShowMenu(!showMenu)}>
                <Download size={20} />
                <span>Exporter</span>
            </button>

        {showMenu && (
            <div className="export-menu">
            <button 
                className="export-option"
                onClick={() => {
                onExport();
                setShowMenu(false);
                }}
            >

                <FileSpreadsheet size={18} />
                <div>
                <p className="export-title">Inventaire Simple</p>
                <p className="export-desc">Liste complète des produits</p>
            </div>
            </button>

            <button
            className="export-option"
            onClick={() => {
                onExportSummary();
                setShowMenu(false);
            }}
            >
                <FileText size={18} />
                <div>
                    <p className="option-title">Rapport Complet</p>
                    <p className="option-desc">Résumé + détails produits</p>
                </div>
            </button>
            </div>
        )}
        </div>
    );
};

export default ExportButton;