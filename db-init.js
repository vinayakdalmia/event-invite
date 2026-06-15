import { Client } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_en0fNFmpIUw6@ep-wild-block-aik1cgr6-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({
  connectionString: connectionString,
});

async function initDb() {
  try {
    await client.connect();
    console.log("Connected to database successfully!");
    
    // Create the rsvps table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        attending_as VARCHAR(100),
        theatrical VARCHAR(50),
        time_slot VARCHAR(100),
        source VARCHAR(100),
        notes TEXT,
        excitement INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'rsvps' created or already exists.");
  } catch (err) {
    console.error("Error connecting or creating table:", err);
  } finally {
    await client.end();
  }
}

initDb();
