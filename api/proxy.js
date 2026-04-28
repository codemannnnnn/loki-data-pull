export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // Read raw body since bodyParser is disabled
    const rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    const response = await fetch(
      "https://lokidev.glsuite.us/UI/api/UITierService/ProcessDocument",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: rawBody,
      }
    );

    const text = await response.text();
    res.status(response.status).send(text);

  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
}