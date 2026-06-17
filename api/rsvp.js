import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get standard DATABASE_URL
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("Database URL is not configured in environment variables.");
    return res.status(500).json({ message: 'Database configuration missing.' });
  }

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();

    const data = req.body;
    
    // Extract fields
    const { name, phone, attending_as, theatrical, time_slot, source, notes, excitement } = data;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    const query = `
      INSERT INTO rsvps (name, phone, attending_as, theatrical, time_slot, source, notes, excitement)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

    const values = [
      name,
      phone,
      attending_as || null,
      theatrical || null,
      time_slot || null,
      source || null,
      notes || null,
      excitement ? parseInt(excitement, 10) : null
    ];

    const result = await client.query(query, values);

    // --- GOOGLE SHEETS WEBHOOK INTEGRATION ---
    const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/a/macros/vedajewel.co/s/AKfycbzGY84SuO015c0JDB-GyJk1PbfvqbJ4ElKM94kC3emHve1tA9w4eyAAGtGejTc8_6Nb4A/exec";
    
    try {
      // Fire and forget the request to Google Apps Script. 
      // We don't await the response body to avoid slowing down the RSVP process.
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log("Successfully forwarded RSVP to Google Sheets");
    } catch (sheetError) {
      // Catch errors silently so it doesn't break the user's RSVP submission if Google API is down
      console.error("Failed to forward RSVP to Google Sheets:", sheetError);
    }

    res.status(200).json({ message: 'RSVP successful!', id: result.rows[0].id });
  } catch (error) {
    console.error("Error inserting RSVP:", error);
    res.status(500).json({ message: 'Failed to submit RSVP.', error: error.message });
  } finally {
    await client.end();
  }
}
