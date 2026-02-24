async function asJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function print(id, data) {
  document.getElementById(id).textContent = JSON.stringify(data, null, 2);
}

document.getElementById('healthBtn').addEventListener('click', async () => {
  const res = await fetch('/health');
  print('healthResult', await asJson(res));
});

document.getElementById('entityForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const payload = Object.fromEntries(form.entries());

  const res = await fetch('/api/v1/entities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  print('entityResult', await asJson(res));
});

document.getElementById('listEntitiesBtn').addEventListener('click', async () => {
  const res = await fetch('/api/v1/entities');
  print('entitiesResult', await asJson(res));
});

document.getElementById('webhookForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);

  let parsedPayload = {};
  try {
    parsedPayload = JSON.parse(form.get('payload'));
  } catch {
    print('webhookResult', { error: 'Invalid JSON payload' });
    return;
  }

  const payload = {
    source: form.get('source'),
    event: form.get('event'),
    payload: parsedPayload
  };

  const res = await fetch('/api/v1/webhooks/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  print('webhookResult', await asJson(res));
});
