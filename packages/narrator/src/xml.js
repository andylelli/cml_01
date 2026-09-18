const XML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

/**
 * Escape text for inclusion in an SSML document.
 *
 * This lives apart from the Azure client on purpose: SSML assembly is pure and
 * testable with no credentials in sight, and nothing that merely builds markup
 * should have to import a network client to do it.
 */
export function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => XML_ESCAPES[ch]);
}
