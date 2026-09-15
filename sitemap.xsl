<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Kindle Womb IVF &amp; Fertility Centre</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;600;700&amp;family=Playfair+Display:wght@600;700&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          body {
            font-family: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #2C3E50;
            background-color: #F8FAFC;
            margin: 0;
            padding: 0;
          }
          .sitemap-header {
            background: linear-gradient(135deg, #2C3E50 0%, #36507A 100%);
            color: #FFFFFF;
            padding: 40px 24px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .header-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
          }
          .header-title h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            margin: 0 0 8px 0;
            color: #FFFFFF;
          }
          .header-title p {
            margin: 0;
            font-size: 1rem;
            color: #E2E8F0;
          }
          .stat-badge {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.25);
            padding: 12px 24px;
            border-radius: 12px;
            text-align: center;
          }
          .stat-badge .count {
            font-size: 1.8rem;
            font-weight: 700;
            color: #F2B830;
            display: block;
            line-height: 1;
          }
          .stat-badge .label {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #E2E8F0;
            margin-top: 4px;
          }
          .content-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 24px;
          }
          .table-wrapper {
            background: #FFFFFF;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(90, 115, 156, 0.08);
            border: 1px solid #E2E8F0;
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background-color: #F1F5F9;
            color: #36507A;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 16px 20px;
            border-bottom: 2px solid #CBD5E1;
          }
          td {
            padding: 14px 20px;
            border-bottom: 1px solid #E2E8F0;
            font-size: 0.92rem;
          }
          tr:hover {
            background-color: #F8FAFC;
          }
          a {
            color: #36507A;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
            transition: color 0.2s ease;
          }
          a:hover {
            color: #E74C3C;
            text-decoration: underline;
          }
          .priority-pill {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            background: #EFF6FF;
            color: #1E40AF;
          }
          .priority-high {
            background: #FEF3C7;
            color: #92400E;
          }
          .footer-note {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 50px;
            font-size: 0.85rem;
            color: #64748B;
          }
        </style>
      </head>
      <body>
        <div class="sitemap-header">
          <div class="header-container">
            <div class="header-title">
              <h1>XML Sitemap Index</h1>
              <p>Kindle Womb IVF &amp; Fertility Centre — Official Canonical Sitemap</p>
            </div>
            <div class="stat-badge">
              <span class="count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span>
              <span class="label">Total Indexable URLs</span>
            </div>
          </div>
        </div>

        <div class="content-container">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 55%;">URL Destination</th>
                  <th style="width: 15%;">Priority</th>
                  <th style="width: 15%;">Change Frequency</th>
                  <th style="width: 15%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="priority-pill">
                        <xsl:if test="sitemap:priority &gt;= 0.9">
                          <xsl:attribute name="class">priority-pill priority-high</xsl:attribute>
                        </xsl:if>
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <div class="footer-note">
            This XML sitemap is compliant with standard search engine protocols (Google, Bing, Yandex). Generated by Kindle Womb SEO Architecture.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
