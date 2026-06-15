import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Handle the typo DABASE_URL or standard DATABASE_URL
  const connectionString = process.env.DATABASE_URL || process.env.DABASE_URL;

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

    res.status(200).json({ message: 'RSVP successful!', id: result.rows[0].id });
  } catch (error) {
    console.error("Error inserting RSVP:", error);
    res.status(500).json({ message: 'Failed to submit RSVP.', error: error.message });
  } finally {
    await client.end();
  }
}
