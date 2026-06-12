/**
 * Export Utility — Excel & PDF
 * Library: xlsx (SheetJS) + jsPDF + jsPDF-AutoTable
 */

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────

export const exportMembersToExcel = async (members) => {
    const XLSX = await import('xlsx');

    const rows = members.map((m, i) => ({
        No: i + 1,
        'Kode Member': m.memberCode,
        'Nama Lengkap': m.fullName,
        Email: m.email,
        'No. HP': m.phone,
        'Saldo Poin': m.pointBalance,
        'Total Poin Lifetime': m.totalPointsEarned || 0,
        Tier: m.tier || 'BRONZE',
        Status: m.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif',
        'Tanggal Bergabung': new Date(m.createdAt).toLocaleDateString('id-ID'),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    ws['!cols'] = [
        { wch: 4 }, { wch: 14 }, { wch: 22 }, { wch: 26 },
        { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 10 },
        { wch: 10 }, { wch: 18 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, `LoyaltyOS_Members_${formatFileDate()}.xlsx`);
};

export const exportTransactionsToExcel = async (transactions) => {
    const XLSX = await import('xlsx');

    const rows = transactions.map((t, i) => ({
        No: i + 1,
        'No. Transaksi': t.transactionNumber,
        Member: t.member?.fullName || '-',
        'Kode Member': t.member?.memberCode || '-',
        'Total Belanja': t.totalAmount,
        'Poin Diperoleh': t.earnedPoints,
        Tanggal: new Date(t.transactionDate).toLocaleDateString('id-ID'),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
        { wch: 4 }, { wch: 22 }, { wch: 22 }, { wch: 14 },
        { wch: 14 }, { wch: 14 }, { wch: 16 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `LoyaltyOS_Transactions_${formatFileDate()}.xlsx`);
};

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────

export const exportMembersToPDF = async (members) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'landscape' });

    // Header
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235);
    doc.text('LoyaltyOS — Data Member', 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`, 14, 23);
    doc.text(`Total: ${members.length} member`, 14, 29);

    autoTable(doc, {
        startY: 34,
        head: [['No', 'Kode Member', 'Nama', 'Email', 'Poin', 'Tier', 'Status', 'Bergabung']],
        body: members.map((m, i) => [
            i + 1,
            m.memberCode,
            m.fullName,
            m.email,
            m.pointBalance.toLocaleString('id-ID'),
            m.tier || 'BRONZE',
            m.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif',
            new Date(m.createdAt).toLocaleDateString('id-ID'),
        ]),
        headStyles: {
            fillColor: [37, 99, 235],
            fontSize: 8,
            fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 26 },
            2: { cellWidth: 38 },
            3: { cellWidth: 52 },
        },
    });

    doc.save(`LoyaltyOS_Members_${formatFileDate()}.pdf`);
};

export const exportTransactionsToPDF = async (transactions) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'landscape' });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPoints = transactions.reduce((sum, t) => sum + t.earnedPoints, 0);

    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235);
    doc.text('LoyaltyOS — Laporan Transaksi', 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`, 14, 23);
    doc.text(
        `Total ${transactions.length} transaksi | Revenue: Rp ${totalRevenue.toLocaleString('id-ID')} | Poin: ${totalPoints.toLocaleString('id-ID')}`,
        14, 29
    );

    autoTable(doc, {
        startY: 34,
        head: [['No', 'No. Transaksi', 'Member', 'Total Belanja', 'Poin', 'Tanggal']],
        body: transactions.map((t, i) => [
            i + 1,
            t.transactionNumber,
            t.member?.fullName || '-',
            `Rp ${t.totalAmount.toLocaleString('id-ID')}`,
            `+${t.earnedPoints}`,
            new Date(t.transactionDate).toLocaleDateString('id-ID'),
        ]),
        headStyles: { fillColor: [37, 99, 235], fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        foot: [[
            '', '', 'TOTAL',
            `Rp ${totalRevenue.toLocaleString('id-ID')}`,
            totalPoints.toLocaleString('id-ID'),
            '',
        ]],
        footStyles: { fillColor: [239, 246, 255], textColor: [37, 99, 235], fontStyle: 'bold', fontSize: 8 },
    });

    doc.save(`LoyaltyOS_Transactions_${formatFileDate()}.pdf`);
};

// ─── HELPER ───────────────────────────────────────────────────────────────────
const formatFileDate = () => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
};