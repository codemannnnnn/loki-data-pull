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
        headers: { "Content-Type": "application/xml" },
        body: rawBody,
      }
    );

    const xmlText = await response.text();

    // Parse XML rows into JSON array
    const rowRegex = /<row\s([^/]*?)\/>/gs;
    const attrRegex = /(\w+)="([^"]*)"/g;
    const rows = [];

    let rowMatch;
    while ((rowMatch = rowRegex.exec(xmlText)) !== null) {
      const attrs = {};
      let attrMatch;
      while ((attrMatch = attrRegex.exec(rowMatch[1])) !== null) {
        // Clean up column names (e.g. Task_x0020_ID -> Task_ID)
        const key = attrMatch[1].replace(/_x0020_/g, "_");
        attrs[key] = attrMatch[2];
      }
      rows.push(attrs);
    }

    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}