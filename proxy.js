export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const response = await fetch(
      "https://lokidev.glsuite.us/UI/api/UITierService/ProcessDocument",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: req.body,
      }
    );

    const text = await response.text();
    res.status(response.status).send(text);

  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
}
