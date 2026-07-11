"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "32px",
            background:
              "linear-gradient(135deg, #07111f 0%, #101b3d 50%, #130f2f 100%)",
            color: "#ffffff",
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <section
            style={{
              maxWidth: "560px",
              width: "100%",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "28px",
              padding: "32px",
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
              backdropFilter: "blur(20px)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#93c5fd",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              OSO Runtime Recovery
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
              }}
            >
              Something went wrong.
            </h1>

            <p
              style={{
                margin: "18px 0 0",
                color: "rgba(255,255,255,0.78)",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              The platform could not complete this request. You can safely retry
              without losing your session.
            </p>

            <button
              onClick={reset}
              style={{
                marginTop: "24px",
                minHeight: "46px",
                border: 0,
                borderRadius: "999px",
                padding: "0 22px",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#ffffff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Try again
            </button>

            {error.digest ? (
              <p
                style={{
                  marginTop: "18px",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                }}
              >
                Error reference: {error.digest}
              </p>
            ) : null}
          </section>
        </main>
      </body>
    </html>
  );
}
