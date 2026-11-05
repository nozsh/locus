export default {
  async fetch(request, env, ctx) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>nzsh | Maintenance</title>
        <link rel="stylesheet" href="https://cdn.nzsh.cc/service/service.css?v=1">
        <script src="https://cdn.nzsh.cc/service/service.js?v=1" defer></script>
        <meta name="color-scheme" content="dark">
        <meta name="darkreader-lock" />
      </head>

      <body>
        <h1>
          <span class="spin" data-spinner="braille" aria-hidden="true">⠋</span>Maintenance
        </h1>
        <p role="status">
          <span class="spin" data-spinner="stars" aria-hidden="true">·</span>PLEASE STAND BY.
        </p>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "3600"
      }
    });
  }
};
