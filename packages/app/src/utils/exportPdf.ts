export const exportCommercialPdf = (title: string, contentHtml: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const fullDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 40px;
            color: #0f172a;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            color: #059669;
            letter-spacing: -0.5px;
          }
          .badge {
            background: #ecfdf5;
            color: #047857;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid #a7f3d0;
          }
          .title {
            font-size: 22px;
            font-weight: 800;
            margin-bottom: 8px;
            color: #0f172a;
          }
          .meta {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 24px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 30px;
          }
          .table th {
            background: #f8fafc;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            font-weight: 700;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
          }
          .table td {
            padding: 12px;
            font-size: 13px;
            border-bottom: 1px solid #f1f5f9;
          }
          .total-row {
            font-weight: 800;
            font-size: 16px;
            color: #059669;
            background: #ecfdf5;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">OMNI-GRID PAKISTAN</div>
          <div class="badge">OFFICIAL VERIFIED DOCUMENT</div>
        </div>

        <div class="title">${title}</div>
        <div class="meta">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Escrow Security ID: OG-VERIFIED-991204</div>

        ${contentHtml}

        <div class="footer">
          OMNI-GRID Pakistan Omnichannel Ad Network • Licensed & Registered Media Infrastructure • Verified Escrow Guarantee
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(fullDoc);
  printWindow.document.close();
};
