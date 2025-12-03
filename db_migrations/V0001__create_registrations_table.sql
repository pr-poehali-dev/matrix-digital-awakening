CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    pill_choice VARCHAR(10) NOT NULL CHECK (pill_choice IN ('red', 'blue')),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_confirmed BOOLEAN DEFAULT FALSE,
    confirmation_token VARCHAR(64),
    confirmed_at TIMESTAMP
);

CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_confirmed ON registrations(is_confirmed);