import React from 'react';
import { Printer, AlertTriangle, Download } from 'lucide-react';

const PrintReports = ({ products, onExport, onExportSummary }) => {
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const totalInventoryValue = products.reduce((sum, p) => 
    sum + (p.stock *(p.costPrice || 0)), 0
    );

    const handlePrintInventory = () => {
        const printWindow = window.open('', '_blank');
        const date = new Date().toLocaleString('fr-FR');

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Inventaire - ${date}</title>
            <style>
             * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #667eea; 
            font-size: 28px;
            margin-bottom: 5px;
          }
          .header p { 
            color: #666; 
            font-size: 14px;
          }
          .summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-around;
          }
          .summary-item {
            text-align: center;
          }
          .summary-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-top: 5px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 20px;
            table-layout: fixed; 
          }
          th { 
            background: #667eea; 
            color: white; 
            padding: 12px 8px;
            text-align: left;
            font-size: 11px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td { 
            padding: 10px 8px; 
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px; 
            word-wrap: break-word; 
          }
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .low-stock {
            background: #fee2e2 !important;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
          }
          .status-low {
            background: #dc2626;
            color: white;
          }
          .status-ok {
            background: #10b981;
            color: white;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
            </style>
        </head>
        <body>
        <div class='header'>
        <h1>Mon Stock Alerte</h2>
        <p>Rapport d'Inventaire ${date}</p>
        </div>

        <div class='summary'>
            <div class='summary-item'>
                <div class='summary-label'>Total Produits</div>
                <div class='summary-value'>${products.length}</div>
            </div>
                <div class="summary-item">
                <div class="summary-label">Articles en Stock</div>
                <div class="summary-value">${products.reduce((sum, p) => sum + p.stock, 0)}</div>
            </div>
                <div class="summary-item">
                <div class="summary-label">Stock Bas</div>
                <div class="summary-value" style="color: #dc2626">${lowStockProducts.length}</div>
            </div>
                <div class="summary-item">
                <div class="summary-label">Valeur Totale</div>
                <div class="summary-value">${totalInventoryValue.toLocaleString()} CFA</div>
            </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Produit</th>
              <th style="width: 10%;">Stock</th>
              <th style="width: 10%;">Min</th>
              <th style="width: 15%;">Prix Achat</th>
              <th style="width: 15%;">Prix Vente</th>
              <th style="width: 15%;">Valeur Stock</th>
              <th style="width: 10%;">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr class="${p.stock <= p.minStock ? 'low-stock' : ''}">
                <td style="width: 25%;"><strong>${p.name}</strong></td>
                <td style="width: 10%;">${p.stock}</td>
                <td style="width: 10%;">${p.minStock}</td>
                <td style="width: 15%;">${(p.costPrice || 0).toLocaleString()} CFA</td>
                <td style="width: 15%;">${(p.sellingPrice || 0).toLocaleString()} CFA</td>
                <td style="width: 15%;">${((p.stock * (p.costPrice || 0))).toLocaleString()} CFA</td>
                <td style="width: 10%;">
                  <span class="status-badge ${p.stock <= p.minStock ? 'status-low' : 'status-ok'}">
                    ${p.stock <= p.minStock ? 'STOCK BAS' : 'NORMAL'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class='footer'>
          <p>Document généré le ${new Date().toLocaleString('fr-FR')}</p>
          <p>StockAlert - Système de Gestion d'Inventaire</p>
          </div>
        </body>
     </html>
    `;  

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout (() => printWindow.print(), 250);
    };

    const handlePrintLowStock = () => {
        const printWindow = window.open('', '_blank');
        const date = new Date().toLocaleString('fr-FR');

        const html = `
        <!DOCTYPE html>
        <html>
        <body>
            <title> ALerte Stock Bas ${date}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #dc2626; 
            font-size: 28px;
            margin-bottom: 5px;
          }
          .alert-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .header p { 
            color: #666; 
            font-size: 14px;
          }
          .alert-box {
            background: #fee2e2;
            border: 2px solid #dc2626;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
          }
          .alert-box h2 {
            color: #dc2626;
            font-size: 20px;
            margin-bottom: 10px;
          }
          .alert-box p {
            color: #991b1b;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 20px;
          }
          th { 
            background: #dc2626; 
            color: white; 
            padding: 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
          }
          td { 
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          tr {
            background: #fee2e2;
          }
          .qty-needed {
            font-weight: bold;
            color: #dc2626;
            font-size: 16px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class='header'>
            <div class='alert-icon'>⚠️</div>
            <h1>Alerte Stock Bas</h1>
            <p>Liste de Réapprovisionnement - ${date}</p>
            </div>

            <div class='alert-box'>
                <h2>${lowStockProducts.length} Produit(s) en Stock Bas</h2>
                <p>Ces produits doivent être réapprovisionnés rapidement</p>
                </div>

                ${lowStockProducts.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: #10b981;">
                <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
                <h2 style="color: #10b981;">Aucun Produit en Stock Bas</h2>
                <p style="color: #666;">Tous les produits ont un stock suffisant</p>
            </div>
            ` : `
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Stock Actuel</th>
                        <th>Stock Minimum</th>
                        <th>Quantité à commander</th>
                        <th>Prix Achat Unitaire</th>
                        <th>Coût Total Estimé</th>
                    </tr>
                </thead>
                <tbody>
                ${lowStockProducts.map(p => {
                    const qtyNeeded = Math.max(p.minStock * 2 - p.stock, p.minStock);
                    const totalCost = qtyNeeded * (p.costPrice || 0);
                    return `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td>${p.stock}</td>
                        <td>${p.minStock}</td>
                        <td class='qty-needed'>${qtyNeeded}</td>
                        <td>${(p.costPrice || 0 ).toLocaleString()} CFA</td>
                        <td>${totalCost.toLocaleString()} CFA</td>
                    </tr>
                    `;

                }).join('')}
                <tr style="background: #f3f4f6; font-weight: bold;">
                    <td colspan="5" style="text-align: right; padding-right: 20px;">
                    TOTAL À PRÉVOIR:
                </td>
                <td style="font-size: 18px; color: #dc2626;">
                  ${lowStockProducts.reduce((sum, p) => {
                    const qtyNeeded = Math.max(p.minStock * 2 - p.stock, p.minStock);
                    return sum + (qtyNeeded * (p.costPrice || 0));
                  }, 0).toLocaleString()} CFA
                </td>
              </tr>
            </tbody>
          </table>
        `}

                <div class='footer'>
                    <p>Document généré le ${new Date().toLocaleString('fr-FR')}</p>
                    <p>À présenter au fournisseur pour réapprovisionnement</p>
                </div>
            </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
    };

    return (
    <div className="print-reports-container">
      <div className="reports-header">
        <div className="reports-title-section">
          <h2><Printer size={24} className="report-icon" /> Rapports & Impressions</h2>
          <p>Générez et imprimez vos rapports d'inventaire</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="reports-stats-bar">
        <div className="stat-pill">
          <span className="stat-label">Total Produits:</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-pill alert">
          <span className="stat-label">Stock Bas:</span>
          <span className="stat-value">{lowStockProducts.length}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">Valeur Totale:</span>
          <span className="stat-value">{totalInventoryValue.toLocaleString()} CFA</span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid-modern">
        {/* Print Full Inventory */}
        <div className="report-card-modern primary">
          <div className="report-card-header">
            <div className="report-icon-modern">
              <Printer size={28} />
            </div>
            <div className="report-badge">Recommandé</div>
          </div>
          
          <div className="report-card-body">
            <h3>Inventaire Complet</h3>
            <p>Liste détaillée de tous les produits avec prix, stocks et valeurs</p>
            
            <ul className="report-features">
              <li>✓ {products.length} produits listés</li>
              <li>✓ Prix d'achat et de vente</li>
              <li>✓ Valeur totale du stock</li>
              <li>✓ Alertes stock bas</li>
            </ul>
          </div>

          <button 
            className="btn-report-modern btn-primary-modern"
            onClick={handlePrintInventory}
          >
            <Printer size={20} />
            Imprimer l'Inventaire
          </button>
        </div>

        {/* Print Low Stock */}
        <div className={`report-card-modern ${lowStockProducts.length > 0 ? 'danger' : 'success'}`}>
          <div className="report-card-header">
            <div className="report-icon-modern">
              <AlertTriangle size={28} />
            </div>
            {lowStockProducts.length > 0 && (
              <div className="report-badge alert">Action requise</div>
            )}
          </div>
          
          <div className="report-card-body">
            <h3>Alerte Stock Bas</h3>
            <p>Liste de réapprovisionnement avec quantités suggérées et coûts</p>
            
            <ul className="report-features">
              <li>{lowStockProducts.length === 0 ? '✓' : '⚠️'} {lowStockProducts.length} produit(s) en alerte</li>
              <li>✓ Quantités à commander</li>
              <li>✓ Coût total estimé</li>
              <li>✓ Prêt pour fournisseur</li>
            </ul>
          </div>

          <button 
            className={`btn-report-modern ${lowStockProducts.length > 0 ? 'btn-danger-modern' : 'btn-success-modern'}`}
            onClick={handlePrintLowStock}
          >
            <Printer size={20} />
            {lowStockProducts.length > 0 ? 'Imprimer Alerte' : 'Tout est OK'}
          </button>
        </div>

        {/* Export Excel */}
        <div className="report-card-modern excel">
          <div className="report-card-header">
            <div className="report-icon-modern">
              <Download size={28} />
            </div>
            <div className="report-badge">2 formats</div>
          </div>
          
          <div className="report-card-body">
            <h3>Export Excel</h3>
            <p>Téléchargez vos données au format Excel pour partage et analyse</p>
            
            <ul className="report-features">
              <li>✓ Format simple (1 feuille)</li>
              <li>✓ Format complet (résumé + détails)</li>
              <li>✓ Compatible Excel/Google Sheets</li>
              <li>✓ Nom de fichier daté</li>
            </ul>
          </div>

          <div className="excel-buttons">
            <button 
              className="btn-excel-modern"
              onClick={onExport}
            >
              <Download size={18} />
              Simple
            </button>
            <button 
              className="btn-excel-modern"
              onClick={onExportSummary}
            >
              <Download size={18} />
              Complet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintReports;