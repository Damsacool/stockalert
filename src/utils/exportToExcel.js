import * as XLSX from 'xlsx'

export const exportToExcel = (products) => {
// Excel data
    const excelData = products.map(product => ({
        'Nom du Produit': product.name,
        'Stock Actuel': product.stock,
        'Stock Minimum': product.minStock,
        'Prix d\'Achat (CFA)': product.costPrice || 'N/A',
        'Prix de Vente (CFA)': product.sellingPrice || 'N/A',
        'Profit/Unité (CFA)': product.sellingPrice && product.costPrice ? product.sellingPrice - product.costPrice : 'N/A',
        'Valeur Stock (CFA)': product.costPrice ? product.stock * product.costPrice : 'N/A',
        'Statut': product.stock <= product.minStock ? 'STOCK BAS ⚠️' : 'Normal ✓', 
        'Nombre d\'Image': product.images?.length || 0
    }));

    // Workbook and WorkSsheet creation
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventaire');

    // Autosize columns
    const maxWidth = 30;
    const columnWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.min(maxWidth, Math.max(key.length, 12))
    }))
    worksheet['!cols'] = columnWidths;

    // Generate file name with date
    const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    const filename = `Inventaire_StockAlert_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);

    return filename;
}

// Export summary report
export const exportSummaryReport = (products) => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

    const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * (p.costPrice || 0), 0);
    const potentialRevenue = products.reduce((sum, p) => sum + p.stock * (p.sellingPrice || 0), 0);

    const summaryData = [
        {'Métrique': 'Total Produits', 'Valeur': totalProducts},
        {'Métrique': 'Total Article en Stock', 'Valeur': totalStock},
        {'Métrique': 'Produits Stock Bas', 'Valeur': lowStockCount},
        {'Métrique': 'Valeur Inventaire (CFA)', 'Valeur': totalInventoryValue.toLocaleString() },
        {'Métrique': 'Revenu Potentiel (CFA)', 'Valeur': potentialRevenue.toLocaleString() },
        {'Métrique': 'Profit Potentiel (CFA)', 'Valeur': (potentialRevenue - totalInventoryValue).toLocaleString() }
    ];

    const productData = products.map(product => ({
        'Nom': product.name,
        'Stock': product.stock,
        'Min': product.minStock,
        'Prix Achat': product.costPrice || 0,
        'Prix Vente': product.sellingPrice || 0,
        'Profit/Unité': (product.sellingPrice || 0) - (product.costPrice || 0),
        'Valeur Stock': product.stock * (product.costPrice || 0),
        'Statut': product.stock <= product.minStock ? 'BAS' : 'OK'
    }));

    // Workbook, Worksheet and detailed product sheets creation
    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

    const productSheet = XLSX.utils.json_to_sheet(productData);
    XLSX.utils.book_append_sheet(workbook, productSheet, 'Détails Produits');

    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    const filename = `Rapport_Résumé_StockAlert_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);

    return filename;
}