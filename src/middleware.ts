import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  // If you have a custom domain add it below to the
  // space separated frame-ancestors list.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://api.airtable.com;
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    connect-src 'self' https://api.airtable.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors https://dashboard.copilot.com/ https://*.copilot.app/;
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Create response object and set CSP
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', cspHeader);

  // Copy all request headers to the response, then override CSP
  for (const [key, value] of request.headers) {
    response.headers.set(key, value);
  }
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce); 
  
  return response;
}
