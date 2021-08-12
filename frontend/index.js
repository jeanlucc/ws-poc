(async function() {
  const ws = await connectToServer();

  document.body.onmousemove = (evt) => {
    const messageBody = createMessage({ x: evt.clientX, y: evt.clientY });
    ws.send(JSON.stringify(messageBody));
  };

  ws.onmessage = (webSocketMessage) => {
    const messageBody = JSON.parse(webSocketMessage.data);
    const payload = extractPayload(messageBody);
    const cursor = getOrCreateCursorFor(payload);
    cursor.style.transform = `translate(${payload.x}px, ${payload.y}px)`;
  };

  async function connectToServer() {
    const ws = new WebSocket('ws://localhost:7071/ws/');
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if(ws.readyState === 1) {
          clearInterval(timer)
          resolve(ws);
        }
      }, 10);
    });
  }

  function createMessage(messageBody) {
    return { payload: messageBody, meta: { emitTimestamp: Date.now() } }

  }

  function extractPayload(messageBody) {
    return messageBody.payload
  }

  function getOrCreateCursorFor(payload) {
    const sender = payload.sender;
    const existing = document.querySelector(`[data-sender='${sender}']`);
    if (existing) {
      return existing;
    }

    const template = document.getElementById('cursor');
    const cursor = template.content.firstElementChild.cloneNode(true);
    const svgPath = cursor.getElementsByTagName('path')[0];

    cursor.setAttribute("data-sender", sender);
    svgPath.setAttribute('fill', `hsl(${payload.color}, 50%, 50%)`);
    document.body.appendChild(cursor);

    return cursor;
  }
})();
