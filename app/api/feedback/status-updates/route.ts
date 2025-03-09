// Keep track of connected clients
export const clients = new Set<{
  id: string;
  writer: WritableStreamDefaultWriter<Uint8Array>;
}>();

export async function GET(request: Request) {
  // Set headers for SSE
  const responseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Keep track of this connection
  const clientId = Math.random().toString(36).substring(7);
  console.log(`Client connected: ${clientId}`);

  // Add client to the set
  const client = { id: clientId, writer };
  clients.add(client);

  // Send initial message
  const initialMessage = { type: "connection", clientId };
  writer.write(encoder.encode(`data: ${JSON.stringify(initialMessage)}\n\n`));

  // Handle client disconnect
  request.signal.addEventListener("abort", () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(client);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: responseHeaders,
  });
}
